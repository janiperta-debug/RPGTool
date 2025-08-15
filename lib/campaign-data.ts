import { getRPGSystem } from "./rpg-systems"

export interface UniversalCampaign {
  id: string
  name: string
  description: string
  systemId: string // Added RPG system ID
  status: "Active" | "Completed" | "Planning" | "On Hold"
  players: UniversalPlayer[]
  sessions: UniversalSession[]
  nextSession?: Date
  progress: number
  location: string
  theme: string
  systemData: Record<string, any> // System-specific campaign data
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface UniversalPlayer {
  id: string
  name: string
  characterId?: string // Reference to character in character system
  characterName: string
  characterDetails: string // Flexible character description
  status: "Active" | "Inactive"
  systemData: Record<string, any> // System-specific player data
}

export interface UniversalSession {
  id: string
  campaignId: string
  sessionNumber: number
  title: string
  date: Date
  duration: number // in hours
  summary: string
  notes: string
  systemData: Record<string, any> // System-specific session data (XP, advancement, etc.)
  rewards: SessionReward[]
  npcsIntroduced: string[]
  locationsVisited: string[]
  questsProgressed: string[]
  playerAttendance: string[]
}

export interface SessionReward {
  type: "experience" | "treasure" | "advancement" | "other"
  description: string
  value?: number
  systemSpecific?: Record<string, any>
}

export interface Quest {
  id: string
  campaignId: string
  title: string
  description: string
  status: "Active" | "Completed" | "Failed" | "On Hold"
  priority: "Low" | "Medium" | "High" | "Critical"
  rewards: string[]
  notes: string
  systemData: Record<string, any> // System-specific quest data
}

export interface NPC {
  id: string
  campaignId: string
  name: string
  role: string
  location: string
  description: string
  relationship: "Ally" | "Enemy" | "Neutral" | "Unknown"
  notes: string
  systemData: Record<string, any> // System-specific NPC data (stats, abilities, etc.)
}

export const campaignDatabase: UniversalCampaign[] = []
export const sessionDatabase: UniversalSession[] = []
export const questDatabase: Quest[] = []
export const npcDatabase: NPC[] = []

export const systemThemes = {
  dnd5e: [
    "High Fantasy",
    "Dark Fantasy",
    "Urban Fantasy",
    "Sword & Sorcery",
    "Epic Adventure",
    "Political Intrigue",
    "Dungeon Crawl",
    "Exploration",
  ],
  call_of_cthulhu: [
    "Classic 1920s",
    "Modern Horror",
    "Pulp Adventure",
    "Delta Green",
    "Gaslight Victorian",
    "Dark Ages",
    "Dreamlands",
    "Cosmic Horror",
  ],
  vampire_masquerade: [
    "Gothic-Punk",
    "Victorian Age",
    "Dark Ages",
    "Modern Nights",
    "Sabbat Chronicle",
    "Anarch Movement",
    "Camarilla Politics",
    "Gehenna Rising",
  ],
  cyberpunk_red: [
    "Corporate Espionage",
    "Street Level",
    "Netrunner Focus",
    "Nomad Wanderers",
    "Media Conspiracy",
    "Rockerboy Revolution",
    "Solo Mercenary",
    "Techie Innovation",
  ],
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "bg-green-600"
    case "Completed":
      return "bg-blue-600"
    case "Planning":
      return "bg-yellow-600"
    case "On Hold":
      return "bg-gray-600"
    case "Failed":
      return "bg-red-600"
    default:
      return "bg-gray-600"
  }
}

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Critical":
      return "bg-red-600"
    case "High":
      return "bg-orange-600"
    case "Medium":
      return "bg-yellow-600"
    case "Low":
      return "bg-green-600"
    default:
      return "bg-gray-600"
  }
}

export const getRelationshipColor = (relationship: string): string => {
  switch (relationship) {
    case "Ally":
      return "bg-green-600"
    case "Enemy":
      return "bg-red-600"
    case "Neutral":
      return "bg-yellow-600"
    case "Unknown":
      return "bg-gray-600"
    default:
      return "bg-gray-600"
  }
}

export const getCampaignById = (id: string): UniversalCampaign | undefined => {
  return campaignDatabase.find((campaign) => campaign.id === id)
}

