"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Apple,
  Dumbbell,
  Droplets,
  Sun,
  Wine,
  Wind,
  Moon,
  Heart,
  Share2,
  FileDown,
  RefreshCw,
  Trophy,
  Award,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const categories = [
  {
    id: "alimentacao",
    title: "Alimentação",
    icon: <Apple className="h-6 w-6 text-green-600" />,
    color: "green",
    tips: [
      "Inclua pelo menos 3 porções de frutas por dia",
      "Prefira alimentos integrais aos refinados",
      "Reduza o consumo de alimentos ultraprocessados",
    ],
  },
  {
    id: "exercicio",
    title: "Exercício Físico",
    icon: <Dumbbell className="h-6 w-6 text-purple-600" />,
    color: "purple",
    tips: [
      "Comece com caminhadas de 15 minutos e aumente gradualmente",
      "Encontre uma atividade que você goste para manter a consistência",
      "Inclua exercícios de força pelo menos 2 vezes por semana",
    ],
  },
  {
    id: "agua",
    title: "Água",
    icon: <Droplets className="h-6 w-6 text-blue-600" />,
    color: "blue",
    tips: [
      "Tenha sempre uma garrafa de água com você",
      "Beba um copo de água ao acordar e antes de cada refeição",
      "Use aplicativos para lembrar de beber água regularmente",
    ],
  },
  {
    id: "luz",
    title: "Luz Solar",
    icon: <Sun className="h-6 w-6 text-yellow-600" />,
    color: "yellow",
    tips: [
      "Exponha-se ao sol da manhã por 15-20 minutos",
      "Use protetor solar após os primeiros 10-15 minutos de exposição",
      "Tente fazer algumas atividades ao ar livre regularmente",
    ],
  },
  {
    id: "temperanca",
    title: "Temperança",
    icon: <Wine className="h-6 w-6 text-orange-600" />,
    color: "orange",
    tips: [
      "Pratique a moderação em todas as áreas da vida",
      "Evite substâncias prejudiciais como álcool e tabaco",
      "Estabeleça limites claros entre trabalho e descanso",
    ],
  },
  {
    id: "ar",
    title: "Ar Puro",
    icon: <Wind className="h-6 w-6 text-cyan-600" />,
    color: "cyan",
    tips: [
      "Ventile sua casa diariamente abrindo janelas",
      "Faça exercícios respiratórios ao ar livre",
      "Mantenha plantas dentro de casa para melhorar a qualidade do ar",
    ],
  },
  {
    id: "descanso",
    title: "Descanso",
    icon: <Moon className="h-6 w-6 text-indigo-600" />,
    color: "indigo",
    tips: [
      "Estabeleça uma rotina regular de sono",
      "Evite telas pelo menos 1 hora antes de dormir",
      "Reserve um dia por semana para descanso completo",
    ],
  },
  {
    id: "confianca",
    title: "Confiança em Deus",
    icon: <Heart className="h-6 w-6 text-red-600" />,
    color: "red",
    tips: [
      "Reserve um momento diário para meditação ou oração",
      "Pratique a gratidão diariamente",
      "Conecte-se com uma comunidade de fé",
    ],
  },
]

const healthLevels = [
  {
    min: 0,
    max: 10,
    name: "Iniciante",
    description: "Você está começando sua jornada de saúde",
    icon: <Trophy className="h-8 w-8 text-gray-500" />,
  },
  {
    min: 11,
    max: 20,
    name: "Aprendiz",
    description: "Você já tem alguns bons hábitos",
    icon: <Trophy className="h-8 w-8 text-bronze-500" />,
  },
  {
    min: 21,
    max: 26,
    name: "Em Progresso",
    description: "Você está no caminho certo",
    icon: <Award className="h-8 w-8 text-silver-500" />,
  },
  {
    min: 27,
    max: 32,
    name: "Saudável",
    description: "Parabéns! Você tem ótimos hábitos",
    icon: <Award className="h-8 w-8 text-gold-500" />,
  },
]

