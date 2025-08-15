import { RPG_SYSTEMS } from "./rpg-systems"

export interface Rule {
  id: string
  title: string
  category: string
  description: string
  fullText: string
  page?: string
  source: string
  tags: string[]
  systemId: string // Added system ID to support multiple RPG systems
  createdAt: Date
  lastAccessed?: Date
}

export interface RuleCategory {
  name: string
  count: number
  icon: string
  color: string
  description: string
  systemId?: string // Added optional system ID for system-specific categories
}

export const rulesDatabase: Rule[] = []

export const universalRuleCategories: RuleCategory[] = [
  {
    name: "Core Mechanics",
    count: 0,
    icon: "Cog",
    color: "bg-blue-600",
    description: "Basic game mechanics, dice rolling, and core resolution systems",
  },
  {
    name: "Character Creation",
    count: 0,
    icon: "User",
    color: "bg-green-600",
    description: "Character generation, attributes, skills, and advancement",
  },
  {
    name: "Combat",
    count: 0,
    icon: "Sword",
    color: "bg-red-600",
    description: "Battle mechanics, actions, initiative, and combat procedures",
  },
  {
    name: "Equipment",
    count: 0,
    icon: "Shield",
    color: "bg-amber-600",
    description: "Weapons, armor, gear, and equipment mechanics",
  },
  {
    name: "Magic & Powers",
    count: 0,
    icon: "Zap",
    color: "bg-purple-600",
    description: "Supernatural abilities, spells, disciplines, and special powers",
  },
  {
    name: "Social & Roleplay",
    count: 0,
    icon: "Users",
    color: "bg-cyan-600",
    description: "Social interactions, roleplay mechanics, and narrative rules",
  },
  {
    name: "Game Master",
    count: 0,
    icon: "Crown",
    color: "bg-orange-600",
    description: "GM guidance, running games, and storytelling tools",
  },
  {
    name: "Optional Rules",
    count: 0,
    icon: "Settings",
    color: "bg-slate-600",
    description: "Variant rules, house rules, and optional mechanics",
  },
]

export const searchRules = (query: string, category?: string, systemId?: string): Rule[] => {
  const searchTerm = query.toLowerCase().trim()

  let filteredRules = rulesDatabase

  // Filter by system if specified
  if (systemId) {
    filteredRules = filteredRules.filter((rule) => rule.systemId === systemId)
  }

  // Filter by category if specified
  if (category) {
    filteredRules = filteredRules.filter((rule) => rule.category === category)
  }

  // Apply search term if provided
  if (searchTerm) {
    filteredRules = filteredRules.filter(
      (rule) =>
        rule.title.toLowerCase().includes(searchTerm) ||
        rule.description.toLowerCase().includes(searchTerm) ||
        rule.fullText.toLowerCase().includes(searchTerm) ||
        rule.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  return filteredRules
}

export const getRuleCategories = (systemId?: string): RuleCategory[] => {
  const categories = [...universalRuleCategories]

  // Update counts based on current rules database
  categories.forEach((category) => {
    category.count = rulesDatabase.filter((rule) => {
      const matchesCategory = rule.category === category.name
      const matchesSystem = !systemId || rule.systemId === systemId
      return matchesCategory && matchesSystem
    }).length
  })

  return categories
}

export const getRecentRules = (limit = 4, systemId?: string): Rule[] => {
  let filteredRules = rulesDatabase.filter((rule) => rule.lastAccessed)

  if (systemId) {
    filteredRules = filteredRules.filter((rule) => rule.systemId === systemId)
  }

  return filteredRules
    .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
    .slice(0, limit)
}

export const getRuleById = (id: string): Rule | undefined => {
  return rulesDatabase.find((rule) => rule.id === id)
}

export const updateRuleAccess = (id: string): void => {
  const rule = getRuleById(id)
  if (rule) {
    rule.lastAccessed = new Date()
  }
}

export const createCustomRule = (
  title: string,
  category: string,
  description: string,
  fullText: string,
  systemId: string,
  tags: string[] = [],
  source = "Custom",
  page?: string,
): Rule => {
  const rule: Rule = {
    id: crypto.randomUUID(),
    title,
    category,
    description,
    fullText,
    systemId,
    tags,
    source,
    page,
    createdAt: new Date(),
  }

  rulesDatabase.push(rule)
  return rule
}

export const importRules = (rules: Omit<Rule, "id" | "createdAt">[]): Rule[] => {
  const importedRules: Rule[] = rules.map((ruleData) => ({
    ...ruleData,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }))

  rulesDatabase.push(...importedRules)
  return importedRules
}

export const getRulesBySystem = (systemId: string): Rule[] => {
  return rulesDatabase.filter((rule) => rule.systemId === systemId)
}

export const getSystemsWithRules = (): Array<{ systemId: string; name: string; ruleCount: number }> => {
  const systemCounts = new Map<string, number>()

  rulesDatabase.forEach((rule) => {
    systemCounts.set(rule.systemId, (systemCounts.get(rule.systemId) || 0) + 1)
  })

  return RPG_SYSTEMS.map((system) => ({
    systemId: system.id,
    name: system.name,
    ruleCount: systemCounts.get(system.id) || 0,
  }))
}

export const deleteRule = (id: string): boolean => {
  const index = rulesDatabase.findIndex((rule) => rule.id === id)
  if (index !== -1) {
    rulesDatabase.splice(index, 1)
    return true
  }
  return false
}

export const updateRule = (id: string, updates: Partial<Omit<Rule, "id" | "createdAt">>): Rule | null => {
  const rule = getRuleById(id)
  if (rule) {
    Object.assign(rule, updates)
    return rule
  }
  return null
}

export const exportRules = (systemId?: string): string => {
  const rulesToExport = systemId ? getRulesBySystem(systemId) : rulesDatabase
  return JSON.stringify(rulesToExport, null, 2)
}

export const getRuleStatistics = (systemId?: string) => {
  const rules = systemId ? getRulesBySystem(systemId) : rulesDatabase

  const stats = {
    totalRules: rules.length,
    categoryCounts: {} as Record<string, number>,
    sourceCounts: {} as Record<string, number>,
    recentlyAccessed: rules.filter((r) => r.lastAccessed).length,
    customRules: rules.filter((r) => r.source === "Custom").length,
  }

  rules.forEach((rule) => {
    stats.categoryCounts[rule.category] = (stats.categoryCounts[rule.category] || 0) + 1
    stats.sourceCounts[rule.source] = (stats.sourceCounts[rule.source] || 0) + 1
  })

  return stats
}