export const getSessionsByCampaign = (campaignId: string): UniversalSession[] => {
  return sessionDatabase.filter((session) => session.campaignId === campaignId)
}

export const getQuestsByCampaign = (campaignId: string): Quest[] => {
  return questDatabase.filter((quest) => quest.campaignId === campaignId)
}

export const getNPCsByCampaign = (campaignId: string): NPC[] => {
  return npcDatabase.filter((npc) => npc.campaignId === campaignId)
}

export const getCampaignsBySystem = (systemId: string): UniversalCampaign[] => {
  return campaignDatabase.filter((campaign) => campaign.systemId === systemId)
}

export const calculateCampaignStats = (systemId?: string) => {
  const filteredCampaigns = systemId ? getCampaignsBySystem(systemId) : campaignDatabase

  const totalCampaigns = filteredCampaigns.length
  const activePlayers = filteredCampaigns
    .filter((c) => c.status === "Active")
    .reduce((sum, c) => sum + c.players.filter((p) => p.status === "Active").length, 0)

  const campaignIds = filteredCampaigns.map((c) => c.id)
  const filteredSessions = sessionDatabase.filter((s) => campaignIds.includes(s.campaignId))

  const totalSessions = filteredSessions.length
  const totalHours = filteredSessions.reduce((sum, s) => sum + s.duration, 0)

  return {
    totalCampaigns,
    activePlayers,
    totalSessions,
    totalHours,
  }
}

