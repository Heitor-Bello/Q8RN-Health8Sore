'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Droplets } from "lucide-react"
import CircleChart from "./components/circle-chart"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


export default function Home() {

  const [pillarValues, setPillarValues] = useState<number[] | null>(null)

  const router = useRouter()
  const handleSliceClick = (pillarName: string) => {
    router.push(`/pillar/${pillarName}`)
  }

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)


  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-8 relative">
      {/* Círculos decorativos */}
      <div className="hydra-circle-decoration w-64 h-64 top-20 right-20 opacity-30"></div>
      <div className="hydra-circle-decoration w-96 h-96 bottom-10 left-10 opacity-20"></div>

      {pillarValues ? (
        <CircleChart pillarValues={pillarValues} onSliceClick={handleSliceClick} />
      ) : (
        <p className="invisible ">Carregando gráfico...</p>
      )}

      <Card className="w-full max-w-4xl text-center relative overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 hydra-glow">
            <Droplets className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold hydra-text-gradient">VitalScore</CardTitle>
          <CardDescription className="text-xl">
            Mergulhe nas Profundezas da Saúde Natural
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Avalie seus hábitos baseados nos 8 remédios naturais e descubra seu nível de saúde com uma experiência
            imersiva e interativa.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Alimentação",
              "Água",
              "Luz Solar",
              "Exercício",
              "Temperança",
              "Ar Puro",
              "Descanso",
              "Confiança",
            ].map((p, i) => (
              <div
                key={i}
                className={`flex items-center rounded-full px-3 py-1 text-sm ${i % 2 === 0 ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}
              >
                <span>{p}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Link href="/quiz" className="w-full max-w-md">
            <Button className="w-full text-lg py-6 hydra-glow">Iniciar Avaliação</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