export default function Results() {
  const [results, setResults] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [healthLevel, setHealthLevel] = useState<(typeof healthLevels)[0] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const storedResults = localStorage.getItem("vitalScoreResults")
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)
      setResults(parsedResults)

      const total = Object.values(parsedResults).reduce((sum: number, score: number) => sum + score, 0)
      setTotalScore(total)

      const level = healthLevels.find((level) => total >= level.min && total <= level.max)
      if (level) {
        setHealthLevel(level)
      }
    }
  }, [])

  useEffect(() => {
    // Verificar se o usuário está autenticado e salvar os resultados
    const saveResults = async () => {
      if (Object.keys(results).length === 0 || saved) return

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session && healthLevel) {
        setSaving(true)
        try {
          // 1. Salvar a avaliação principal
          const { data: assessment, error: assessmentError } = await supabase
            .from("assessments")
            .insert({
              user_id: session.user.id,
              total_score: totalScore,
              health_level: healthLevel.name,
            })
            .select()
            .single()

          if (assessmentError) throw assessmentError

          // 2. Salvar os detalhes da avaliação
          const detailsToInsert = categories.map((category) => ({
            assessment_id: assessment.id,
            remedy_id: category.id,
            remedy_name: category.title,
            score: results[category.id] || 0,
          }))

          const { error: detailsError } = await supabase.from("assessment_details").insert(detailsToInsert)

          if (detailsError) throw detailsError

          setSaved(true)
          toast({
            title: "Avaliação salva",
            description: "Seus resultados foram salvos com sucesso.",
          })
        } catch (error) {
          console.error("Erro ao salvar resultados:", error)
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar seus resultados. Tente novamente mais tarde.",
            variant: "destructive",
          })
        } finally {
          setSaving(false)
        }
      }
    }

    saveResults()
  }, [results, healthLevel, totalScore, supabase, toast, saved])

  const getScoreColor = (score: number) => {
    if (score <= 1) return "bg-red-500"
    if (score === 2) return "bg-orange-500"
    if (score === 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Meus resultados do VitalScore",
        text: `Minha pontuação no VitalScore é ${totalScore}/32. Nível: ${healthLevel?.name}`,
        url: window.location.href,
      })
    } else {
      toast({
        title: "Compartilhamento não suportado",
        description: "Seu navegador não suporta a função de compartilhamento.",
      })
    }
  }

  const handleDownloadPDF = () => {
    toast({
      title: "Download iniciado",
      description: "Seu relatório está sendo gerado em PDF.",
    })
    // Aqui seria implementada a lógica real de geração de PDF
  }

  const handleViewDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-3xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            {healthLevel?.icon || <Trophy className="h-10 w-10 text-green-600" />}
          </div>
          <CardTitle className="text-3xl font-bold">Seu Resultado</CardTitle>
          <CardDescription className="text-xl">
            Nível: <span className="font-semibold text-green-600">{healthLevel?.name}</span>
          </CardDescription>
          <div className="mt-4 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl font-bold">{totalScore}</span>
              <span className="text-muted-foreground">/ 32 pontos</span>
            </div>
            <Progress value={(totalScore / 32) * 100} className="h-3" />
            <p className="mt-2 text-sm text-muted-foreground">{healthLevel?.description}</p>
          </div>
          {saving && (
            <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando resultados...
            </div>
          )}
          {saved && <div className="mt-2 text-sm text-green-600">Resultados salvos no seu perfil</div>}
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="scores">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scores">Pontuações</TabsTrigger>
              <TabsTrigger value="tips">Dicas Personalizadas</TabsTrigger>
            </TabsList>
            <TabsContent value="scores" className="space-y-4 pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category) => {
                  const score = results[category.id] || 0
                  return (
                    <div key={category.id} className="rounded-lg border p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <div className={`rounded-full p-1.5 text-${category.color}-600 bg-${category.color}-100`}>
                          {category.icon}
                        </div>
                        <h3 className="font-medium">{category.title}</h3>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full ${getScoreColor(score)}`}
                              style={{ width: `${(score / 4) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-semibold">{score}/4</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
            <TabsContent value="tips" className="space-y-4 pt-4">
              <div className="space-y-4">
                {categories.map((category) => {
                  const score = results[category.id] || 0
                  // Só mostrar dicas para pontuações abaixo de 3
                  if (score >= 3) return null

                  return (
                    <div key={category.id} className="rounded-lg border p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <div className={`rounded-full p-1.5 text-${category.color}-600 bg-${category.color}-100`}>
                          {category.icon}
                        </div>
                        <h3 className="font-medium">{category.title}</h3>
                      </div>
                      <ul className="ml-6 mt-2 list-disc space-y-1 text-sm">
                        {category.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
                {Object.values(results).every((score) => score >= 3) && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                    <p className="text-green-700">
                      Parabéns! Você está indo muito bem em todas as áreas. Continue mantendo esses bons hábitos!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-3">
          <Link href="/quiz" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Refazer Teste
            </Button>
          </Link>
          <Button onClick={handleShare} className="w-full gap-2 sm:w-auto">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" className="w-full gap-2 sm:w-auto">
            <FileDown className="h-4 w-4" />
            Salvar PDF
          </Button>
          <Button onClick={handleViewDashboard} className="w-full gap-2 sm:w-auto">
            Ver Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
