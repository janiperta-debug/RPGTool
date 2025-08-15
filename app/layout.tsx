import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Cinzel } from "next/font/google"
import { SystemProvider } from "@/contexts/system-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cinzel",
})

export const metadata: Metadata = {
  title: "RPGTool - Universal RPG Suite",
  description: "Master any RPG system with professional precision",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${cinzel.variable}`}>
      <body className="font-sans antialiased">
        <SystemProvider>{children}</SystemProvider>
      </body>
    </html>
  )
}
