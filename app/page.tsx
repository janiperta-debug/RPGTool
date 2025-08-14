import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Sword, BookOpen, Users, ScrollText, Shield, Crown } from "lucide-react"
import Link from "next/link"

export default function RPGTool() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">RPGTool</h1>
            <p className="text-sm text-slate-400">Dungeon Master Suite</p>
          </div>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
        >
          <Settings className="w-4 h-4 mr-2" />
          DM Settings
        </Button>
      </header>

      <div className="px-6 pb-8">
        {/* Hero Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Craft Epic Adventures,
              <br />
              Command with Authority
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Welcome to the master's chamber of your gaming realm. Where narrative creativity meets systematic
              precision, and every campaign decision is forged with the utmost storytelling sophistication.
            </p>
          </CardContent>
        </Card>

        {/* Main Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/70 border-slate-700 hover:bg-slate-800/90 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Sword className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Character Forge</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Craft legendary heroes with precision and narrative excellence
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
                <CardTitle className="text-white text-xl">Rules Compendium</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Master the art of gameplay with comprehensive rule management
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
                <CardTitle className="text-white text-xl">Treasure Vault</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Curate your magical items collection with aristocratic precision
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
                <CardTitle className="text-white text-xl">Campaign Chronicles</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Document your epic quests and legendary victories
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
              <h3 className="text-2xl font-bold text-white">Realm Integrations</h3>
            </div>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Connect your gaming realm's applications to create a unified storytelling ecosystem. Share characters
              across your campaigns, synchronize treasure hoards, and integrate quest data throughout your entire
              tabletop domain.
            </p>
            <Button className="bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600">
              <Settings className="w-4 h-4 mr-2" />
              Manage Realm Connections
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
