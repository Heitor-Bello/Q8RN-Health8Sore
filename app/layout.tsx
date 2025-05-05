import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import WaterBackground from "./components/water-background"
import { Header } from "@/components/header"

export const metadata = {
  title: "VitalScore - Avaliação dos 8 Remédios Naturais",
  description: "Avalie seus hábitos baseados nos 8 remédios naturais e descubra seu nível de saúde.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          <WaterBackground>
            <Header />
            <main className="flex min-h-[calc(100vh-4rem)] flex-col">{children}</main>
          </WaterBackground>
        </ThemeProvider>
      </body>
    </html>
  )
}
