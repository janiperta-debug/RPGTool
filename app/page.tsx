"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Sword, BookOpen, Users, ScrollText, Shield, Crown } from "lucide-react"
import Link from "next/link"
import { DataManagement } from "@/components/data-management"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SystemSelector } from "@/components/system-selector"
import { useSystem } from "@/contexts/system-context"

export default function RPGTool() {
  const { selectedSystem, setSelectedSystem, currentSystemData } = useSystem()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">RPGTool</h1>
            <p className="text-sm text-slate-400">Universal RPG Suite</p>
          </div>
        </Link>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Data Management
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Data Management</DialogTitle>
              </DialogHeader>
              <DataManagement />
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            <Settings className="w-4 h-4 mr-2" />
            DM Settings
          </Button>
        </div>
      </header>

      <div className="px-6 pb-8">
        {/* Hero Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4 font-serif">
              Master Any RPG System,
              <br />
              Command with Authority
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-6">
              Welcome to the ultimate universal RPG management suite. Create characters, manage rules, generate
              treasures, and track campaigns with professional precision across multiple tabletop RPG systems.
            </p>
            <div className="flex justify-center">
              <SystemSelector
                selectedSystem={selectedSystem}
                onSystemSelect={setSelectedSystem}
                showDescription={false}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 font-serif text-center">
            {currentSystemData.name} Management Tools
          </h3>
          <p className="text-slate-400 text-center">
            Currently managing {currentSystemData.name} - switch systems above to access different RPG tools
          </p>
        </div>

        {/* Main Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Sword className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-serif">
                  {currentSystemData.id === "coc"
                    ? "Investigator Files"
                    : currentSystemData.id === "vtm"
                      ? "Kindred Registry"
                      : currentSystemData.id === "cyberpunk"
                        ? "Netrunner Profiles"
                        : "Character Forge"}
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Create{" "}
                {currentSystemData.id === "coc"
                  ? "investigators"
                  : currentSystemData.id === "vtm"
                    ? "vampires"
                    : currentSystemData.id === "cyberpunk"
                      ? "netrunners"
                      : "characters"}{" "}
                with {currentSystemData.name}-specific attributes and mechanics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/characters">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">Enter Forge</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-serif">
                  {currentSystemData.id === "coc"
                    ? "Mythos Compendium"
                    : currentSystemData.id === "vtm"
                      ? "Masquerade Codex"
                      : currentSystemData.id === "cyberpunk"
                        ? "Net Architecture"
                        : "Rules Compendium"}
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Manage {currentSystemData.name} rules with advanced search and organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/rules">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">Enter Realm</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-serif">
                  {currentSystemData.id === "coc"
                    ? "Artifact Vault"
                    : currentSystemData.id === "vtm"
                      ? "Haven Resources"
                      : currentSystemData.id === "cyberpunk"
                        ? "Tech Cache"
                        : "Treasure Vault"}
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Generate and manage{" "}
                {currentSystemData.id === "coc"
                  ? "artifacts and equipment"
                  : currentSystemData.id === "vtm"
                    ? "resources and items"
                    : currentSystemData.id === "cyberpunk"
                      ? "cyberware and gear"
                      : "items and treasures"}{" "}
                for {currentSystemData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/treasure">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">Enter Vault</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-serif">
                  {currentSystemData.id === "coc"
                    ? "Investigation Files"
                    : currentSystemData.id === "vtm"
                      ? "Chronicle Records"
                      : currentSystemData.id === "cyberpunk"
                        ? "Run Archives"
                        : "Campaign Chronicles"}
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Track{" "}
                {currentSystemData.id === "coc"
                  ? "investigations"
                  : currentSystemData.id === "vtm"
                    ? "chronicles"
                    : currentSystemData.id === "cyberpunk"
                      ? "runs"
                      : "campaigns"}
                , sessions, and player progress in {currentSystemData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/campaigns">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                  Enter Chronicles
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Integration Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif">{currentSystemData.name} Integration</h3>
            </div>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Seamlessly manage your {currentSystemData.name}{" "}
              {currentSystemData.id === "coc"
                ? "investigations"
                : currentSystemData.id === "vtm"
                  ? "chronicles"
                  : currentSystemData.id === "cyberpunk"
                    ? "campaigns"
                    : "campaigns"}{" "}
              in one unified platform. Switch between different RPG systems while maintaining separate data for each
              game.
            </p>
            <Button className="bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600">
              <Settings className="w-4 h-4 mr-2" />
              Manage System Settings
            </Button>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/characters">
            <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sword className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-1">Elite Heroes</h4>
                <p className="text-xs text-slate-400">12</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/rules">
            <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-1">Rule Entries</h4>
                <p className="text-xs text-slate-400">847</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/treasure">
            <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-1">Curated Items</h4>
                <p className="text-xs text-slate-400">156</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/campaigns">
            <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ScrollText className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-1">Epic Chronicles</h4>
                <p className="text-xs text-slate-400">23</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
