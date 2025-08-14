import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Sword, Shield, Heart, Zap, Eye, Users } from "lucide-react"
import Link from "next/link"

export default function CharactersPage() {
  const characters = [
    {
      id: 1,
      name: "Thorin Ironforge",
      class: "Paladin",
      level: 12,
      race: "Dwarf",
      hp: 98,
      maxHp: 120,
      ac: 18,
      status: "Active",
      campaign: "The Lost Crown",
    },
    {
      id: 2,
      name: "Lyralei Moonwhisper",
      class: "Ranger",
      level: 10,
      race: "Elf",
      hp: 76,
      maxHp: 85,
      ac: 16,
      status: "Active",
      campaign: "Shadows of Eldoria",
    },
    {
      id: 3,
      name: "Zara Flameheart",
      class: "Sorcerer",
      level: 8,
      race: "Tiefling",
      hp: 45,
      maxHp: 52,
      ac: 13,
      status: "Injured",
      campaign: "The Lost Crown",
    },
    {
      id: 4,
      name: "Gareth Stormwind",
      class: "Fighter",
      level: 15,
      race: "Human",
      hp: 142,
      maxHp: 142,
      ac: 20,
      status: "Active",
      campaign: "Legends of the North",
    },
  ]

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
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Character Forge</h1>
              <p className="text-sm text-slate-400">Legendary Heroes Management</p>
            </div>
          </div>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Forge New Hero
        </Button>
      </header>

      <div className="px-6 pb-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Total Heroes</h4>
              <p className="text-2xl font-bold text-amber-400">12</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Active</h4>
              <p className="text-2xl font-bold text-green-400">9</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Injured</h4>
              <p className="text-2xl font-bold text-red-400">2</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Retired</h4>
              <p className="text-2xl font-bold text-slate-400">1</p>
            </CardContent>
          </Card>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Card
              key={character.id}
              className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{character.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      Level {character.level} {character.race} {character.class}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={character.status === "Active" ? "default" : "destructive"}
                    className={character.status === "Active" ? "bg-green-600" : "bg-red-600"}
                  >
                    {character.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-slate-300">HP</span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {character.hp}/{character.maxHp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-300">AC</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{character.ac}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-600">
                    <p className="text-xs text-slate-400">Campaign: {character.campaign}</p>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm">
                    View Character Sheet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
