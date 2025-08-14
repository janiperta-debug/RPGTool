import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, ScrollText, Users, Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function CampaignsPage() {
  const campaigns = [
    {
      id: 1,
      name: "The Lost Crown",
      description: "A quest to reclaim the stolen crown of the ancient kingdom",
      status: "Active",
      players: 5,
      sessions: 12,
      nextSession: "2024-01-15",
      progress: 65,
      location: "Kingdom of Eldoria",
    },
    {
      id: 2,
      name: "Shadows of Eldoria",
      description: "Dark forces threaten the peaceful realm",
      status: "Active",
      players: 4,
      sessions: 8,
      nextSession: "2024-01-18",
      progress: 40,
      location: "Eldorian Forests",
    },
    {
      id: 3,
      name: "Legends of the North",
      description: "Epic adventures in the frozen northlands",
      status: "Completed",
      players: 6,
      sessions: 24,
      nextSession: null,
      progress: 100,
      location: "Northern Wastes",
    },
    {
      id: 4,
      name: "The Crimson Tide",
      description: "Pirates and sea monsters in the southern seas",
      status: "Planning",
      players: 3,
      sessions: 0,
      nextSession: "2024-01-22",
      progress: 5,
      location: "Crimson Archipelago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600"
      case "Completed":
        return "bg-blue-600"
      case "Planning":
        return "bg-yellow-600"
      case "On Hold":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
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
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
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
              <p className="text-2xl font-bold text-amber-400">23</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Active Players</h4>
              <p className="text-2xl font-bold text-green-400">18</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Sessions Played</h4>
              <p className="text-2xl font-bold text-blue-400">156</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Hours Played</h4>
              <p className="text-2xl font-bold text-purple-400">624</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors"
            >
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
                      <span className="text-slate-300">{campaign.players} players</span>
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
                      <span className="text-slate-300">Sessions: {campaign.sessions}</span>
                    </div>
                    {campaign.nextSession && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">Next: {campaign.nextSession}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm">View Campaign</Button>
                    <Button
                      variant="outline"
                      className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 text-sm"
                    >
                      Session Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
