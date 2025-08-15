"use client"

import { useState, useEffect, useCallback } from "react"
import { getStorageData, saveStorageData, scheduleAutoSave, onStorageChange, type StorageData } from "@/lib/storage"

export const useStorage = () => {
  const [data, setData] = useState<StorageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    try {
      const storageData = getStorageData()
      setData(storageData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const unsubscribe = onStorageChange((newData) => {
      setData(newData)
    })

    return unsubscribe
  }, [])

  // Update data with auto-save
  const updateData = useCallback(
    (updates: Partial<StorageData>) => {
      if (!data) return false

      const newData = { ...data, ...updates }
      setData(newData)

      // Schedule auto-save if enabled
      if (data.userPreferences.autoSave) {
        scheduleAutoSave(updates)
      }

      return true
    },
    [data],
  )

  // Manual save
  const saveData = useCallback(
    (updates?: Partial<StorageData>) => {
      try {
        const dataToSave = updates || data
        if (dataToSave) {
          const success = saveStorageData(dataToSave)
          if (success && updates) {
            setData((prev) => (prev ? { ...prev, ...updates } : null))
          }
          return success
        }
        return false
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save data")
        return false
      }
    },
    [data],
  )

  return {
    data,
    isLoading,
    error,
    updateData,
    saveData,
  }
}

// Specific hooks for different data types
export const useCharacters = () => {
  const { data, updateData, saveData } = useStorage()

  const characters = data?.characters || []

  const addCharacter = useCallback(
    (character: any) => {
      const newCharacters = [...characters, character]
      return updateData({ characters: newCharacters })
    },
    [characters, updateData],
  )

  const updateCharacter = useCallback(
    (id: string, updates: any) => {
      const newCharacters = characters.map((char) => (char.id === id ? { ...char, ...updates } : char))
      return updateData({ characters: newCharacters })
    },
    [characters, updateData],
  )

  const deleteCharacter = useCallback(
    (id: string) => {
      const newCharacters = characters.filter((char) => char.id !== id)
      return updateData({ characters: newCharacters })
    },
    [characters, updateData],
  )

  return {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    saveCharacters: () => saveData({ characters }),
  }
}

export const useTreasure = () => {
  const { data, updateData, saveData } = useStorage()

  const treasureVault = data?.treasureVault || []

  const addTreasure = useCallback(
    (treasure: any) => {
      const newTreasure = [...treasureVault, treasure]
      return updateData({ treasureVault: newTreasure })
    },
    [treasureVault, updateData],
  )

  const updateTreasure = useCallback(
    (id: string, updates: any) => {
      const newTreasure = treasureVault.map((item) => (item.id === id ? { ...item, ...updates } : item))
      return updateData({ treasureVault: newTreasure })
    },
    [treasureVault, updateData],
  )

  const deleteTreasure = useCallback(
    (id: string) => {
      const newTreasure = treasureVault.filter((item) => item.id !== id)
      return updateData({ treasureVault: newTreasure })
    },
    [treasureVault, updateData],
  )

  return {
    treasureVault,
    addTreasure,
    updateTreasure,
    deleteTreasure,
    saveTreasure: () => saveData({ treasureVault }),
  }
}

export const useCampaigns = () => {
  const { data, updateData, saveData } = useStorage()

  const campaigns = data?.campaigns || []
  const sessions = data?.sessions || []
  const quests = data?.quests || []
  const npcs = data?.npcs || []

  const addCampaign = useCallback(
    (campaign: any) => {
      const newCampaigns = [...campaigns, campaign]
      return updateData({ campaigns: newCampaigns })
    },
    [campaigns, updateData],
  )

  const updateCampaign = useCallback(
    (id: string, updates: any) => {
      const newCampaigns = campaigns.map((campaign) => (campaign.id === id ? { ...campaign, ...updates } : campaign))
      return updateData({ campaigns: newCampaigns })
    },
    [campaigns, updateData],
  )

  const deleteCampaign = useCallback(
    (id: string) => {
      const newCampaigns = campaigns.filter((campaign) => campaign.id !== id)
      const newSessions = sessions.filter((session) => session.campaignId !== id)
      const newQuests = quests.filter((quest) => quest.campaignId !== id)
      const newNPCs = npcs.filter((npc) => npc.campaignId !== id)

      return updateData({
        campaigns: newCampaigns,
        sessions: newSessions,
        quests: newQuests,
        npcs: newNPCs,
      })
    },
    [campaigns, sessions, quests, npcs, updateData],
  )

  const addSession = useCallback(
    (session: any) => {
      const newSessions = [...sessions, session]
      return updateData({ sessions: newSessions })
    },
    [sessions, updateData],
  )

  const addQuest = useCallback(
    (quest: any) => {
      const newQuests = [...quests, quest]
      return updateData({ quests: newQuests })
    },
    [quests, updateData],
  )

  const addNPC = useCallback(
    (npc: any) => {
      const newNPCs = [...npcs, npc]
      return updateData({ npcs: newNPCs })
    },
    [npcs, updateData],
  )

  return {
    campaigns,
    sessions,
    quests,
    npcs,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addSession,
    addQuest,
    addNPC,
    saveCampaigns: () => saveData({ campaigns, sessions, quests, npcs }),
  }
}
