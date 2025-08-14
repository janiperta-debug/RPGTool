import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Shield, Search, Filter, Sword, Gem, Scroll, Crown } from "lucide-react"
import Link from "next/link"

export default function TreasurePage() {
  const treasureCategories = [
    { name: "Weapons", count: 45, icon: Sword, color: "bg-red-600" },
    { name: "Armor", count: 32, icon: Shield, color: "bg-blue-600" },
    { name: "Artifacts", count: 18, icon: Crown, color: "bg-purple-600" },
    { name: "Consumables", count: 61, icon: Scroll, color: "bg-green-600" },
  ]

  const treasureItems = [
    {
      id: 1,
      name: "Flamebrand Longsword",
      rarity: "Rare",
      type: "Weapon",
      value: "2,500 gp",
      description: "A blade wreathed in eternal flames",
      attunement: true,
    },
    {
      id: 2,
      name: "Cloak of Elvenkind",
      rarity: "Uncommon",
      type: "Wondrous Item",
      value: "1,200 gp",
      description: "Grants advantage on Stealth checks",
      attunement: true,
    },
    {
      id: 3,
      name: "Potion of Greater Healing",
      rarity: "Uncommon",
      type: "Potion",
      value: "150 gp",
      description: "Restores 4d4 + 4 hit points",
      attunement: false,
    },
    {
      id: 4,
      name: "Ring of Protection",
      rarity: "Rare",
      type: "Ring",
      value: "3,500 gp",
      description: "+1 bonus to AC and saving throws",
      attunement: true,
    },
    {
      id: 5,
      name: "Staff of Power",
      rarity: "Very Rare",
      type: "Staff",
      value: "25,000 gp",
      description: "A legendary arcane focus",
      attunement: true,
    },
    {
      id: 6,
      name: "Bag of Holding",
      rarity: "Uncommon",
      type: "Wondrous Item",
      value: "4,000 gp",
      description: "Extradimensional storage space",
      attunement: false,
    },
  ]

  const getRarityColor = (rarity: string) => {
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Treasure Vault</h1>
              <p className="text-sm text-slate-400">Curated Magical Collections</p>
            </div>
          </div>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Treasure
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
                  placeholder="Search magical items, artifacts, treasures..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Rarity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Treasure Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {treasureCategories.map((category) => (
            <Card
              key={category.name}
              className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <category.icon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-1">{category.name}</h4>
                <p className="text-xs text-slate-400">{category.count} items</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Treasure Vault Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Gem className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Total Items</h4>
              <p className="text-2xl font-bold text-amber-400">156</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Legendary</h4>
              <p className="text-2xl font-bold text-purple-400">8</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Scroll className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Consumables</h4>
              <p className="text-2xl font-bold text-green-400">61</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Requires Attunement</h4>
              <p className="text-2xl font-bold text-blue-400">87</p>
            </CardContent>
          </Card>
        </div>

        {/* Treasure Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treasureItems.map((item) => (
            <Card key={item.id} className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                    <CardDescription className="text-slate-400">{item.type}</CardDescription>
                  </div>
                  <Badge className={`${getRarityColor(item.rarity)} text-white`}>{item.rarity}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Value</span>
                    <span className="text-sm font-semibold text-amber-400">{item.value}</span>
                  </div>
                  {item.attunement && (
                    <Badge variant="outline" className="text-xs border-amber-500 text-amber-400">
                      Requires Attunement
                    </Badge>
                  )}
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
