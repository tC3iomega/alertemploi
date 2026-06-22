import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import Markdown from "react-markdown"
import { Job } from "@alertemploi/core"

export type JobDescriptionProps = {
  job: Job
}

export function JobDescription({ job }: JobDescriptionProps) {
  if (job.description) {
    return (
      // Description has been fetched
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        className="job-description-md"
      >
        {job.description}
      </Markdown>
    )
  }
  return (
    // Description failed to fetch
    <div className="mt-20 text-center">
      <p className="">
        La description de cette offre n'a pas pu être récupérée.
      </p>
      <p>Vous pouvez la consulter directement sur le site du job board.</p>
      <svg width="240" height="160" viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg" style={{ margin: "32px auto 0", display: "block" }}>
        <circle cx="340" cy="190" r="110" fill="#F1EFE8" />
        <rect x="280" y="100" width="120" height="160" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <line x1="300" y1="135" x2="380" y2="135" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="300" y1="155" x2="380" y2="155" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="300" y1="175" x2="360" y2="175" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="300" y1="200" x2="380" y2="200" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
        <line x1="300" y1="220" x2="365" y2="220" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
        <circle cx="395" cy="225" r="32" fill="none" stroke="#2563EB" strokeWidth="5" />
        <line x1="418" y1="248" x2="442" y2="272" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
        <circle cx="437" cy="120" r="10" fill="#F59E0B" />
      </svg>
    </div>
  )
}

