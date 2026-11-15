"use client"

import { createContext, useContext } from "react"
import type { AlertemploiApiSdk } from "@alertemploi/core"

const SdkContext = createContext<AlertemploiApiSdk | null>(null)

/**
 * Provider component to inject the SDK into the React tree.
 * Each app (desktop/webapp) must wrap its root with this provider
 * and pass its own SDK implementation.
 */
export function SdkProvider({
  sdk,
  children,
}: {
  sdk: AlertemploiApiSdk
  children: React.ReactNode
}) {
  return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>
}

/**
 * Hook to access the Alertemploi SDK from any component.
 * Must be used within a SdkProvider.
 */
export function useSdk(): AlertemploiApiSdk {
  const sdk = useContext(SdkContext)
  if (!sdk) {
    throw new Error("useSdk must be used within a SdkProvider")
  }
  return sdk
}
