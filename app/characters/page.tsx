"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  type UniversalCharacter,
  createCharacter,
  getAttributeModifier,
  validateCharacter,
} from "@/lib/character-utils"
import { SystemSelector } from "@/components/system-selector"
import { useSystem } from "@/contexts/system-context"
import { ArrowLeft, Plus, Sword, Heart, Zap, Eye, Users, Search, Filter, Settings } from "lucide-react"

export default function CharactersPage() {
  const [characters, setCharacters] = useState<UniversalCharacter[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSystemSelector, setShowSystemSelector] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<UniversalCharacter | null>(null)
  const [newCharacter, setNewCharacter] = useState<Partial<UniversalCharacter>>({
    name: "",
    systemId: "dnd5e",
    attributes: {},
    health: {},
    skills: {},
    equipment: [],
    systemData: {},
    notes: "",
  })

  const { selectedSystem, setSelectedSystem, currentSystemData } = useSystem()

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      const matchesSystem = character.systemId === selectedSystem
      const matchesSearch =
        !searchQuery ||
        character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (character.class && character.class.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (character.race && character.race.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesClass = selectedClass === "all" || character.class === selectedClass

      return matchesSystem && matchesSearch && matchesClass
    })
  }, [characters, selectedSystem, searchQuery, selectedClass])

  const characterStats = useMemo(() => {
    const systemCharacters = characters.filter((c) => c.systemId === selectedSystem)
    const total = systemCharacters.length

    // Calculate health status based on primary health track
    const healthy = systemCharacters.filter((c) => {
      const primaryHealth = Object.values(c.health)[0]
      return primaryHealth && primaryHealth.current === primaryHealth.max
    }).length

    const injured = systemCharacters.filter((c) => {
      const primaryHealth = Object.values(c.health)[0]
      return primaryHealth && primaryHealth.current > 0 && primaryHealth.current < primaryHealth.max
    }).length

    const unconscious = systemCharacters.filter((c) => {
      const primaryHealth = Object.values(c.health)[0]
      return primaryHealth && primaryHealth.current <= 0
    }).length

    return { total, healthy, injured, unconscious }
  }, [characters, selectedSystem])

  const handleCreateCharacter = () => {
    const errors = validateCharacter(newCharacter)
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"))
      return
    }

    const character = createCharacter(selectedSystem, newCharacter.name || "Unnamed Character")

    // Apply any custom attributes or data
    if (newCharacter.attributes) {
      Object.assign(character.attributes, newCharacter.attributes)
    }
    if (newCharacter.race) character.race = newCharacter.race
    if (newCharacter.class) character.class = newCharacter.class
    if (newCharacter.level) character.level = newCharacter.level
    if (newCharacter.background) character.background = newCharacter.background
    if (newCharacter.notes) character.notes = newCharacter.notes

    setCharacters([...characters, character])
    setNewCharacter({
      name: "",
      systemId: selectedSystem,
      attributes: {},
      health: {},
      skills: {},
      equipment: [],
      systemData: {},
      notes: "",
    })
    setShowCreateDialog(false)
  }

  const getStatusColor = (character: UniversalCharacter) => {
    const primaryHealth = Object.values(character.health)[0]
    if (!primaryHealth) return "bg-gray-600"

    if (primaryHealth.current <= 0) return "bg-red-600"
    if (primaryHealth.current < primaryHealth.max) return "bg-yellow-600"
    return "bg-green-600"
  }

  const getStatusText = (character: UniversalCharacter) => {
    const primaryHealth = Object.values(character.health)[0]
    if (!primaryHealth) return "Unknown"

    if (primaryHealth.current <= 0) return "Unconscious"
    if (primaryHealth.current < primaryHealth.max) return "Injured"
    return "Healthy"
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
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentSystemData.id === "coc"
                  ? "Investigator Files"
                  : currentSystemData.id === "vtm"
                    ? "Kindred Registry"
                    : currentSystemData.id === "cyberpunk"
                      ? "Netrunner Profiles"
                      : "Character Forge"}
              </h1>
              <p className="text-sm text-slate-400">{currentSystemData.name} Character Management</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSystemSelector(true)}
            className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            <Settings className="w-4 h-4 mr-2" />
            {currentSystemData?.name || "Select System"}
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create{" "}
                {currentSystemData.id === "coc"
                  ? "Investigator"
                  : currentSystemData.id === "vtm"
                    ? "Kindred"
                    : currentSystemData.id === "cyberpunk"
                      ? "Netrunner"
                      : "Character"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Create New{" "}
                  {currentSystemData.id === "coc"
                    ? "Investigator"
                    : currentSystemData.id === "vtm"
                      ? "Kindred"
                      : currentSystemData.id === "cyberpunk"
                        ? "Netrunner"
                        : "Character"}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Create a{" "}
                  {currentSystemData.id === "coc"
                    ? "investigator"
                    : currentSystemData.id === "vtm"
                      ? "vampire"
                      : currentSystemData.id === "cyberpunk"
                        ? "netrunner"
                        : "character"}{" "}
                  for {currentSystemData?.name}
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                  <TabsTrigger value="basic" className="text-slate-300">
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="attributes" className="text-slate-300">
                    Attributes
                  </TabsTrigger>
                  <TabsTrigger value="details" className="text-slate-300">
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Character Name</label>
                      <Input
                        placeholder="Enter character name..."
                        className="bg-slate-700/50 border-slate-600 text-white"
                        value={newCharacter.name || ""}
                        onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                      />
                    </div>
                    {currentSystemData?.advancement.type === "levels" && (
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Level</label>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          className="bg-slate-700/50 border-slate-600 text-white"
                          value={newCharacter.level || 1}
                          onChange={(e) =>
                            setNewCharacter({ ...newCharacter, level: Number.parseInt(e.target.value) || 1 })
                          }
                        />
                      </div>
                    )}
                  </div>
                  {/* System-specific fields would go here */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Race/Origin</label>
                      <Input
                        placeholder="Character race or origin..."
                        className="bg-slate-700/50 border-slate-600 text-white"
                        value={newCharacter.race || ""}
                        onChange={(e) => setNewCharacter({ ...newCharacter, race: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Class/Profession</label>
                      <Input
                        placeholder="Character class or profession..."
                        className="bg-slate-700/50 border-slate-600 text-white"
                        value={newCharacter.class || ""}
                        onChange={(e) => setNewCharacter({ ...newCharacter, class: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attributes" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {currentSystemData?.attributes.attributes.map((attr) => (
                      <div key={attr.id}>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          {attr.name}
                          {newCharacter.attributes?.[attr.id] && (
                            <span className="ml-2 text-slate-400">
                              (
                              {getAttributeModifier(selectedSystem, attr.id, newCharacter.attributes[attr.id]) >= 0
                                ? "+"
                                : ""}
                              {getAttributeModifier(selectedSystem, attr.id, newCharacter.attributes[attr.id])})
                            </span>
                          )}
                        </label>
                        <Input
                          type="number"
                          min={attr.min}
                          max={attr.max}
                          className="bg-slate-700/50 border-slate-600 text-white"
                          value={newCharacter.attributes?.[attr.id] || attr.default || 10}
                          onChange={(e) =>
                            setNewCharacter({
                              ...newCharacter,
                              attributes: {
                                ...newCharacter.attributes,
                                [attr.id]: Number.parseInt(e.target.value) || (attr.default as number) || 10,
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Character Notes</label>
                    <Textarea
                      placeholder="Character background, personality, goals..."
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newCharacter.notes || ""}
                      onChange={(e) => setNewCharacter({ ...newCharacter, notes: e.target.value })}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateCharacter}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={!newCharacter.name?.trim()}
                >
                  Create Character
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Dialog open={showSystemSelector} onOpenChange={setShowSystemSelector}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Select RPG System</DialogTitle>
            <DialogDescription className="text-slate-400">
              Choose the RPG system for character management
            </DialogDescription>
          </DialogHeader>
          <SystemSelector
            selectedSystem={selectedSystem}
            onSystemSelect={(systemId) => {
              setSelectedSystem(systemId)
              setShowSystemSelector(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="px-6 pb-8">
        {/* Search and Filter */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search characters by name, class, or race..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-slate-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Classes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Total Characters</h4>
              <p className="text-2xl font-bold text-amber-400">{characterStats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Healthy</h4>
              <p className="text-2xl font-bold text-green-400">{characterStats.healthy}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Injured</h4>
              <p className="text-2xl font-bold text-yellow-400">{characterStats.injured}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">Unconscious</h4>
              <p className="text-2xl font-bold text-red-400">{characterStats.unconscious}</p>
            </CardContent>
          </Card>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No{" "}
                {currentSystemData.id === "coc"
                  ? "Investigators"
                  : currentSystemData.id === "vtm"
                    ? "Kindred"
                    : currentSystemData.id === "cyberpunk"
                      ? "Netrunners"
                      : "Characters"}{" "}
                Found
              </h3>
              <p className="text-slate-400 mb-6">
                {characters.filter((c) => c.systemId === selectedSystem).length === 0
                  ? `Start by creating your first ${currentSystemData?.name} ${
                      currentSystemData.id === "coc"
                        ? "investigator"
                        : currentSystemData.id === "vtm"
                          ? "kindred"
                          : currentSystemData.id === "cyberpunk"
                            ? "netrunner"
                            : "character"
                    }!`
                  : "Try adjusting your search or filter criteria."}
              </p>
              {characters.filter((c) => c.systemId === selectedSystem).length === 0 && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First{" "}
                  {currentSystemData.id === "coc"
                    ? "Investigator"
                    : currentSystemData.id === "vtm"
                      ? "Kindred"
                      : currentSystemData.id === "cyberpunk"
                        ? "Netrunner"
                        : "Character"}
                </Button>
              )}
            </div>
          ) : (
            filteredCharacters.map((character) => {
              const primaryHealth = Object.values(character.health)[0]
              return (
                <Card
                  key={character.id}
                  className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{character.name}</CardTitle>
                        <CardDescription className="text-slate-400">
                          {character.level && `Level ${character.level} `}
                          {character.race && `${character.race} `}
                          {character.class}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(character)} text-white`}>{getStatusText(character)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {primaryHealth && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-slate-300">Health</span>
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {primaryHealth.current}/{primaryHealth.max}
                          </span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-600">
                        <p className="text-xs text-slate-400">System: {currentSystemData?.name}</p>
                      </div>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm">
                        View Character Sheet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
