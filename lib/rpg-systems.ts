export interface RPGSystem {
  id: string
  name: string
  description: string
  attributes: AttributeSystem
  skills: SkillSystem
  equipment: EquipmentSystem
  magic?: MagicSystem
  health: HealthSystem
  advancement: AdvancementSystem
}

export interface AttributeSystem {
  type: "numeric" | "dice" | "descriptive"
  attributes: Attribute[]
  derivedStats?: DerivedStat[]
}

export interface Attribute {
  id: string
  name: string
  description: string
  min?: number
  max?: number
  default?: number | string
}

export interface DerivedStat {
  id: string
  name: string
  formula: string
  description: string
}

export interface SkillSystem {
  type: "list" | "categories" | "freeform"
  skills?: Skill[]
  categories?: SkillCategory[]
}

export interface Skill {
  id: string
  name: string
  description: string
  attribute?: string
  specialty?: boolean
}

export interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

export interface EquipmentSystem {
  categories: string[]
  hasEncumbrance: boolean
  currency: Currency[]
}

export interface Currency {
  name: string
  abbreviation: string
  value: number // relative to base currency
}

export interface MagicSystem {
  type: "slots" | "points" | "freeform"
  schools?: string[]
  components?: string[]
}

export interface HealthSystem {
  type: "hitpoints" | "wounds" | "stress" | "multiple"
  tracks: HealthTrack[]
}

export interface HealthTrack {
  id: string
  name: string
  max: string // formula or static number
  description: string
}

export interface AdvancementSystem {
  type: "levels" | "points" | "milestones"
  description: string
}

