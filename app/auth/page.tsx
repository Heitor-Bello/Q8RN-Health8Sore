import { AuthForm } from "@/components/auth/auth-form"
import { Droplets } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-8 relative">
      {/* Círculos decorativos */}
      <div className="hydra-circle-decoration w-64 h-64 top-20 right-20 opacity-30"></div>
      <div className="hydra-circle-decoration w-96 h-96 bottom-10 left-10 opacity-20"></div>

      <div className="mb-8 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 hydra-glow">
          <Droplets className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-4 text-3xl font-bold hydra-text-gradient">VitalScore</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Avalie seus hábitos baseados nos 8 remédios naturais e descubra seu nível de saúde.
        </p>
      </div>
      <AuthForm />
      <div className="mt-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
