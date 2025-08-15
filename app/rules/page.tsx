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
import Link from "next/link"
import {
  searchRules,
  getRecentRules,
  getRuleCategories,
  updateRuleAccess,
  createCustomRule,
  type Rule,
} from "@/lib/rules-data"
import { getRPGSystem } from "@/lib/rpg-systems"
import { SystemSelector } from "@/components/system-selector"
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Search,
  Filter,
  Shield,
  Sword,
  Zap,
  Users,
  Settings,
  Cog,
  User,
  Crown,
} from "lucide-react"

const iconMap = {
  Sword: Sword,
  Shield: Shield,
  Zap: Zap,
  Users: Users,
  Cog: Cog,
  User: User,
  Crown: Crown,
  Settings: Settings,
}

export default function RulesPage() {
  const [selectedSystem, setSelectedSystem] = useState<string>("dnd5e")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null)
  const [showSystemSelector, setShowSystemSelector] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newRule, setNewRule] = useState({
    title: "",
    category: "Core Mechanics",
    description: "",
    fullText: "",
    tags: "",
    source: "Custom",
    page: "",
  })

  const filteredRules = useMemo(() => {
    return searchRules(searchQuery, selectedCategory === "all" ? undefined : selectedCategory, selectedSystem)
  }, [searchQuery, selectedCategory, selectedSystem])

  const recentRules = useMemo(() => getRecentRules(4, selectedSystem), [selectedSystem])
  const ruleCategories = useMemo(() => getRuleCategories(selectedSystem), [selectedSystem])

  const handleRuleClick = (rule: Rule) => {
    updateRuleAccess(rule.id)
    setSelectedRule(rule)
  }

  const handleCreateRule = () => {
    if (!newRule.title.trim() || !newRule.description.trim() || !newRule.fullText.trim()) {
      alert("Please fill in all required fields")
      return
    }

    const tags = newRule.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    createCustomRule(
      newRule.title,
      newRule.category,
      newRule.description,
      newRule.fullText,
      selectedSystem,
      tags,
      newRule.source,
      newRule.page || undefined,
    )

    setNewRule({
      title: "",
      category: "Core Mechanics",
      description: "",
      fullText: "",
      tags: "",
      source: "Custom",
      page: "",
    })
    setShowCreateDialog(false)
  }

  const currentSystem = getRPGSystem(selectedSystem)

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
              <p className="text-sm text-slate-400">Universal Rules Management</p>
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
            {currentSystem?.name || "Select System"}
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Create Custom Rule</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Add a custom rule for {currentSystem?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Rule Title</label>
                    <Input
                      placeholder="Enter rule title..."
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newRule.title}
                      onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
                    <Select
                      value={newRule.category}
                      onValueChange={(value) => setNewRule({ ...newRule, category: value })}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {ruleCategories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                  <Input
                    placeholder="Brief description of the rule..."
                    className="bg-slate-700/50 border-slate-600 text-white"
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Full Rule Text</label>
                  <Textarea
                    placeholder="Complete rule description and mechanics..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
                    value={newRule.fullText}
                    onChange={(e) => setNewRule({ ...newRule, fullText: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Tags (comma-separated)</label>
                    <Input
                      placeholder="combat, action, spell..."
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newRule.tags}
                      onChange={(e) => setNewRule({ ...newRule, tags: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Page Reference</label>
                    <Input
                      placeholder="Page number (optional)"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      value={newRule.page}
                      onChange={(e) => setNewRule({ ...newRule, page: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateRule}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={!newRule.title.trim() || !newRule.description.trim() || !newRule.fullText.trim()}
                >
                  Create Rule
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
            <DialogDescription className="text-slate-400">Choose the RPG system for rules management</DialogDescription>
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
                  placeholder="Search rules, mechanics, abilities..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-slate-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {ruleCategories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rule Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {ruleCategories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Cog
            return (
              <Card
                key={category.name}
                className={`bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer ${
                  selectedCategory === category.name ? "ring-2 ring-amber-600" : ""
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? "all" : category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{category.name}</h4>
                  <p className="text-xs text-slate-400">{category.count} rules</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search Results or Recent Rules */}
        {searchQuery || selectedCategory !== "all" ? (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">Search Results ({filteredRules.length})</CardTitle>
              <CardDescription className="text-slate-400">
                {searchQuery && `Results for "${searchQuery}"`}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
                {` for ${currentSystem?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRules.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No Rules Found</h3>
                  <p className="text-slate-400 mb-4">
                    {searchQuery ? `No rules match "${searchQuery}"` : `No rules in ${selectedCategory} category`}
                  </p>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Rule
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRules.map((rule) => (
                    <Dialog key={rule.id}>
                      <DialogTrigger asChild>
                        <div
                          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-700/50 transition-colors"
                          onClick={() => handleRuleClick(rule)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-white font-semibold">{rule.title}</h4>
                              <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                                {rule.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mb-1">{rule.description}</p>
                            <div className="flex gap-2 mb-2">
                              {rule.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs bg-slate-600 text-slate-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-slate-500">
                              {rule.source}
                              {rule.page && `, Page ${rule.page}`}
                            </p>
                          </div>
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                            View Rule
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white text-xl">{rule.title}</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            {rule.source}
                            {rule.page && `, Page ${rule.page}`}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Badge variant="outline" className="border-slate-500 text-slate-300">
                              {rule.category}
                            </Badge>
                            {rule.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-slate-600 text-slate-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-slate-300 leading-relaxed">{rule.fullText}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">Recently Accessed Rules</CardTitle>
              <CardDescription className="text-slate-400">
                Quick access to your most referenced {currentSystem?.name} mechanics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentRules.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No Rules Yet</h3>
                  <p className="text-slate-400 mb-4">Start building your {currentSystem?.name} rules compendium</p>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Rule
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRules.map((rule) => (
                    <Dialog key={rule.id}>
                      <DialogTrigger asChild>
                        <div
                          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-700/50 transition-colors"
                          onClick={() => handleRuleClick(rule)}
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
                              {rule.source}
                              {rule.page && `, Page ${rule.page}`}
                            </p>
                          </div>
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                            View Rule
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white text-xl">{rule.title}</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            {rule.source}
                            {rule.page && `, Page ${rule.page}`}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Badge variant="outline" className="border-slate-500 text-slate-300">
                              {rule.category}
                            </Badge>
                            {rule.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-slate-600 text-slate-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-slate-300 leading-relaxed">{rule.fullText}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
