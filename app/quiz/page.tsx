"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Apple, Dumbbell, Droplets, Sun, Wine, Wind, Moon, Heart, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { SingleCup, MultipleCups, WaterBottle, MultipleBottles } from "../components/water-icons"

const questions = [
  {
    id: "alimentacao",
    title: "Alimentação",
    icon: <Apple className="h-12 w-12 text-white" />,
    color: "green",
    question: "Com que frequência você consome frutas, verduras e alimentos integrais?",
    options: [
      { value: "1", label: "Raramente ou nunca", points: 1, color: "bg-red-500 hover:bg-red-600" },
      { value: "2", label: "Algumas vezes por semana", points: 2, color: "bg-orange-500 hover:bg-orange-600" },
      { value: "3", label: "Quase todos os dias", points: 3, color: "bg-blue-500 hover:bg-blue-600" },
      { value: "4", label: "Todos os dias, em várias refeições", points: 4, color: "bg-green-500 hover:bg-green-600" },
    ],
    tips: [
      "Inclua pelo menos 3 porções de frutas por dia",
      "Prefira alimentos integrais aos refinados",
      "Reduza o consumo de alimentos ultraprocessados",
    ],
  },
  {
    id: "exercicio",
    title: "Exercício Físico",
    icon: <Dumbbell className="h-12 w-12 text-white" />,
    color: "purple",
    question: "Quantas vezes por semana você pratica atividade física por pelo menos 30 minutos?",
    options: [
      { value: "1", label: "Não pratico exercícios", points: 1, color: "bg-red-500 hover:bg-red-600" },
      { value: "2", label: "1-2 vezes por semana", points: 2, color: "bg-orange-500 hover:bg-orange-600" },
      { value: "3", label: "3-4 vezes por semana", points: 3, color: "bg-blue-500 hover:bg-blue-600" },
      { value: "4", label: "5 ou mais vezes por semana", points: 4, color: "bg-green-500 hover:bg-green-600" },
    ],
    tips: [
      "Comece com caminhadas de 15 minutos e aumente gradualmente",
      "Encontre uma atividade que você goste para manter a consistência",
      "Inclua exercícios de força pelo menos 2 vezes por semana",
    ],
  },
  {
    id: "agua",
    title: "Água",
    icon: <Droplets className="h-12 w-12 text-white" />,
    color: "blue",
    question: "Quantos copos de água você bebe diariamente?",
    options: [
      {
        value: "1",
        label: "Menos de 2 copos",
        points: 1,
        color: "bg-red-500 hover:bg-red-600",
        visual: <SingleCup />,
      },
      {
        value: "2",
        label: "3-4 copos",
        points: 2,
        color: "bg-orange-500 hover:bg-orange-600",
        visual: <MultipleCups />,
      },
      {
        value: "3",
        label: "5-7 copos",
        points: 3,
        color: "bg-blue-500 hover:bg-blue-600",
        visual: <WaterBottle />,
      },
      {
        value: "4",
        label: "8 ou mais copos",
        points: 4,
        color: "bg-green-500 hover:bg-green-600",
        visual: <MultipleBottles />,
      },
    ],
    tips: [
      "Tenha sempre uma garrafa de água com você",
      "Beba um copo de água ao acordar e antes de cada refeição",
      "Use aplicativos para lembrar de beber água regularmente",
    ],
  },
  {
    id: "luz",
    title: "Luz Solar",
    icon: <Sun className="h-12 w-12 text-white" />,
    color: "yellow",
    question: "Com que frequência você se expõe à luz solar direta (10-30 minutos)?",
    options: [
      { value: "1", label: "Raramente ou nunca", points: 1, color: "bg-red-500 hover:bg-red-600" },
      { value: "2", label: "Algumas vezes por mês", points: 2, color: "bg-orange-500 hover:bg-orange-600" },
      { value: "3", label: "Algumas vezes por semana", points: 3, color: "bg-blue-500 hover:bg-blue-600" },
      { value: "4", label: "Quase todos os dias", points: 4, color: "bg-green-500 hover:bg-green-600" },
    ],
    tips: [
      "Exponha-se ao sol da manhã por 15-20 minutos",
      "Use protetor solar após os primeiros 10-15 minutos de exposição",
      "Tente fazer algumas atividades ao ar livre regularmente",
    ],
  },
  {
    id: "temperanca",
    title: "Temperança",
    icon: <Wine className="h-12 w-12 text-white" />,
    color: "orange",
    question: "Como você avalia seu equilíbrio no consumo de alimentos, trabalho e lazer?",
    options: [
      { value: "1", label: "Tenho muitos excessos regularmente", points: 1, color: "bg-red-500 hover:bg-red-600" },
      {
        value: "2",
        label: "Tenho dificuldade em manter equilíbrio",
        points: 2,
        color: "bg-orange-500 hover:bg-orange-600",
      },
      { value: "3", label: "Geralmente mantenho equilíbrio", points: 3, color: "bg-blue-500 hover:bg-blue-600" },
      {
        value: "4",
        label: "Sou bastante equilibrado em meus hábitos",
        points: 4,
        color: "bg-green-500 hover:bg-green-600",
      },
    ],
    tips: [
      "Pratique a moderação em todas as áreas da vida",
      "Evite substâncias prejudiciais como álcool e tabaco",
      "Estabeleça limites claros entre trabalho e descanso",
    ],
  },
  {
    id: "ar",
    title: "Ar Puro",
    icon: <Wind className="h-12 w-12 text-white" />,
    color: "cyan",
    question: "Com que frequência você respira ar puro (ambientes ventilados, natureza)?",
    options: [
      { value: "1", label: "Raramente, fico em ambientes fechados", points: 1, color: "bg-red-500 hover:bg-red-600" },
      { value: "2", label: "Ocasionalmente", points: 2, color: "bg-orange-500 hover:bg-orange-600" },
      { value: "3", label: "Frequentemente", points: 3, color: "bg-blue-500 hover:bg-blue-600" },
      {
        value: "4",
        label: "Diariamente, priorizo ambientes arejados",
        points: 4,
        color: "bg-green-500 hover:bg-green-600",
      },
    ],
    tips: [
      "Ventile sua casa diariamente abrindo janelas",
      "Faça exercícios respiratórios ao ar livre",
      "Mantenha plantas dentro de casa para melhorar a qualidade do ar",
    ],
  },
  {
    id: "descanso",
    title: "Descanso",
    icon: <Moon className="h-12 w-12 text-white" />,
    color: "indigo",
    question: "Como você avalia a qualidade do seu sono e descanso semanal?",
    options: [
      {
        value: "1",
        label: "Ruim, tenho problemas constantes de sono",
        points: 1,
        color: "bg-red-500 hover:bg-red-600",
      },
      { value: "2", label: "Regular, descanso insuficiente", points: 2, color: "bg-orange-500 hover:bg-orange-600" },
      { value: "3", label: "Boa, mas poderia melhorar", points: 3, color: "bg-blue-500 hover:bg-blue-600" },
      {
        value: "4",
        label: "Excelente, durmo bem e tiro um dia para descansar",
        points: 4,
        color: "bg-green-500 hover:bg-green-600",
      },
    ],
    tips: [
      "Estabeleça uma rotina regular de sono",
      "Evite telas pelo menos 1 hora antes de dormir",
      "Reserve um dia por semana para descanso completo",
    ],
  },
  {
    id: "confianca",
    title: "Confiança em Deus",
    icon: <Heart className="h-12 w-12 text-white" />,
    color: "red",
    question: "Com que frequência você dedica tempo para fortalecer sua espiritualidade?",
    options: [
      { value: "1", label: "Raramente ou nunca", points: 1, color: "bg-red-500 hover:bg-red-600" },
      { value: "2", label: "Ocasionalmente", points: 2, color: "bg-orange-500 hover:bg-orange-600" },
      { value: "3", label: "Semanalmente", points: 3, color: "bg-blue-500 hover:bg-blue-600" },
      { value: "4", label: "Diariamente", points: 4, color: "bg-green-500 hover:bg-green-600" },
    ],
    tips: [
      "Reserve um momento diário para meditação ou oração",
      "Pratique a gratidão diariamente",
      "Conecte-se com uma comunidade de fé",
    ],
  },
]

