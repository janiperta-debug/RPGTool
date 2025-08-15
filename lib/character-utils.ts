import { getRPGSystem, calculateDerivedStat } from "./rpg-systems"

export interface UniversalCharacter {
  id: string
  name: string
  systemId: string

  // System-specific character data
  race?: string
  class?: string
  level?: number
  background?: string

  // Universal attributes (stored as key-value pairs)
  attributes: Record<string, number>

  // Health tracking (multiple tracks for systems like Call of Cthulhu)
  health: Record<string, { current: number; max: number }>

  // Skills (stored as key-value pairs with proficiency levels)
  skills: Record<string, number>

  // Equipment and inventory
  equipment: EquipmentItem[]

  // System-specific data (spells, disciplines, cyberware, etc.)
  systemData: Record<string, any>

  // Notes and description
  notes: string
  description?: string

  createdAt: Date
  updatedAt: Date
}

export interface EquipmentItem {
  id: string
  name: string
  category: string
  quantity: number
  weight?: number
  value?: number
  description?: string
  properties?: Record<string, any>
}

export const createCharacter = (systemId: string, name: string): UniversalCharacter => {
  const system = getRPGSystem(systemId)
  if (!system) throw new Error(`Unknown RPG system: ${systemId}`)

  const character: UniversalCharacter = {
    id: crypto.randomUUID(),
    name,
    systemId,
    attributes: {},
    health: {},
    skills: {},
    equipment: [],
    systemData: {},
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Initialize attributes with default values
  system.attributes.attributes.forEach((attr) => {
    character.attributes[attr.id] = (attr.default as number) || 10
  })

  // Initialize health tracks
  system.health.tracks.forEach((track) => {
    const maxValue = calculateDerivedStat(systemId, track.id, character.attributes) || 10
    character.health[track.id] = { current: maxValue, max: maxValue }
  })

  // Initialize skills based on system type
  if (system.skills.type === "list" && system.skills.skills) {
    system.skills.skills.forEach((skill) => {
      character.skills[skill.id] = 0
    })
  } else if (system.skills.type === "categories" && system.skills.categories) {
    system.skills.categories.forEach((category) => {
      category.skills.forEach((skill) => {
        character.skills[skill.id] = 0
      })
    })
  }

  return character
}

export const getAttributeModifier = (systemId: string, attributeId: string, value: number): number => {
  const system = getRPGSystem(systemId)
  if (!system) return 0

  // D&D-style systems use (score - 10) / 2
  if (systemId === "dnd5e" || systemId === "pathfinder2e") {
    return Math.floor((value - 10) / 2)
  }

  // Call of Cthulhu uses value / 5 for hard success, value / 2 for extreme
  if (systemId === "call_of_cthulhu") {
    return Math.floor(value / 5)
  }

  // World of Darkness uses dots (1-5 scale)
  if (systemId === "vampire_masquerade") {
    return value
  }

  // Cyberpunk RED uses stat + skill + 1d10
  if (systemId === "cyberpunk_red") {
    return value
  }

  return 0
}

export const rollSkillCheck = (
  systemId: string,
  character: UniversalCharacter,
  skillId: string,
  difficulty?: number,
): { success: boolean; result: number; description: string } => {
  const system = getRPGSystem(systemId)
  if (!system) return { success: false, result: 0, description: "Unknown system" }

  const skillValue = character.skills[skillId] || 0

  if (systemId === "dnd5e" || systemId === "pathfinder2e") {
    // d20 + skill modifier + attribute modifier
    const roll = Math.floor(Math.random() * 20) + 1
    const skill =
      system.skills.type === "list"
        ? system.skills.skills?.find((s) => s.id === skillId)
        : system.skills.categories?.flatMap((c) => c.skills).find((s) => s.id === skillId)

    const attributeId = skill?.attribute || "int"
    const attributeModifier = getAttributeModifier(systemId, attributeId, character.attributes[attributeId] || 10)
    const result = roll + skillValue + attributeModifier
    const dc = difficulty || 15

    return {
      success: result >= dc,
      result,
      description: `Rolled ${roll} + ${skillValue} (skill) + ${attributeModifier} (${attributeId}) = ${result} vs DC ${dc}`,
    }
  }

  if (systemId === "call_of_cthulhu") {
    // Roll under skill value on d100
    const roll = Math.floor(Math.random() * 100) + 1
    const target = skillValue

    return {
      success: roll <= target,
      result: roll,
      description: `Rolled ${roll} vs ${target} (${roll <= target ? "Success" : "Failure"})`,
    }
  }

  if (systemId === "vampire_masquerade") {
    // Roll dice pool (attribute + skill), count successes (6+ on d10)
    const attribute = character.attributes[skillId.split("_")[0]] || 1
    const dicePool = attribute + skillValue
    let successes = 0
    const rolls: number[] = []

    for (let i = 0; i < dicePool; i++) {
      const roll = Math.floor(Math.random() * 10) + 1
      rolls.push(roll)
      if (roll >= 6) successes++
    }

    return {
      success: successes > 0,
      result: successes,
      description: `Rolled ${dicePool} dice: [${rolls.join(", ")}] = ${successes} successes`,
    }
  }

  return { success: false, result: 0, description: "System not implemented" }
}

export const validateCharacter = (character: Partial<UniversalCharacter>): string[] => {
  const errors: string[] = []

  if (!character.name?.trim()) {
    errors.push("Character name is required")
  }

  if (!character.systemId) {
    errors.push("RPG system is required")
  }

  const system = character.systemId ? getRPGSystem(character.systemId) : null
  if (!system) {
    errors.push("Invalid RPG system")
    return errors
  }

  // Validate attributes
  if (character.attributes) {
    system.attributes.attributes.forEach((attr) => {
      const value = character.attributes![attr.id]
      if (value !== undefined) {
        if (attr.min !== undefined && value < attr.min) {
          errors.push(`${attr.name} must be at least ${attr.min}`)
        }
        if (attr.max !== undefined && value > attr.max) {
          errors.push(`${attr.name} must be at most ${attr.max}`)
        }
      }
    })
  }

  return errors
}

export const advanceCharacter = (character: UniversalCharacter, advancement: any): UniversalCharacter => {
  const system = getRPGSystem(character.systemId)
  if (!system) return character

  const updated = { ...character, updatedAt: new Date() }

  if (system.advancement.type === "levels" && advancement.level) {
    updated.level = advancement.level

    // Recalculate health based on new level
    system.health.tracks.forEach((track) => {
      const maxValue = calculateDerivedStat(character.systemId, track.id, character.attributes)
      if (updated.health[track.id]) {
        updated.health[track.id].max = maxValue
      }
    })
  }

  if (system.advancement.type === "points" && advancement.skillPoints) {
    // Distribute skill points
    Object.entries(advancement.skillPoints).forEach(([skillId, points]) => {
      updated.skills[skillId] = (updated.skills[skillId] || 0) + (points as number)
    })
  }

  return updated
}

export const addEquipment = (character: UniversalCharacter, item: Omit<EquipmentItem, "id">): UniversalCharacter => {
  const newItem: EquipmentItem = {
    ...item,
    id: crypto.randomUUID(),
  }

  return {
    ...character,
    equipment: [...character.equipment, newItem],
    updatedAt: new Date(),
  }
}

export const removeEquipment = (character: UniversalCharacter, itemId: string): UniversalCharacter => {
  return {
    ...character,
    equipment: character.equipment.filter((item) => item.id !== itemId),
    updatedAt: new Date(),
  }
}

export const updateEquipment = (
  character: UniversalCharacter,
  itemId: string,
  updates: Partial<EquipmentItem>,
): UniversalCharacter => {
  return {
    ...character,
    equipment: character.equipment.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    updatedAt: new Date(),
  }
}

export const exportCharacter = (character: UniversalCharacter): string => {
  return JSON.stringify(character, null, 2)
}

export const importCharacter = (data: string): UniversalCharacter => {
  const character = JSON.parse(data) as UniversalCharacter

  // Validate the imported character
  const errors = validateCharacter(character)
  if (errors.length > 0) {
    throw new Error(`Invalid character data: ${errors.join(", ")}`)
  }

  return {
    ...character,
    id: crypto.randomUUID(), // Generate new ID to avoid conflicts
    updatedAt: new Date(),
  }
}
