"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  searchTreasure,
  getTreasureCategories,
  getRarityColor,
  formatGoldValue,
  generateRandomTreasure,
  type TreasureItem,
} from "@/lib/treasure-data"
import { ArrowLeft, Shield, Plus, Search, Filter, Sword, Gem, Scroll, Crown, Dice6, Sparkles } from "lucide-react"

const iconMap = {
  Sword: Sword,
  Shield: Shield,
  Crown: Crown,
  Scroll: Scroll,
}

export default function TreasurePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRarity, setSelectedRarity] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<TreasureItem | null>(null)
  const [treasureVault, setTreasureVault] = useState<TreasureItem[]>([])
  const [generatedItems, setGeneratedItems] = useState<Partial<TreasureItem>[]>([])

  const filteredTreasure = useMemo(() => {
    return searchTreasure(searchQuery, selectedRarity, selectedType).filter((item) =>
      treasureVault.some((vaultItem) => vaultItem.id === item.id),
    )
  }, [searchQuery, selectedRarity, selectedType, treasureVault])

  const treasureCategories = useMemo(() => getTreasureCategories(), [])

  const handleGenerateRandomTreasure = () => {
    const newItem = generateRandomTreasure()
    setGeneratedItems((prev) => [newItem, ...prev.slice(0, 4)]) // Keep last 5 generated items
  }

  const handleAddGeneratedItem = (item: Partial<TreasureItem>) => {
    if (item.id) {
      const fullItem: TreasureItem = {
        ...item,
        id: item.id,
        name: item.name || "Unknown Item",
        type: item.type || "Unknown",
        rarity: item.rarity || "Common",
        value: item.value || 0,
        description: item.description || "",
        fullDescription: item.fullDescription || "",
        attunement: item.attunement || false,
        properties: item.properties || [],
        tags: item.tags || [],
        source: item.source || "Generated",
        createdAt: item.createdAt || new Date(),
      }
      setTreasureVault((prev) => [fullItem, ...prev])
      setGeneratedItems((prev) => prev.filter((genItem) => genItem.id !== item.id))
    }
  }

  const vaultStats = useMemo(() => {
    const totalItems = treasureVault.length
    const legendaryCount = treasureVault.filter(
      (item) => item.rarity === "Legendary" || item.rarity === "Artifact",
    ).length
    const consumableCount = treasureVault.filter(
      (item) => item.tags.includes("consumable") || item.type.toLowerCase().includes("potion"),
    ).length
    const attunementCount = treasureVault.filter((item) => item.attunement).length

    return { totalItems, legendaryCount, consumableCount, attunementCount }
  }, [treasureVault])

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
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateRandomTreasure}
            variant="outline"
            className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            <Dice6 className="w-4 h-4 mr-2" />
            Generate Treasure
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Treasure
          </Button>
        </div>
      </header>

      <div className="px-6 pb-8">
        {/* Generated Items Preview */}
        {generatedItems.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Recently Generated Treasures
              </CardTitle>
              <CardDescription className="text-slate-400">
                Click to add to your vault or generate new ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedItems.map((item, index) => (
                  <Card key={`${item.id}-${index}`} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                        <Badge className={`${getRarityColor(item.rarity || "Common")} text-white text-xs`}>
                          {item.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{item.type}</p>
                      <p className="text-xs text-slate-300 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-400">{formatGoldValue(item.value || 0)}</span>
                        <Button
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7"
                          onClick={() => handleAddGeneratedItem(item)}
                        >
                          Add to Vault
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search magical items, artifacts, treasures..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-slate-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Rarities" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Uncommon">Uncommon</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Very Rare">Very Rare</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                  <SelectItem value="Artifact">Artifact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Treasure Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {treasureCategories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap]
            return (
              <Card
                key={category.name}
                className={`bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer ${
                  selectedType === category.name.toLowerCase() ? "ring-2 ring-amber-600" : ""
                }`}
                onClick={() =>
                  setSelectedType(selectedType === category.name.toLowerCase() ? "all" : category.name.toLowerCase())
                }
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{category.name}</h4>
                  <p className="text-xs text-slate-400">{category.count} items</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Treasure Vault Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Gem className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Total Items</h4>
              <p className="text-2xl font-bold text-amber-400">{vaultStats.totalItems}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Legendary</h4>
              <p className="text-2xl font-bold text-purple-400">{vaultStats.legendaryCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Scroll className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Consumables</h4>
              <p className="text-2xl font-bold text-green-400">{vaultStats.consumableCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Requires Attunement</h4>
              <p className="text-2xl font-bold text-blue-400">{vaultStats.attunementCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Treasure Items Grid or Empty State */}
        {filteredTreasure.length === 0 && treasureVault.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Your Treasure Vault is Empty</h3>
              <p className="text-slate-400 mb-6">
                Start building your collection by generating random treasures or adding custom items
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleGenerateRandomTreasure} className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Dice6 className="w-4 h-4 mr-2" />
                  Generate First Treasure
                </Button>
                <Button
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreasure.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer">
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
                          <span className="text-sm font-semibold text-amber-400">{formatGoldValue(item.value)}</span>
                        </div>
                        {item.attunement && (
                          <Badge variant="outline" className="text-xs border-amber-500 text-amber-400">
                            Requires Attunement
                          </Badge>
                        )}
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">{item.name}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      {item.type} • {item.source}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Badge className={`${getRarityColor(item.rarity)} text-white`}>{item.rarity}</Badge>
                      {item.attunement && (
                        <Badge variant="outline" className="border-amber-500 text-amber-400">
                          Requires Attunement
                        </Badge>
                      )}
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-slate-600 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Separator className="bg-slate-600" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">Description</h4>
                      <p className="text-slate-300 leading-relaxed">{item.fullDescription}</p>
                    </div>
                    {item.properties.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Properties</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {item.properties.map((property, index) => (
                            <li key={index} className="text-slate-300 text-sm">
                              {property}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                      <span className="text-slate-400">Market Value</span>
                      <span className="text-xl font-bold text-amber-400">{formatGoldValue(item.value)}</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
