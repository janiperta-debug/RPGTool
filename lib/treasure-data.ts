import { getRPGSystem } from "./rpg-systems"

export interface UniversalTreasureItem {
  id: string
  name: string
  type: string
  systemId: string
  rarity: string // System-specific rarity (Common/Uncommon for D&D, Quality levels for other systems)
  value: number
  currency: string // gp, $, eb, etc.
  description: string
  fullDescription: string
  attunement?: boolean
  properties: string[]
  tags: string[]
  source: string
  systemData: Record<string, any> // System-specific data
  createdAt: Date
}

export interface TreasureCategory {
  name: string
  count: number
  icon: string
  color: string
  description: string
  systemId?: string
}

export const treasureDatabase: UniversalTreasureItem[] = []

// System-specific treasure generation data
export const systemTreasureData = {
  dnd5e: {
    rarities: ["Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact"],
    currency: "gp",
    rarityMultipliers: { Common: 1, Uncommon: 5, Rare: 25, "Very Rare": 125, Legendary: 625, Artifact: 3125 },
    weapons: [
      { name: "Longsword", baseValue: 15, types: ["slashing", "versatile"] },
      { name: "Battleaxe", baseValue: 10, types: ["slashing", "versatile"] },
      { name: "Dagger", baseValue: 2, types: ["piercing", "finesse", "light", "thrown"] },
      { name: "Greatsword", baseValue: 50, types: ["slashing", "heavy", "two-handed"] },
      { name: "Shortbow", baseValue: 25, types: ["piercing", "ammunition", "two-handed"] },
      { name: "Crossbow", baseValue: 25, types: ["piercing", "ammunition", "loading"] },
      { name: "Warhammer", baseValue: 15, types: ["bludgeoning", "versatile"] },
      { name: "Rapier", baseValue: 25, types: ["piercing", "finesse"] },
    ],
    armor: [
      { name: "Leather Armor", baseValue: 10, type: "Light" },
      { name: "Chain Mail", baseValue: 75, type: "Heavy" },
      { name: "Plate Armor", baseValue: 1500, type: "Heavy" },
      { name: "Shield", baseValue: 10, type: "Shield" },
      { name: "Studded Leather", baseValue: 45, type: "Light" },
      { name: "Scale Mail", baseValue: 50, type: "Medium" },
    ],
    magicalProperties: [
      { name: "Flaming", description: "Deals extra fire damage", rarity: "Uncommon" },
      { name: "Frost", description: "Deals extra cold damage", rarity: "Uncommon" },
      { name: "Shock", description: "Deals extra lightning damage", rarity: "Uncommon" },
      { name: "Keen", description: "Increased critical hit range", rarity: "Uncommon" },
      { name: "Defending", description: "Bonus to AC when wielded", rarity: "Rare" },
      { name: "Vorpal", description: "Chance to decapitate on critical hit", rarity: "Legendary" },
      { name: "Holy", description: "Extra damage against undead and fiends", rarity: "Rare" },
      { name: "Vampiric", description: "Heals wielder when dealing damage", rarity: "Rare" },
    ],
  },
  call_of_cthulhu: {
    rarities: ["Common", "Unusual", "Rare", "Unique"],
    currency: "$",
    rarityMultipliers: { Common: 1, Unusual: 3, Rare: 10, Unique: 50 },
    items: [
      { name: "Revolver", baseValue: 25, type: "Firearm" },
      { name: "Shotgun", baseValue: 40, type: "Firearm" },
      { name: "Tome", baseValue: 100, type: "Book" },
      { name: "Artifact", baseValue: 500, type: "Occult" },
      { name: "Camera", baseValue: 75, type: "Equipment" },
      { name: "Flashlight", baseValue: 5, type: "Equipment" },
    ],
    properties: [
      { name: "Cursed", description: "Brings misfortune to the bearer", rarity: "Rare" },
      { name: "Blessed", description: "Provides protection against evil", rarity: "Unusual" },
      { name: "Ancient", description: "From a lost civilization", rarity: "Rare" },
      { name: "Mythos", description: "Connected to cosmic horrors", rarity: "Unique" },
    ],
  },
  vampire_masquerade: {
    rarities: ["Common", "Uncommon", "Rare", "Legendary"],
    currency: "$",
    rarityMultipliers: { Common: 1, Uncommon: 5, Rare: 20, Legendary: 100 },
    items: [
      { name: "Blood Bag", baseValue: 50, type: "Consumable" },
      { name: "Haven", baseValue: 10000, type: "Location" },
      { name: "Ghoul", baseValue: 5000, type: "Ally" },
      { name: "Contacts", baseValue: 1000, type: "Social" },
      { name: "Resources", baseValue: 2000, type: "Wealth" },
    ],
    properties: [
      { name: "Tainted", description: "Corrupted by dark magic", rarity: "Rare" },
      { name: "Sanctified", description: "Blessed by faith", rarity: "Uncommon" },
      { name: "Ancient", description: "From elder nights", rarity: "Legendary" },
    ],
  },
  cyberpunk_red: {
    rarities: ["Poor", "Standard", "Excellent", "Premium"],
    currency: "eb",
    rarityMultipliers: { Poor: 0.5, Standard: 1, Excellent: 3, Premium: 10 },
    items: [
      { name: "Cyberdeck", baseValue: 5000, type: "Cyberware" },
      { name: "Neural Processor", baseValue: 2000, type: "Cyberware" },
      { name: "Smart Gun", baseValue: 1000, type: "Weapon" },
      { name: "Body Armor", baseValue: 500, type: "Armor" },
      { name: "Vehicle", baseValue: 15000, type: "Transport" },
    ],
    properties: [
      { name: "Military Grade", description: "High-end military equipment", rarity: "Premium" },
      { name: "Corporate", description: "Corporate-branded gear", rarity: "Excellent" },
      { name: "Street Modified", description: "Modified by street techs", rarity: "Standard" },
      { name: "Bootleg", description: "Black market knockoff", rarity: "Poor" },
    ],
  },
}