// RPG System Definitions
export const RPG_SYSTEMS: RPGSystem[] = [
  {
    id: "dnd5e",
    name: "D&D 5th Edition",
    description: "The classic fantasy tabletop RPG",
    attributes: {
      type: "numeric",
      attributes: [
        { id: "str", name: "Strength", description: "Physical power", min: 1, max: 20, default: 10 },
        { id: "dex", name: "Dexterity", description: "Agility and reflexes", min: 1, max: 20, default: 10 },
        { id: "con", name: "Constitution", description: "Health and stamina", min: 1, max: 20, default: 10 },
        { id: "int", name: "Intelligence", description: "Reasoning ability", min: 1, max: 20, default: 10 },
        { id: "wis", name: "Wisdom", description: "Perception and insight", min: 1, max: 20, default: 10 },
        { id: "cha", name: "Charisma", description: "Force of personality", min: 1, max: 20, default: 10 },
      ],
      derivedStats: [
        { id: "hp", name: "Hit Points", formula: "con_mod + class_hd", description: "Health points" },
        { id: "ac", name: "Armor Class", formula: "10 + dex_mod + armor", description: "Defense rating" },
      ],
    },
    skills: {
      type: "list",
      skills: [
        { id: "acrobatics", name: "Acrobatics", description: "Balance and agility", attribute: "dex" },
        { id: "athletics", name: "Athletics", description: "Physical activities", attribute: "str" },
        { id: "deception", name: "Deception", description: "Lying and misdirection", attribute: "cha" },
        { id: "history", name: "History", description: "Knowledge of past events", attribute: "int" },
        { id: "insight", name: "Insight", description: "Reading people", attribute: "wis" },
        { id: "investigation", name: "Investigation", description: "Finding clues", attribute: "int" },
        { id: "perception", name: "Perception", description: "Noticing things", attribute: "wis" },
        { id: "persuasion", name: "Persuasion", description: "Convincing others", attribute: "cha" },
        { id: "stealth", name: "Stealth", description: "Moving unseen", attribute: "dex" },
      ],
    },
    equipment: {
      categories: ["Weapons", "Armor", "Tools", "Adventuring Gear", "Magic Items"],
      hasEncumbrance: true,
      currency: [
        { name: "Copper Piece", abbreviation: "cp", value: 1 },
        { name: "Silver Piece", abbreviation: "sp", value: 10 },
        { name: "Gold Piece", abbreviation: "gp", value: 100 },
        { name: "Platinum Piece", abbreviation: "pp", value: 1000 },
      ],
    },
    magic: {
      type: "slots",
      schools: [
        "Abjuration",
        "Conjuration",
        "Divination",
        "Enchantment",
        "Evocation",
        "Illusion",
        "Necromancy",
        "Transmutation",
      ],
      components: ["Verbal", "Somatic", "Material"],
    },
    health: {
      type: "hitpoints",
      tracks: [{ id: "hp", name: "Hit Points", max: "con_mod + class_hd * level", description: "Physical health" }],
    },
    advancement: {
      type: "levels",
      description: "Gain levels through experience points",
    },
  },
  {
    id: "pathfinder2e",
    name: "Pathfinder 2nd Edition",
    description: "Advanced fantasy RPG with tactical combat",
    attributes: {
      type: "numeric",
      attributes: [
        { id: "str", name: "Strength", description: "Physical power", min: 1, max: 24, default: 10 },
        { id: "dex", name: "Dexterity", description: "Agility and reflexes", min: 1, max: 24, default: 10 },
        { id: "con", name: "Constitution", description: "Health and stamina", min: 1, max: 24, default: 10 },
        { id: "int", name: "Intelligence", description: "Reasoning ability", min: 1, max: 24, default: 10 },
        { id: "wis", name: "Wisdom", description: "Perception and insight", min: 1, max: 24, default: 10 },
        { id: "cha", name: "Charisma", description: "Force of personality", min: 1, max: 24, default: 10 },
      ],
    },
    skills: {
      type: "list",
      skills: [
        { id: "acrobatics", name: "Acrobatics", description: "Balance and tumbling", attribute: "dex" },
        { id: "athletics", name: "Athletics", description: "Physical activities", attribute: "str" },
        { id: "deception", name: "Deception", description: "Lying and misdirection", attribute: "cha" },
        { id: "lore", name: "Lore", description: "Specialized knowledge", attribute: "int", specialty: true },
      ],
    },
    equipment: {
      categories: ["Weapons", "Armor", "Shields", "Tools", "Consumables", "Magic Items"],
      hasEncumbrance: true,
      currency: [
        { name: "Copper Piece", abbreviation: "cp", value: 1 },
        { name: "Silver Piece", abbreviation: "sp", value: 10 },
        { name: "Gold Piece", abbreviation: "gp", value: 100 },
        { name: "Platinum Piece", abbreviation: "pp", value: 1000 },
      ],
    },
    health: {
      type: "hitpoints",
      tracks: [
        { id: "hp", name: "Hit Points", max: "ancestry_hp + class_hp + con_mod", description: "Physical health" },
      ],
    },
    advancement: {
      type: "levels",
      description: "Gain levels through experience points and milestones",
    },
  },
  {
    id: "call_of_cthulhu",
    name: "Call of Cthulhu",
    description: "Cosmic horror investigation RPG",
    attributes: {
      type: "numeric",
      attributes: [
        { id: "str", name: "Strength", description: "Physical power", min: 15, max: 90, default: 50 },
        { id: "con", name: "Constitution", description: "Health and stamina", min: 15, max: 90, default: 50 },
        { id: "siz", name: "Size", description: "Physical size", min: 40, max: 90, default: 60 },
        { id: "dex", name: "Dexterity", description: "Agility and speed", min: 15, max: 90, default: 50 },
        { id: "app", name: "Appearance", description: "Physical attractiveness", min: 15, max: 90, default: 50 },
        { id: "int", name: "Intelligence", description: "Reasoning ability", min: 40, max: 90, default: 50 },
        { id: "pow", name: "Power", description: "Mental strength", min: 15, max: 90, default: 50 },
        { id: "edu", name: "Education", description: "Formal learning", min: 40, max: 90, default: 60 },
      ],
      derivedStats: [
        { id: "hp", name: "Hit Points", formula: "(con + siz) / 10", description: "Physical health" },
        { id: "sanity", name: "Sanity", formula: "pow", description: "Mental stability" },
        { id: "magic_points", name: "Magic Points", formula: "pow / 5", description: "Mystical energy" },
      ],
    },
    skills: {
      type: "list",
      skills: [
        { id: "accounting", name: "Accounting", description: "Financial records", attribute: "edu" },
        { id: "anthropology", name: "Anthropology", description: "Study of cultures", attribute: "edu" },
        { id: "archaeology", name: "Archaeology", description: "Ancient civilizations", attribute: "edu" },
        { id: "art_craft", name: "Art/Craft", description: "Creative skills", attribute: "pow", specialty: true },
        { id: "charm", name: "Charm", description: "Social appeal", attribute: "app" },
        { id: "climb", name: "Climb", description: "Scaling surfaces", attribute: "str" },
        { id: "credit_rating", name: "Credit Rating", description: "Wealth and status", attribute: "edu" },
        { id: "cthulhu_mythos", name: "Cthulhu Mythos", description: "Forbidden knowledge", attribute: "int" },
        { id: "dodge", name: "Dodge", description: "Avoiding attacks", attribute: "dex" },
        { id: "drive_auto", name: "Drive Auto", description: "Operating vehicles", attribute: "dex" },
        { id: "fast_talk", name: "Fast Talk", description: "Quick persuasion", attribute: "app" },
        { id: "intimidate", name: "Intimidate", description: "Threatening others", attribute: "pow" },
        { id: "jump", name: "Jump", description: "Leaping ability", attribute: "str" },
        { id: "language_own", name: "Language (Own)", description: "Native language", attribute: "edu" },
        {
          id: "language_other",
          name: "Language (Other)",
          description: "Foreign languages",
          attribute: "int",
          specialty: true,
        },
        { id: "library_use", name: "Library Use", description: "Research skills", attribute: "edu" },
        { id: "listen", name: "Listen", description: "Hearing sounds", attribute: "pow" },
        { id: "locksmith", name: "Locksmith", description: "Lock manipulation", attribute: "dex" },
        { id: "medicine", name: "Medicine", description: "Medical knowledge", attribute: "edu" },
        { id: "occult", name: "Occult", description: "Supernatural lore", attribute: "edu" },
        { id: "persuade", name: "Persuade", description: "Logical argument", attribute: "app" },
        { id: "psychology", name: "Psychology", description: "Understanding minds", attribute: "edu" },
        { id: "spot_hidden", name: "Spot Hidden", description: "Finding clues", attribute: "pow" },
        { id: "stealth", name: "Stealth", description: "Moving unseen", attribute: "dex" },
        { id: "survival", name: "Survival", description: "Wilderness skills", attribute: "pow", specialty: true },
      ],
    },
    equipment: {
      categories: ["Weapons", "Equipment", "Books", "Vehicles"],
      hasEncumbrance: false,
      currency: [{ name: "Dollar", abbreviation: "$", value: 1 }],
    },
    health: {
      type: "multiple",
      tracks: [
        { id: "hp", name: "Hit Points", max: "(con + siz) / 10", description: "Physical health" },
        { id: "sanity", name: "Sanity", max: "pow", description: "Mental stability" },
        { id: "magic_points", name: "Magic Points", max: "pow / 5", description: "Mystical energy" },
      ],
    },
    advancement: {
      type: "points",
      description: "Improve skills through use and experience",
    },
  },
  {
    id: "vampire_masquerade",
    name: "Vampire: The Masquerade",
    description: "Gothic-punk vampire RPG",
    attributes: {
      type: "numeric",
      attributes: [
        { id: "str", name: "Strength", description: "Physical power", min: 1, max: 5, default: 1 },
        { id: "dex", name: "Dexterity", description: "Agility and speed", min: 1, max: 5, default: 1 },
        { id: "sta", name: "Stamina", description: "Endurance", min: 1, max: 5, default: 1 },
        { id: "cha", name: "Charisma", description: "Personal magnetism", min: 1, max: 5, default: 1 },
        { id: "man", name: "Manipulation", description: "Influencing others", min: 1, max: 5, default: 1 },
        { id: "app", name: "Appearance", description: "Physical beauty", min: 1, max: 5, default: 1 },
        { id: "per", name: "Perception", description: "Awareness", min: 1, max: 5, default: 1 },
        { id: "int", name: "Intelligence", description: "Reasoning ability", min: 1, max: 5, default: 1 },
        { id: "wits", name: "Wits", description: "Quick thinking", min: 1, max: 5, default: 1 },
      ],
    },
    skills: {
      type: "categories",
      categories: [
        {
          id: "talents",
          name: "Talents",
          skills: [
            { id: "alertness", name: "Alertness", description: "Noticing danger", attribute: "per" },
            { id: "athletics", name: "Athletics", description: "Physical activities", attribute: "str" },
            { id: "brawl", name: "Brawl", description: "Unarmed combat", attribute: "str" },
            { id: "dodge", name: "Dodge", description: "Avoiding attacks", attribute: "dex" },
            { id: "empathy", name: "Empathy", description: "Understanding emotions", attribute: "per" },
            { id: "intimidation", name: "Intimidation", description: "Threatening others", attribute: "cha" },
            { id: "leadership", name: "Leadership", description: "Commanding others", attribute: "cha" },
            { id: "streetwise", name: "Streetwise", description: "Urban survival", attribute: "cha" },
            { id: "subterfuge", name: "Subterfuge", description: "Deception and lies", attribute: "man" },
          ],
        },
        {
          id: "skills",
          name: "Skills",
          skills: [
            { id: "animal_ken", name: "Animal Ken", description: "Understanding animals", attribute: "cha" },
            { id: "crafts", name: "Crafts", description: "Creating things", attribute: "dex" },
            { id: "drive", name: "Drive", description: "Operating vehicles", attribute: "dex" },
            { id: "etiquette", name: "Etiquette", description: "Social protocols", attribute: "cha" },
            { id: "firearms", name: "Firearms", description: "Shooting guns", attribute: "dex" },
            { id: "larceny", name: "Larceny", description: "Criminal skills", attribute: "dex" },
            { id: "melee", name: "Melee", description: "Armed combat", attribute: "dex" },
            { id: "performance", name: "Performance", description: "Entertaining others", attribute: "cha" },
            { id: "stealth", name: "Stealth", description: "Moving unseen", attribute: "dex" },
            { id: "survival", name: "Survival", description: "Wilderness skills", attribute: "per" },
          ],
        },
        {
          id: "knowledges",
          name: "Knowledges",
          skills: [
            { id: "academics", name: "Academics", description: "Formal education", attribute: "int" },
            { id: "computer", name: "Computer", description: "Technology use", attribute: "int" },
            { id: "finance", name: "Finance", description: "Money management", attribute: "int" },
            { id: "investigation", name: "Investigation", description: "Finding clues", attribute: "per" },
            { id: "law", name: "Law", description: "Legal knowledge", attribute: "int" },
            { id: "medicine", name: "Medicine", description: "Medical knowledge", attribute: "int" },
            { id: "occult", name: "Occult", description: "Supernatural lore", attribute: "int" },
            { id: "politics", name: "Politics", description: "Government systems", attribute: "int" },
            { id: "science", name: "Science", description: "Scientific knowledge", attribute: "int" },
          ],
        },
      ],
    },
    equipment: {
      categories: ["Weapons", "Equipment", "Contacts", "Resources"],
      hasEncumbrance: false,
      currency: [{ name: "Dollar", abbreviation: "$", value: 1 }],
    },
    health: {
      type: "wounds",
      tracks: [
        { id: "health", name: "Health", max: "7", description: "Physical condition" },
        {
          id: "willpower",
          name: "Willpower",
          max: "courage + self_control + instinct",
          description: "Mental fortitude",
        },
        { id: "blood_pool", name: "Blood Pool", max: "generation_max", description: "Vampiric vitae" },
      ],
    },
    advancement: {
      type: "points",
      description: "Spend experience points to improve traits",
    },
  },
  {
    id: "cyberpunk_red",
    name: "Cyberpunk RED",
    description: "Dystopian cyberpunk RPG",
    attributes: {
      type: "numeric",
      attributes: [
        { id: "int", name: "Intelligence", description: "Raw intellect", min: 2, max: 8, default: 6 },
        { id: "ref", name: "Reflexes", description: "Speed and dexterity", min: 2, max: 8, default: 6 },
        { id: "dex", name: "Dexterity", description: "Manual dexterity", min: 2, max: 8, default: 6 },
        { id: "tech", name: "Technical Ability", description: "Technical aptitude", min: 2, max: 8, default: 6 },
        { id: "cool", name: "Cool", description: "Grace under pressure", min: 2, max: 8, default: 6 },
        { id: "will", name: "Willpower", description: "Mental strength", min: 2, max: 8, default: 6 },
        { id: "luck", name: "Luck", description: "Random fortune", min: 2, max: 8, default: 6 },
        { id: "move", name: "Movement Allowance", description: "Speed of movement", min: 2, max: 8, default: 6 },
        { id: "body", name: "Body", description: "Physical strength", min: 2, max: 8, default: 6 },
        { id: "emp", name: "Empathy", description: "Human connection", min: 2, max: 8, default: 6 },
      ],
      derivedStats: [
        { id: "hp", name: "Hit Points", formula: "(body + will) / 2 * 5", description: "Physical health" },
        { id: "humanity", name: "Humanity", formula: "emp * 10", description: "Connection to humanity" },
      ],
    },
    skills: {
      type: "list",
      skills: [
        { id: "athletics", name: "Athletics", description: "Physical activities", attribute: "dex" },
        { id: "brawling", name: "Brawling", description: "Hand-to-hand combat", attribute: "dex" },
        { id: "concentration", name: "Concentration", description: "Mental focus", attribute: "will" },
        { id: "conversation", name: "Conversation", description: "Social interaction", attribute: "emp" },
        { id: "education", name: "Education", description: "General knowledge", attribute: "int" },
        { id: "evasion", name: "Evasion", description: "Avoiding danger", attribute: "dex" },
        { id: "handgun", name: "Handgun", description: "Pistol combat", attribute: "ref" },
        { id: "human_perception", name: "Human Perception", description: "Reading people", attribute: "emp" },
        { id: "interrogation", name: "Interrogation", description: "Extracting information", attribute: "cool" },
        { id: "intimidation", name: "Intimidation", description: "Threatening others", attribute: "cool" },
        { id: "library_search", name: "Library Search", description: "Finding information", attribute: "int" },
        { id: "local_expert", name: "Local Expert", description: "Area knowledge", attribute: "int", specialty: true },
        { id: "perception", name: "Perception", description: "Noticing things", attribute: "int" },
        { id: "persuasion", name: "Persuasion", description: "Convincing others", attribute: "cool" },
        { id: "stealth", name: "Stealth", description: "Moving unseen", attribute: "dex" },
      ],
    },
    equipment: {
      categories: ["Weapons", "Armor", "Cyberware", "Gear", "Vehicles"],
      hasEncumbrance: true,
      currency: [{ name: "Eurodollar", abbreviation: "eb", value: 1 }],
    },
    health: {
      type: "wounds",
      tracks: [
        { id: "hp", name: "Hit Points", max: "(body + will) / 2 * 5", description: "Physical health" },
        { id: "humanity", name: "Humanity", max: "emp * 10", description: "Connection to humanity" },
      ],
    },
    advancement: {
      type: "points",
      description: "Improve skills through practice and IP",
    },
  },
]

