import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, BookOpen, Search, Filter, Sword, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function RulesPage() {
  const ruleCategories = [
    { name: "Combat", count: 156, icon: Sword, color: "bg-red-600" },
    { name: "Spellcasting", count: 234, icon: Zap, color: "bg-purple-600" },
    { name: "Equipment", count: 189, icon: Shield, color: "bg-blue-600" },
    { name: "Social", count: 78, icon: Users, color: "bg-green-600" },
  ]

  const recentRules = [
    {
      id: 1,
      title: "Advantage and Disadvantage",
      category: "Combat",
      description: "Roll twice and take the higher or lower result",
      page: "173",
      source: "Player's Handbook",
    },
    {
      id: 2,
      title: "Spell Concentration",
      category: "Spellcasting",
      description: "Maintaining focus on magical effects",
      page: "203",
      source: "Player's Handbook",
    },
    {
      id: 3,
      title: "Armor Class Calculation",
      category: "Equipment",
      description: "How to determine defensive capabilities",
      page: "144",
      source: "Player's Handbook",
    },
    {
      id: 4,
      title: "Inspiration Points",
      category: "Social",
      description: "Rewarding exceptional roleplay",
      page: "125",
      source: "Dungeon Master's Guide",
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
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Rules Compendium</h1>
              <p className="text-sm text-slate-400">Master the Art of Gameplay</p>
            </div>
          </div>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Rule
        </Button>
      </header>

      <div className="px-6 pb-8">
        {/* Search and Filter */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search rules, spells, abilities..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Source
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rule Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {ruleCategories.map((category) => (
            <Card
              key={category.name}
              className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <category.icon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-1">{category.name}</h4>
                <p className="text-xs text-slate-400">{category.count} rules</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Rules */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-xl">Recently Accessed Rules</CardTitle>
            <CardDescription className="text-slate-400">
              Quick access to your most referenced gameplay mechanics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold">{rule.title}</h4>
                      <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                        {rule.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-1">{rule.description}</p>
                    <p className="text-xs text-slate-500">
                      {rule.source}, Page {rule.page}
                    </p>
                  </div>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    View Rule
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/70 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Combat Actions</CardTitle>
              <CardDescription className="text-slate-400">Essential combat mechanics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Attack Action</span>
                  <span className="text-amber-400">1 Action</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Dash</span>
                  <span className="text-amber-400">1 Action</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Dodge</span>
                  <span className="text-amber-400">1 Action</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Help</span>
                  <span className="text-amber-400">1 Action</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Condition Effects</CardTitle>
              <CardDescription className="text-slate-400">Status effect quick reference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Blinded</span>
                  <span className="text-red-400">Disadvantage</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Poisoned</span>
                  <span className="text-red-400">Disadvantage</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Prone</span>
                  <span className="text-red-400">Disadvantage</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Stunned</span>
                  <span className="text-red-400">Incapacitated</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
