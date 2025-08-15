"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  campaignDatabase,
  getStatusColor,
  getPriorityColor,
  getRelationshipColor,
  calculateCampaignStats,
  getSessionsByCampaign,
  getQuestsByCampaign,
  getNPCsByCampaign,
  createNewCampaign,
  type Campaign,
} from "@/lib/campaign-data"
import { ArrowLeft, ScrollText, Plus, Users, Calendar, MapPin, Clock, Eye } from "lucide-react"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(campaignDatabase)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newCampaignData, setNewCampaignData] = useState({
    name: "",
    description: "",
    location: "",
    theme: "High Fantasy",
  })

  const campaignStats = useMemo(() => calculateCampaignStats(), [campaigns])

  const handleCreateCampaign = () => {
    const newCampaign = createNewCampaign(newCampaignData)
    setCampaigns([...campaigns, newCampaign])
    setNewCampaignData({ name: "", description: "", location: "", theme: "High Fantasy" })
    setShowCreateDialog(false)
  }

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Suite
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Campaign Chronicles</h1>
              <p className="text-sm text-slate-400">Epic Quest Documentation</p>
            </div>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Campaign</DialogTitle>
              <DialogDescription className="text-slate-400">
                Start a new epic adventure for your players
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Campaign Name</label>
                <Input
                  placeholder="Enter campaign name..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                  value={newCampaignData.name}
                  onChange={(e) => setNewCampaignData({ ...newCampaignData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your campaign..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                  value={newCampaignData.description}
                  onChange={(e) => setNewCampaignData({ ...newCampaignData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Setting/Location</label>
                <Input
                  placeholder="Campaign setting..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                  value={newCampaignData.location}
                  onChange={(e) => setNewCampaignData({ ...newCampaignData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Theme</label>
                <Select
                  value={newCampaignData.theme}
                  onValueChange={(value) => setNewCampaignData({ ...newCampaignData, theme: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="High Fantasy">High Fantasy</SelectItem>
                    <SelectItem value="Dark Fantasy">Dark Fantasy</SelectItem>
                    <SelectItem value="Urban Fantasy">Urban Fantasy</SelectItem>
                    <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                    <SelectItem value="Horror">Horror</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateCampaign}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={!newCampaignData.name.trim()}
                >
                  Create Campaign
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="px-6 pb-8">
        {/* Campaign Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ScrollText className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Total Campaigns</h4>
              <p className="text-2xl font-bold text-amber-400">{campaignStats.totalCampaigns}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Active Players</h4>
              <p className="text-2xl font-bold text-green-400">{campaignStats.activePlayers}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Sessions Played</h4>
              <p className="text-2xl font-bold text-blue-400">{campaignStats.totalSessions}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Hours Played</h4>
              <p className="text-2xl font-bold text-purple-400">{campaignStats.totalHours}</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <Dialog key={campaign.id}>
              <DialogTrigger asChild>
                <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-xl">{campaign.name}</CardTitle>
                        <CardDescription className="text-slate-400 mt-1">{campaign.description}</CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(campaign.status)} text-white`}>{campaign.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{campaign.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{campaign.players.length} players</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Campaign Progress</span>
                          <span className="text-slate-300">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">Sessions: {campaign.sessions.length}</span>
                        </div>
                        {campaign.nextSession && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">Next: {campaign.nextSession.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Campaign Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl">{campaign.name}</DialogTitle>
                  <DialogDescription className="text-slate-400">{campaign.description}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-slate-700/50">
                    <TabsTrigger value="overview" className="text-slate-300">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="players" className="text-slate-300">
                      Players
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="text-slate-300">
                      Sessions
                    </TabsTrigger>
                    <TabsTrigger value="quests" className="text-slate-300">
                      Quests
                    </TabsTrigger>
                    <TabsTrigger value="npcs" className="text-slate-300">
                      NPCs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Campaign Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status:</span>
                            <Badge className={`${getStatusColor(campaign.status)} text-white`}>{campaign.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Theme:</span>
                            <span className="text-slate-300">{campaign.theme}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Level:</span>
                            <span className="text-slate-300">{campaign.level}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Location:</span>
                            <span className="text-slate-300">{campaign.location}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Campaign Progress</span>
                            <span className="text-slate-300">{campaign.progress}%</span>
                          </div>
                          <Progress value={campaign.progress} className="h-3" />
                        </div>
                      </div>
                    </div>
                    {campaign.notes && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Campaign Notes</h4>
                        <p className="text-slate-300 text-sm bg-slate-700/30 p-3 rounded-lg">{campaign.notes}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="players" className="space-y-4">
                    <div className="grid gap-4">
                      {campaign.players.map((player) => (
                        <Card key={player.id} className="bg-slate-700/30 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-semibold">{player.characterName}</h4>
                                <p className="text-slate-400 text-sm">
                                  {player.name} • Level {player.level} {player.characterClass}
                                </p>
                              </div>
                              <Badge
                                className={`${player.status === "Active" ? "bg-green-600" : "bg-gray-600"} text-white`}
                              >
                                {player.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="sessions" className="space-y-4">
                    <div className="grid gap-4">
                      {getSessionsByCampaign(campaign.id).map((session) => (
                        <Card key={session.id} className="bg-slate-700/30 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-semibold">
                                  Session {session.sessionNumber}: {session.title}
                                </h4>
                                <p className="text-slate-400 text-sm">
                                  {session.date.toLocaleDateString()} • {session.duration} hours
                                </p>
                              </div>
                              <Badge className="bg-blue-600 text-white">{session.experience} XP</Badge>
                            </div>
                            <p className="text-slate-300 text-sm mb-2">{session.summary}</p>
                            {session.treasure.length > 0 && (
                              <div className="text-xs text-slate-400">Treasure: {session.treasure.join(", ")}</div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="quests" className="space-y-4">
                    <div className="grid gap-4">
                      {getQuestsByCampaign(campaign.id).map((quest) => (
                        <Card key={quest.id} className="bg-slate-700/30 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-semibold">{quest.title}</h4>
                                <p className="text-slate-300 text-sm">{quest.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={`${getStatusColor(quest.status)} text-white`}>{quest.status}</Badge>
                                <Badge className={`${getPriorityColor(quest.priority)} text-white`}>
                                  {quest.priority}
                                </Badge>
                              </div>
                            </div>
                            {quest.rewards.length > 0 && (
                              <div className="text-xs text-slate-400">Rewards: {quest.rewards.join(", ")}</div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="npcs" className="space-y-4">
                    <div className="grid gap-4">
                      {getNPCsByCampaign(campaign.id).map((npc) => (
                        <Card key={npc.id} className="bg-slate-700/30 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-white font-semibold">{npc.name}</h4>
                                <p className="text-slate-400 text-sm">
                                  {npc.role} • {npc.location}
                                </p>
                                <p className="text-slate-300 text-sm mt-1">{npc.description}</p>
                              </div>
                              <Badge className={`${getRelationshipColor(npc.relationship)} text-white`}>
                                {npc.relationship}
                              </Badge>
                            </div>
                            {npc.notes && <div className="text-xs text-slate-400 mt-2">Notes: {npc.notes}</div>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  )
}
