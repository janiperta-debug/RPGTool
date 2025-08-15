"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useStorage } from "@/hooks/use-storage"
import { exportData, importData, clearStorageData, getStorageStats, saveUserPreferences } from "@/lib/storage"
import { Download, Upload, Trash2, Database, Save, AlertTriangle } from "lucide-react"

export function DataManagement() {
  const { data, saveData } = useStorage()
  const { toast } = useToast()
  const [importText, setImportText] = useState("")
  const [showClearDialog, setShowClearDialog] = useState(false)

  const storageStats = getStorageStats()

  const handleExport = () => {
    try {
      const exportedData = exportData()
      const blob = new Blob([exportedData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rpg-tool-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data Exported",
        description: "Your RPG Tool data has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    if (!importText.trim()) {
      toast({
        title: "Import Failed",
        description: "Please paste your backup data first.",
        variant: "destructive",
      })
      return
    }

    try {
      const success = importData(importText)
      if (success) {
        toast({
          title: "Data Imported",
          description: "Your backup has been imported successfully. Please refresh the page.",
        })
        setImportText("")
        // Refresh the page to load new data
        setTimeout(() => window.location.reload(), 2000)
      } else {
        throw new Error("Import failed")
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid backup format or corrupted data.",
        variant: "destructive",
      })
    }
  }

  const handleClearData = () => {
    try {
      const success = clearStorageData()
      if (success) {
        toast({
          title: "Data Cleared",
          description: "All RPG Tool data has been cleared. Please refresh the page.",
        })
        setShowClearDialog(false)
        // Refresh the page to reset state
        setTimeout(() => window.location.reload(), 2000)
      } else {
        throw new Error("Clear failed")
      }
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveNow = () => {
    try {
      const success = saveData()
      if (success) {
        toast({
          title: "Data Saved",
          description: "Your data has been saved successfully.",
        })
      } else {
        throw new Error("Save failed")
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAutoSaveToggle = (enabled: boolean) => {
    saveUserPreferences({ autoSave: enabled })
    toast({
      title: enabled ? "Auto-save Enabled" : "Auto-save Disabled",
      description: enabled
        ? "Your data will be automatically saved as you work."
        : "You'll need to manually save your data.",
    })
  }

  if (!data) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400">Loading data management...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Storage Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Storage Status
          </CardTitle>
          <CardDescription className="text-slate-400">Monitor your local data storage usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{data.characters.length}</p>
              <p className="text-sm text-slate-400">Characters</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{data.campaigns.length}</p>
              <p className="text-sm text-slate-400">Campaigns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{data.treasureVault.length}</p>
              <p className="text-sm text-slate-400">Treasure Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{data.sessions.length}</p>
              <p className="text-sm text-slate-400">Sessions</p>
            </div>
          </div>

          {storageStats.available && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Storage Used</span>
                <span className="text-slate-300">
                  {storageStats.usedFormatted} / {storageStats.totalFormatted} ({storageStats.percentage}%)
                </span>
              </div>
              <Progress value={storageStats.percentage} className="h-2" />
              {storageStats.percentage > 80 && (
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Storage is getting full. Consider exporting and clearing old data.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Save & Auto-save */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save Settings
            </CardTitle>
            <CardDescription className="text-slate-400">Manage how your data is saved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-save</p>
                <p className="text-sm text-slate-400">Automatically save changes as you work</p>
              </div>
              <Switch checked={data.userPreferences.autoSave} onCheckedChange={handleAutoSaveToggle} />
            </div>
            <Button onClick={handleSaveNow} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Now
            </Button>
            {data.lastSync && (
              <p className="text-xs text-slate-500 text-center">Last saved: {data.lastSync.toLocaleString()}</p>
            )}
          </CardContent>
        </Card>

        {/* Backup & Restore */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5" />
              Backup & Restore
            </CardTitle>
            <CardDescription className="text-slate-400">Export and import your RPG Tool data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Import Backup Data</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Paste your exported backup data below. This will replace all current data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Paste your backup JSON data here..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-32"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleImport}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={!importText.trim()}
                    >
                      Import Data
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setImportText("")}
                      className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="bg-slate-800/50 border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-slate-400">
            Irreversible actions that will permanently delete your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-red-400">Clear All Data</DialogTitle>
                <DialogDescription className="text-slate-400">
                  This action cannot be undone. All your characters, campaigns, treasure, and settings will be
                  permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-semibold">Warning</span>
                  </div>
                  <p className="text-sm text-red-300">
                    Make sure you have exported your data if you want to keep it. This action will delete everything
                    permanently.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleClearData}
                    variant="destructive"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Yes, Clear Everything
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowClearDialog(false)}
                    className="flex-1 bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