export const generateRandomTreasure = (
  systemId: string,
  rarity?: string,
  type?: string,
): Partial<UniversalTreasureItem> => {
  const system = getRPGSystem(systemId)
  const treasureData = systemTreasureData[systemId as keyof typeof systemTreasureData]

  if (!system || !treasureData) {
    throw new Error(`Treasure generation not supported for system: ${systemId}`)
  }

  const selectedRarity = rarity || treasureData.rarities[Math.floor(Math.random() * treasureData.rarities.length)]

  let baseName = ""
  let baseValue = 0
  let itemType = ""
  let systemSpecificData = {}

  if (systemId === "dnd5e") {
    const itemTypes = ["weapon", "armor", "wondrous"]
    const selectedType = type || itemTypes[Math.floor(Math.random() * itemTypes.length)]

    if (selectedType === "weapon") {
      const weapon = treasureData.weapons[Math.floor(Math.random() * treasureData.weapons.length)]
      baseName = weapon.name
      baseValue = weapon.baseValue
      itemType = `Weapon (${weapon.name.toLowerCase()})`
      systemSpecificData = { weaponTypes: weapon.types }
    } else if (selectedType === "armor") {
      const armor = treasureData.armor[Math.floor(Math.random() * treasureData.armor.length)]
      baseName = armor.name
      baseValue = armor.baseValue
      itemType = `Armor (${armor.type.toLowerCase()})`
      systemSpecificData = { armorType: armor.type }
    } else {
      const wonderousItems = [
        "Amulet",
        "Ring",
        "Cloak",
        "Boots",
        "Gloves",
        "Belt",
        "Circlet",
        "Bracers",
        "Orb",
        "Crystal",
        "Tome",
        "Scroll",
        "Potion",
        "Elixir",
      ]
      baseName = wonderousItems[Math.floor(Math.random() * wonderousItems.length)]
      baseValue = 50
      itemType = "Wondrous Item"
    }

    const property = treasureData.magicalProperties[Math.floor(Math.random() * treasureData.magicalProperties.length)]
    const finalValue = Math.floor(
      baseValue * treasureData.rarityMultipliers[selectedRarity] * (0.8 + Math.random() * 0.4),
    )

    return {
      id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${property.name} ${baseName}`,
      type: itemType,
      systemId,
      rarity: selectedRarity,
      value: finalValue,
      currency: treasureData.currency,
      description: property.description,
      fullDescription: `This ${baseName.toLowerCase()} has been imbued with magical properties. ${property.description}. The item radiates a ${selectedRarity.toLowerCase()} magical aura.`,
      attunement: selectedRarity !== "Common" && Math.random() > 0.3,
      properties: [property.description],
      tags: [selectedType, property.name.toLowerCase()],
      source: "Generated",
      systemData: systemSpecificData,
      createdAt: new Date(),
    }
  } else {
    // Handle other systems
    const item = treasureData.items[Math.floor(Math.random() * treasureData.items.length)]
    const property = treasureData.properties[Math.floor(Math.random() * treasureData.properties.length)]
    const finalValue = Math.floor(
      item.baseValue * treasureData.rarityMultipliers[selectedRarity] * (0.8 + Math.random() * 0.4),
    )

    return {
      id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${property.name} ${item.name}`,
      type: item.type,
      systemId,
      rarity: selectedRarity,
      value: finalValue,
      currency: treasureData.currency,
      description: property.description,
      fullDescription: `This ${item.name.toLowerCase()} ${property.description.toLowerCase()}. It appears to be of ${selectedRarity.toLowerCase()} quality.`,
      properties: [property.description],
      tags: [item.type.toLowerCase(), property.name.toLowerCase()],
      source: "Generated",
      systemData: { originalType: item.type },
      createdAt: new Date(),
    }
  }
}

