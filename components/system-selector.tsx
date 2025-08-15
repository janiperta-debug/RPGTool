"use client"

import { RPG_SYSTEMS } from "@/lib/rpg-systems"
import { Badge } from "@/components/ui/badge"

interface SystemSelectorProps {
  selectedSystem?: string
  onSystemSelect: (systemId: string) => void
  showDescription?: boolean
}

export function SystemSelector({ selectedSystem, onSystemSelect, showDescription = false }: SystemSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {RPG_SYSTEMS.map((system) => (
        <button
          key={system.id}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
            selectedSystem === system.id
              ? "bg-amber-500 text-black shadow-lg"
              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
          }`}
          onClick={() => onSystemSelect(system.id)}
        >
          {system.name}
          {selectedSystem === system.id && (
            <Badge variant="secondary" className="ml-2 bg-black/20 text-amber-100 text-xs">
              Active
            </Badge>
          )}
        </button>
      ))}
    </div>
  )
}