export function getRPGSystem(id: string): RPGSystem | undefined {
  return RPG_SYSTEMS.find((system) => system.id === id)
}

export function getSystemAttribute(systemId: string, attributeId: string): Attribute | undefined {
  const system = getRPGSystem(systemId)
  return system?.attributes.attributes.find((attr) => attr.id === attributeId)
}

export function getSystemSkill(systemId: string, skillId: string): Skill | undefined {
  const system = getRPGSystem(systemId)
  if (!system) return undefined

  if (system.skills.type === "list") {
    return system.skills.skills?.find((skill) => skill.id === skillId)
  } else if (system.skills.type === "categories") {
    for (const category of system.skills.categories || []) {
      const skill = category.skills.find((skill) => skill.id === skillId)
      if (skill) return skill
    }
  }
  return undefined
}

export function calculateDerivedStat(systemId: string, statId: string, attributes: Record<string, number>): number {
  const system = getRPGSystem(systemId)
  const derivedStat = system?.attributes.derivedStats?.find((stat) => stat.id === statId)

  if (!derivedStat) return 0

  // Simple formula evaluation - in a real app you'd want a proper expression parser
  let formula = derivedStat.formula

  // Replace attribute references with values
  for (const [attrId, value] of Object.entries(attributes)) {
    const modifier = Math.floor((value - 10) / 2) // D&D-style modifier
    formula = formula.replace(new RegExp(`${attrId}_mod`, "g"), modifier.toString())
    formula = formula.replace(new RegExp(attrId, "g"), value.toString())
  }

  // Basic math evaluation (unsafe - use a proper parser in production)
  try {
    return eval(formula) || 0
  } catch {
    return 0
  }
}
