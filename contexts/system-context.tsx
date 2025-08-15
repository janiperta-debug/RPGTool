"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getStorageData, saveSelectedSystem } from "@/lib/storage"
import { RPG_SYSTEMS } from "@/lib/rpg-systems"

interface SystemContextType {
  selectedSystem: string
  setSelectedSystem: (system: string) => void
  currentSystemData: any
}

const SystemContext = createContext<SystemContextType | undefined>(undefined)

export function SystemProvider({ children }: { children: ReactNode }) {
  const [selectedSystem, setSelectedSystemState] = useState("dnd5e")

  useEffect(() => {
    // Load selected system from storage on mount
    const data = getStorageData()
    if (data.selectedSystem) {
      setSelectedSystemState(data.selectedSystem)
    }
  }, [])

  const setSelectedSystem = (system: string) => {
    setSelectedSystemState(system)
    saveSelectedSystem(system)
  }

  const currentSystemData = RPG_SYSTEMS.find((sys) => sys.id === selectedSystem) || RPG_SYSTEMS[0]

  return (
    <SystemContext.Provider
      value={{
        selectedSystem,
        setSelectedSystem,
        currentSystemData,
      }}
    >
      {children}
    </SystemContext.Provider>
  )
}

export function useSystem() {
  const context = useContext(SystemContext)
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemProvider")
  }
  return context
}
