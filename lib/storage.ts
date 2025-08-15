// Local storage utilities for RPG Tool data persistence
export interface StorageData {
  characters: any[]
  treasureVault: any[]
  campaigns: any[]
  sessions: any[]
  quests: any[]
  npcs: any[]
  rules: any[]
  selectedSystem: string
  userPreferences: {
    theme: string
    defaultDiceSet: string
    autoSave: boolean
  }
  lastSync: Date
}

const STORAGE_KEY = "rpg-tool-data"
const STORAGE_VERSION = "1.0.0"

// Initialize default storage structure
const getDefaultStorageData = (): StorageData => ({
  characters: [],
  treasureVault: [],
  campaigns: [],
  sessions: [],
  quests: [],
  npcs: [],
  rules: [],
  selectedSystem: "dnd5e",
  userPreferences: {
    theme: "dark",
    defaultDiceSet: "standard",
    autoSave: true,
  },
  lastSync: new Date(),
})

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__localStorage_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

// Get data from localStorage
export const getStorageData = (): StorageData => {
  if (!isLocalStorageAvailable()) {
    console.warn("[RPG Tool] localStorage not available, using default data")
    return getDefaultStorageData()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return getDefaultStorageData()
    }

    const parsed = JSON.parse(stored)

    // Validate storage version and structure
    if (!parsed.version || parsed.version !== STORAGE_VERSION) {
      console.warn("[RPG Tool] Storage version mismatch, migrating data")
      return migrateStorageData(parsed)
    }

    // Convert date strings back to Date objects
    if (parsed.data.lastSync) {
      parsed.data.lastSync = new Date(parsed.data.lastSync)
    }

    return { ...getDefaultStorageData(), ...parsed.data }
  } catch (error) {
    console.error("[RPG Tool] Error reading storage data:", error)
    return getDefaultStorageData()
  }
}

// Save data to localStorage
export const saveStorageData = (data: Partial<StorageData>): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn("[RPG Tool] localStorage not available, cannot save data")
    return false
  }

  try {
    const currentData = getStorageData()
    const updatedData = {
      ...currentData,
      ...data,
      lastSync: new Date(),
    }

    const storageObject = {
      version: STORAGE_VERSION,
      data: updatedData,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageObject))
    console.log("[RPG Tool] Data saved successfully")
    return true
  } catch (error) {
    console.error("[RPG Tool] Error saving storage data:", error)
    return false
  }
}

// Migrate old storage data to new format
const migrateStorageData = (oldData: any): StorageData => {
  console.log("[RPG Tool] Migrating storage data to version", STORAGE_VERSION)

  const defaultData = getDefaultStorageData()

  // Preserve existing data where possible
  if (oldData.data) {
    return {
      ...defaultData,
      ...oldData.data,
      lastSync: new Date(),
    }
  }

  return defaultData
}

// Clear all storage data
export const clearStorageData = (): boolean => {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log("[RPG Tool] Storage data cleared")
    return true
  } catch (error) {
    console.error("[RPG Tool] Error clearing storage data:", error)
    return false
  }
}

// Export data for backup
export const exportData = (): string => {
  const data = getStorageData()
  return JSON.stringify(
    {
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      data,
    },
    null,
    2,
  )
}

// Import data from backup
export const importData = (jsonString: string): boolean => {
  try {
    const imported = JSON.parse(jsonString)

    if (!imported.data) {
      throw new Error("Invalid backup format")
    }

    // Validate and migrate if necessary
    const migratedData = imported.version === STORAGE_VERSION ? imported.data : migrateStorageData(imported)

    return saveStorageData(migratedData)
  } catch (error) {
    console.error("[RPG Tool] Error importing data:", error)
    return false
  }
}

// Auto-save functionality
let autoSaveTimeout: NodeJS.Timeout | null = null

export const scheduleAutoSave = (data: Partial<StorageData>, delay = 2000): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }

  autoSaveTimeout = setTimeout(() => {
    const currentData = getStorageData()
    if (currentData.userPreferences.autoSave) {
      saveStorageData(data)
    }
  }, delay)
}

// Storage event listener for cross-tab synchronization
export const onStorageChange = (callback: (data: StorageData) => void): (() => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue)
        if (parsed.data) {
          callback(parsed.data)
        }
      } catch (error) {
        console.error("[RPG Tool] Error handling storage change:", error)
      }
    }
  }

  window.addEventListener("storage", handleStorageChange)

  return () => {
    window.removeEventListener("storage", handleStorageChange)
  }
}

// Specific data type helpers
export const saveCharacters = (characters: any[]): boolean => {
  return saveStorageData({ characters })
}

export const saveTreasureVault = (treasureVault: any[]): boolean => {
  return saveStorageData({ treasureVault })
}

export const saveCampaigns = (campaigns: any[]): boolean => {
  return saveStorageData({ campaigns })
}

export const saveSessions = (sessions: any[]): boolean => {
  return saveStorageData({ sessions })
}

export const saveQuests = (quests: any[]): boolean => {
  return saveStorageData({ quests })
}

export const saveNPCs = (npcs: any[]): boolean => {
  return saveStorageData({ npcs })
}

export const saveUserPreferences = (preferences: Partial<StorageData["userPreferences"]>): boolean => {
  const currentData = getStorageData()
  return saveStorageData({
    userPreferences: {
      ...currentData.userPreferences,
      ...preferences,
    },
  })
}

export const saveSelectedSystem = (system: string): boolean => {
  return saveStorageData({ selectedSystem: system })
}

// Data validation helpers
export const validateCharacterData = (character: any): boolean => {
  return !!(character.id && character.name && character.class && character.race)
}

export const validateCampaignData = (campaign: any): boolean => {
  return !!(campaign.id && campaign.name && campaign.status)
}

export const validateTreasureData = (treasure: any): boolean => {
  return !!(treasure.id && treasure.name && treasure.rarity)
}

// Storage statistics
export const getStorageStats = () => {
  if (!isLocalStorageAvailable()) {
    return { available: false, used: 0, total: 0, percentage: 0 }
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const used = data ? new Blob([data]).size : 0
    const total = 5 * 1024 * 1024 // 5MB typical localStorage limit

    return {
      available: true,
      used,
      total,
      percentage: Math.round((used / total) * 100),
      usedFormatted: formatBytes(used),
      totalFormatted: formatBytes(total),
    }
  } catch {
    return { available: false, used: 0, total: 0, percentage: 0 }
  }
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