export default function Quiz() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [points, setPoints] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)

  const question = questions[currentQuestion]
  const totalQuestions = questions.length

  useEffect(() => {
    setProgress((currentQuestion / totalQuestions) * 100)
  }, [currentQuestion, totalQuestions])

  const getBackgroundColor = (color: string) => {
    const colorMap: Record<string, string> = {
      green: "bg-green-600",
      purple: "bg-purple-600",
      blue: "bg-blue-600",
      yellow: "bg-yellow-600",
      orange: "bg-orange-600",
      cyan: "bg-cyan-600",
      indigo: "bg-indigo-600",
      red: "bg-red-600",
    }
    return colorMap[color] || "bg-gray-600"
  }

  const handleSelectOption = (option: any) => {
    if (showFeedback) return

    setSelectedOption(option.value)
    setPoints(option.points)

    // Mostrar feedback
    setShowFeedback(true)

    // Se a pontuação for alta (3 ou 4), lançar confete
    if (option.points >= 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Atualizar pontuação total
    setTotalPoints(totalPoints + option.points)

    // Salvar resposta
    setAnswers({
      ...answers,
      [question.id]: option.points,
    })

    // Avançar para próxima pergunta após 1.5 segundos
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
        setShowFeedback(false)
      } else {
        // Salvar respostas no localStorage
        localStorage.setItem(
          "vitalScoreResults",
          JSON.stringify({
            ...answers,
            [question.id]: option.points,
          }),
        )
        router.push("/results")
      }
    }, 1500)
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <div
            className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${getBackgroundColor(question.color)}`}
          >
            {question.icon}
          </div>
          <h2 className="text-3xl font-bold">{question.title}</h2>
          <div className="mt-4">
            <span className="text-lg font-medium text-muted-foreground">
              Pergunta {currentQuestion + 1} de {totalQuestions}
            </span>
            <Progress value={progress} className="mt-2 h-3" />
          </div>
        </div>

        <Card className="mb-8 overflow-hidden bg-white/90 backdrop-blur-sm">
          <CardHeader className={`${getBackgroundColor(question.color)} text-white`}>
            <CardTitle className="text-center text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {question.options.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer overflow-hidden rounded-lg ${option.color} text-white shadow-lg transition-all`}
                  onClick={() => handleSelectOption(option)}
                >
                  <div className="p-6 text-center">
                    {option.visual ? (
                      <div>
                        {option.visual}
                        <p className="mt-2 text-sm font-medium">{option.label}</p>
                      </div>
                    ) : (
                      <p className="text-lg font-medium">{option.label}</p>
                    )}

                    {showFeedback && selectedOption === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                      >
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="h-12 w-12" />
                          <p className="mt-2 text-xl font-bold">+{option.points} pontos</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-4">
            <div className="flex w-full items-center justify-between">
              <div>
                <p className="font-medium">Pontuação Total: {totalPoints}</p>
              </div>
              {showFeedback && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Avançando em breve...</p>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