export const createNewCampaign = (campaignData: Partial<UniversalCampaign>): UniversalCampaign => {
  const system = getRPGSystem(campaignData.systemId || "dnd5e")
  if (!system) throw new Error("Invalid RPG system")

  const newCampaign: UniversalCampaign = {
    id: crypto.randomUUID(),
    name: campaignData.name || "New Campaign",
    description: campaignData.description || "",
    systemId: campaignData.systemId || "dnd5e",
    status: "Planning",
    players: [],
    sessions: [],
    progress: 0,
    location: campaignData.location || "",
    theme: campaignData.theme || systemThemes[campaignData.systemId as keyof typeof systemThemes]?.[0] || "Adventure",
    systemData: initializeSystemData(campaignData.systemId || "dnd5e"),
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  campaignDatabase.push(newCampaign)
  return newCampaign
}

const initializeSystemData = (systemId: string): Record<string, any> => {
  switch (systemId) {
    case "dnd5e":
      return {
        startingLevel: 1,
        milestoneProgression: true,
        partyLevel: 1,
        campaignType: "Standard",
      }
    case "call_of_cthulhu":
      return {
        era: "1920s",
        sanityTracking: true,
        pulpRules: false,
        investigationFocus: true,
      }
    case "vampire_masquerade":
      return {
        chronicle: "Camarilla",
        city: "",
        generation: 13,
        coterie: true,
      }
    case "cyberpunk_red":
      return {
        city: "Night City",
        corporatePresence: "High",
        streetLevel: true,
        netArchitecture: "Standard",
      }
    default:
      return {}
  }
}

export const addSessionToCampaign = (campaignId: string, sessionData: Partial<UniversalSession>): UniversalSession => {
  const campaign = getCampaignById(campaignId)
  if (!campaign) throw new Error("Campaign not found")

  const existingSessions = getSessionsByCampaign(campaignId)

  const newSession: UniversalSession = {
    id: crypto.randomUUID(),
    campaignId,
    sessionNumber: existingSessions.length + 1,
    title: sessionData.title || `Session ${existingSessions.length + 1}`,
    date: sessionData.date || new Date(),
    duration: sessionData.duration || 3,
    summary: sessionData.summary || "",
    notes: sessionData.notes || "",
    systemData: sessionData.systemData || {},
    rewards: sessionData.rewards || [],
    npcsIntroduced: sessionData.npcsIntroduced || [],
    locationsVisited: sessionData.locationsVisited || [],
    questsProgressed: sessionData.questsProgressed || [],
    playerAttendance: sessionData.playerAttendance || [],
  }

  sessionDatabase.push(newSession)
  campaign.updatedAt = new Date()

  return newSession
}

export const addPlayerToCampaign = (campaignId: string, playerData: Partial<UniversalPlayer>): UniversalPlayer => {
  const campaign = getCampaignById(campaignId)
  if (!campaign) throw new Error("Campaign not found")

  const newPlayer: UniversalPlayer = {
    id: crypto.randomUUID(),
    name: playerData.name || "New Player",
    characterId: playerData.characterId,
    characterName: playerData.characterName || "New Character",
    characterDetails: playerData.characterDetails || "",
    status: "Active",
    systemData: playerData.systemData || {},
  }

  campaign.players.push(newPlayer)
  campaign.updatedAt = new Date()

  return newPlayer
}

export const createQuest = (campaignId: string, questData: Partial<Quest>): Quest => {
  const campaign = getCampaignById(campaignId)
  if (!campaign) throw new Error("Campaign not found")

  const newQuest: Quest = {
    id: crypto.randomUUID(),
    campaignId,
    title: questData.title || "New Quest",
    description: questData.description || "",
    status: "Active",
    priority: questData.priority || "Medium",
    rewards: questData.rewards || [],
    notes: questData.notes || "",
    systemData: questData.systemData || {},
  }

  questDatabase.push(newQuest)
  return newQuest
}

export const createNPC = (campaignId: string, npcData: Partial<NPC>): NPC => {
  const campaign = getCampaignById(campaignId)
  if (!campaign) throw new Error("Campaign not found")

  const newNPC: NPC = {
    id: crypto.randomUUID(),
    campaignId,
    name: npcData.name || "New NPC",
    role: npcData.role || "Citizen",
    location: npcData.location || "",
    description: npcData.description || "",
    relationship: npcData.relationship || "Neutral",
    notes: npcData.notes || "",
    systemData: npcData.systemData || {},
  }

  npcDatabase.push(newNPC)
  return newNPC
}

export const getSystemThemes = (systemId: string): string[] => {
  return systemThemes[systemId as keyof typeof systemThemes] || ["Adventure"]
}

export const advanceCampaign = (campaignId: string, advancement: any): UniversalCampaign | null => {
  const campaign = getCampaignById(campaignId)
  if (!campaign) return null

  const system = getRPGSystem(campaign.systemId)
  if (!system) return null

  // System-specific advancement logic
  if (system.advancement.type === "levels" && advancement.level) {
    campaign.systemData.partyLevel = advancement.level
    campaign.players.forEach((player) => {
      if (player.systemData) {
        player.systemData.level = advancement.level
      }
    })
  }

  if (system.advancement.type === "points" && advancement.points) {
    campaign.systemData.totalPoints = (campaign.systemData.totalPoints || 0) + advancement.points
  }

  campaign.progress = Math.min(100, campaign.progress + (advancement.progressIncrease || 0))
  campaign.updatedAt = new Date()

  return campaign
}

export const exportCampaign = (campaignId: string): string => {
  const campaign = getCampaignById(campaignId)
  if (!campaign) throw new Error("Campaign not found")

  const sessions = getSessionsByCampaign(campaignId)
  const quests = getQuestsByCampaign(campaignId)
  const npcs = getNPCsByCampaign(campaignId)

  const exportData = {
    campaign,
    sessions,
    quests,
    npcs,
    exportedAt: new Date(),
  }

  return JSON.stringify(exportData, null, 2)
}

export const importCampaign = (data: string): UniversalCampaign => {
  const importData = JSON.parse(data)
  const campaign = importData.campaign as UniversalCampaign

  // Generate new IDs to avoid conflicts
  const oldCampaignId = campaign.id
  const newCampaignId = crypto.randomUUID()
  campaign.id = newCampaignId
  campaign.createdAt = new Date()
  campaign.updatedAt = new Date()

  // Update sessions
  importData.sessions?.forEach((session: UniversalSession) => {
    session.id = crypto.randomUUID()
    session.campaignId = newCampaignId
    sessionDatabase.push(session)
  })

  // Update quests
  importData.quests?.forEach((quest: Quest) => {
    quest.id = crypto.randomUUID()
    quest.campaignId = newCampaignId
    questDatabase.push(quest)
  })

  // Update NPCs
  importData.npcs?.forEach((npc: NPC) => {
    npc.id = crypto.randomUUID()
    npc.campaignId = newCampaignId
    npcDatabase.push(npc)
  })

  campaignDatabase.push(campaign)
  return campaign
}