export const searchTreasure = (
  query: string,
  rarity?: string,
  type?: string,
  systemId?: string,
): UniversalTreasureItem[] => {
  const searchTerm = query.toLowerCase().trim()

  return treasureDatabase.filter((item) => {
    const matchesSystem = !systemId || item.systemId === systemId
    const matchesRarity = !rarity || rarity === "all" || item.rarity === rarity
    const matchesType = !type || type === "all" || item.type.toLowerCase().includes(type.toLowerCase())
    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.fullDescription.toLowerCase().includes(searchTerm) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    return matchesSystem && matchesRarity && matchesType && matchesSearch
  })
}

export const getTreasureCategories = (systemId?: string): TreasureCategory[] => {
  const filteredItems = systemId ? treasureDatabase.filter((item) => item.systemId === systemId) : treasureDatabase

  const weaponCount = filteredItems.filter((item) => item.type.toLowerCase().includes("weapon")).length
  const armorCount = filteredItems.filter((item) => item.type.toLowerCase().includes("armor")).length
  const consumableCount = filteredItems.filter(
    (item) => item.type.toLowerCase().includes("potion") || item.tags.includes("consumable"),
  ).length
  const equipmentCount = filteredItems.filter((item) => item.type.toLowerCase().includes("equipment")).length

  return [
    {
      name: "Weapons",
      count: weaponCount,
      icon: "Sword",
      color: "bg-red-600",
      description: "Weapons and armaments",
      systemId,
    },
    {
      name: "Armor",
      count: armorCount,
      icon: "Shield",
      color: "bg-blue-600",
      description: "Protective gear and shields",
      systemId,
    },
    {
      name: "Equipment",
      count: equipmentCount,
      icon: "Package",
      color: "bg-green-600",
      description: "Tools, gear, and equipment",
      systemId,
    },
    {
      name: "Consumables",
      count: consumableCount,
      icon: "Scroll",
      color: "bg-purple-600",
      description: "Single-use items and consumables",
      systemId,
    },
  ]
}

export const getRarityColor = (systemId: string, rarity: string): string => {
  if (systemId === "dnd5e") {
    switch (rarity) {
      case "Common":
        return "bg-gray-600"
      case "Uncommon":
        return "bg-green-600"
      case "Rare":
        return "bg-blue-600"
      case "Very Rare":
        return "bg-purple-600"
      case "Legendary":
        return "bg-orange-600"
      case "Artifact":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  } else if (systemId === "call_of_cthulhu") {
    switch (rarity) {
      case "Common":
        return "bg-gray-600"
      case "Unusual":
        return "bg-yellow-600"
      case "Rare":
        return "bg-blue-600"
      case "Unique":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  } else if (systemId === "cyberpunk_red") {
    switch (rarity) {
      case "Poor":
        return "bg-red-600"
      case "Standard":
        return "bg-gray-600"
      case "Excellent":
        return "bg-blue-600"
      case "Premium":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  return "bg-gray-600"
}

export const formatValue = (value: number, currency: string): string => {
  if (currency === "gp") {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k gp`
    }
    return `${value} gp`
  } else if (currency === "$") {
    return `$${value.toLocaleString()}`
  } else if (currency === "eb") {
    return `${value.toLocaleString()} eb`
  }

  return `${value} ${currency}`
}

export const formatGoldValue = (value: number): string => {
  return formatValue(value, "gp")
}

export const createCustomTreasure = (
  name: string,
  type: string,
  systemId: string,
  rarity: string,
  value: number,
  description: string,
  fullDescription: string,
  properties: string[] = [],
  tags: string[] = [],
): UniversalTreasureItem => {
  const system = getRPGSystem(systemId)
  const treasureData = systemTreasureData[systemId as keyof typeof systemTreasureData]

  const item: UniversalTreasureItem = {
    id: crypto.randomUUID(),
    name,
    type,
    systemId,
    rarity,
    value,
    currency: treasureData?.currency || "gp",
    description,
    fullDescription,
    properties,
    tags,
    source: "Custom",
    systemData: {},
    createdAt: new Date(),
  }

  treasureDatabase.push(item)
  return item
}

export const getTreasureBySystem = (systemId: string): UniversalTreasureItem[] => {
  return treasureDatabase.filter((item) => item.systemId === systemId)
}

export const getSystemRarities = (systemId: string): string[] => {
  const treasureData = systemTreasureData[systemId as keyof typeof systemTreasureData]
  return treasureData?.rarities || ["Common", "Uncommon", "Rare"]
}

export const exportTreasure = (systemId?: string): string => {
  const itemsToExport = systemId ? getTreasureBySystem(systemId) : treasureDatabase
  return JSON.stringify(itemsToExport, null, 2)
}

export const importTreasure = (data: string): UniversalTreasureItem[] => {
  const items = JSON.parse(data) as UniversalTreasureItem[]
  const importedItems = items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }))

  treasureDatabase.push(...importedItems)
  return importedItems
}
