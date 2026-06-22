import {
  ArchiveIcon,
  BackpackIcon,
  CheckIcon,
  CookieIcon,
  CopyIcon,
  InfoCircledIcon,
  ListBulletIcon,
  ResetIcon,
  TrashIcon,
} from "@radix-ui/react-icons"
import React, { useMemo } from "react"

import { LABEL_COLOR_CLASSES } from "../../lib/labels"
import {
  JOB_LABELS,
  Job,
  JobLabel,
  JobStatus,
  getRelativeTimeString,
} from "@alertemploi/core"
import { useSites } from "../../hooks/useSites"
import { useLinks } from "../../hooks/useLinks"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "../../hooks/useToast"

import { DeleteJobDialog } from "./deleteJobDialog"
import clsx from "clsx"

function isJobLabel(value: JobLabel): value is JobLabel {
  return Object.values(JOB_LABELS).includes(value)
}

/**
 * Small action button with an icon and a visible label underneath.
 * Used for the secondary job actions (apply, archive, copy, delete, etc.)
 */
function ActionButton({
  icon,
  label,
  onClick,
  variant = "secondary",
}: {
  icon: React.ReactNode
  label: string
  onClick: (e: React.MouseEvent) => void
  variant?: "secondary" | "destructive"
}) {
  const isDestructive = variant === "destructive"
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={clsx(
        "flex w-16 flex-col items-center gap-1 rounded-md px-1 py-2 transition-colors duration-200 ease-in-out",
        isDestructive
          ? "bg-destructive/10 hover:bg-destructive/20 focus:bg-destructive/20"
          : "bg-border hover:bg-foreground/15 focus:bg-foreground/15",
      )}
    >
      <span className={isDestructive ? "text-destructive" : "text-foreground"}>
        {icon}
      </span>
      <span
        className={clsx(
          "text-center text-[10px] leading-tight",
          isDestructive ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </button>
  )
}

/**
 * Job summary component.
 */
export function JobSummary({
  job,
  onView,
  onUpdateJobStatus,
  onUpdateLabels,
  onOpenUrl,
}: {
  job: Job
  onView: (job: Job) => void
  onUpdateJobStatus: (jobId: number, status: JobStatus) => void
  onUpdateLabels: (jobId: number, labels: JobLabel[]) => void
  onOpenUrl: (url: string) => void
}) {
  const { siteLogos } = useSites()
  const { links } = useLinks()

  const usedLink = useMemo(() => {
    return links.find((l) => l.id === job.link_id)
  }, [links, job.link_id])

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  return (
    <div className="w-full rounded-lg border border-muted p-4 lg:p-6">
      <div className="flex items-start justify-between gap-4 lg:gap-6">
        <div>
          {/* search site */}
          {usedLink && (
            <a
              className="flex items-center gap-2 text-sm text-muted-foreground"
              href="#"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onOpenUrl(usedLink.url)
              }}
            >
              <img
                src={siteLogos[usedLink.site_id]}
                alt={usedLink.title}
                className="h-5"
              />
              <span className="truncate max-w-[240px]">
                {" via "}
                {usedLink.title.includes("http") ? "votre alerte" : usedLink.title}
              </span>
            </a>
          )}

          {/* Job title */}
          <h1 className="mt-3 text-wrap font-medium lg:mt-4 lg:text-xl">
            {job.title}
          </h1>

          {/* Company name & location */}
          <p className="text-sm text-muted-foreground">
            {job.companyName}
            {job.location && (
              <span>
                {" · "}
                {job.location}
              </span>
            )}
          </p>
        </div>

        {/* Company logo */}
        <Avatar className="h-16 w-16 border border-muted">
          {job.companyLogo && <AvatarImage src={job.companyLogo} />}
          <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
            {job.companyName?.slice(0, 2).toUpperCase() ?? "??"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Job details */}
      <div className="mt-3 space-y-1.5 lg:mt-4">
        {job.jobType && (
          <div className="flex items-center gap-3 capitalize text-muted-foreground">
            <BackpackIcon className="h-4 w-4" />
            {job.jobType}
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <CookieIcon className="h-4 w-4" />
            {job.salary}
          </div>
        )}
        {job.tags.length > 0 && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <ListBulletIcon className="h-4 w-4" />
            <p className="text-wrap">{job.tags?.slice(0, 5).join(", ")}</p>
          </div>
        )}
      </div>

      {/* Filtered out job explainer */}
      {job.status === "excluded_by_advanced_matching" && job.exclude_reason && (
        <div className="mt-6 rounded-md bg-destructive/10 p-4">
          <div className="flex items-center gap-2">
            <InfoCircledIcon className="h-auto w-5" />
            <p className="font-medium">Pourquoi cette offre a-t-elle été exclue ?</p>
          </div>
          <p className="mt-1">{job.exclude_reason}</p>
        </div>
      )}

      {/* Action buttons */}
      <div
        className={`mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between ${job.status !== "excluded_by_advanced_matching" && "lg:mt-10"}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Open button */}
          <Button
            size="lg"
            className="h-[60px] w-24 self-start text-sm"
            onClick={() => {
              onView(job)
            }}
          >
            Voir
          </Button>

          {/* Apply button */}
          {job.status !== "applied" && (
            <ActionButton
              icon={<CheckIcon className="h-5 w-auto" />}
              label="Postulée"
              onClick={() => onUpdateJobStatus(job.id, "applied")}
            />
          )}

          {/* Back to new button */}
          {job.status !== "new" && (
            <ActionButton
              icon={<ResetIcon className="h-4 w-auto" />}
              label="Nouvelles"
              onClick={() => onUpdateJobStatus(job.id, "new")}
            />
          )}

          {/* Archive button */}
          {job.status !== "archived" && (
            <ActionButton
              icon={<ArchiveIcon className="h-4 w-auto" />}
              label="Archiver"
              onClick={() => onUpdateJobStatus(job.id, "archived")}
            />
          )}

          {/* Copy url button */}
          <ActionButton
            icon={<CopyIcon className="h-4 w-auto" />}
            label="Copier"
            onClick={(evt) => {
              evt.stopPropagation()
              navigator.clipboard.writeText(job.externalUrl)
              toast({
                title: "Lien copié",
                description: "Vous pouvez maintenant le coller.",
                variant: "success",
              })
            }}
          />

          {/* Delete button */}
          <ActionButton
            icon={<TrashIcon className="h-5 w-auto" />}
            label="Supprimer"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          />

          <DeleteJobDialog
            isOpen={isDeleteDialogOpen}
            job={job}
            onClose={() => setIsDeleteDialogOpen(false)}
            onDelete={() => onUpdateJobStatus(job.id, "deleted")}
          />
        </div>

        {/* Label selector */}
        <JobLabelSelector
          className="w-full sm:ml-16 sm:w-auto"
          job={job}
          onUpdateLabels={onUpdateLabels}
        />
      </div>

      {/* Timestamp */}
      <p className="mt-2 text-xs text-foreground/80">
        détectée {getRelativeTimeString(new Date(job.created_at))}
      </p>
    </div>
  )
}

/**
 * Label selector component. For now we only allow setting one label per job.
 */
function JobLabelSelector({
  job,
  onUpdateLabels,
  className,
}: {
  job: Job
  onUpdateLabels: (jobId: number, labels: JobLabel[]) => void
  className?: string
}) {
  const label = job.labels[0] ?? ""

  const LabelOptionWithColor = ({
    jobLabel,
    colorClass,
  }: {
    jobLabel: string
    colorClass: string
  }) => (
    <SelectItem value={jobLabel}>
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full ${colorClass}`}></div>
        <div className="ml-2 flex-1">{jobLabel}</div>
      </div>
    </SelectItem>
  )

  return (
    <Select
      value={label}
      onValueChange={(labelValue: JobLabel) => {
        const newLabels = isJobLabel(labelValue) ? [labelValue] : []
        onUpdateLabels(job.id, newLabels)
      }}
    >
      <SelectTrigger className={clsx("h-10 w-[148px] focus:ring-0", className)}>
        <SelectValue placeholder="Étiquette" />
      </SelectTrigger>
      <SelectContent>
        {/* no label */}
        <LabelOptionWithColor jobLabel="Aucune" colorClass="bg-background" />

        {/* labels with colors */}
        {Object.values(JOB_LABELS).map((jobLabel) => (
          <LabelOptionWithColor
            key={jobLabel}
            jobLabel={jobLabel}
            colorClass={LABEL_COLOR_CLASSES[jobLabel]}
          />
        ))}
      </SelectContent>
    </Select>
  )
}

