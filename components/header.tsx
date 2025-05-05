import Link from "next/link"
import { Droplets } from "lucide-react"
import { UserNav } from "@/components/auth/user-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Droplets className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-semibold hydra-text-gradient">VitalScore</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Início
          </Link>
          <Link href="/quiz" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Avaliação
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
        </nav>
        <UserNav />
      </div>
    </header>
  )
}
