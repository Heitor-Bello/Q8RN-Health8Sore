import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Calendar, LineChart, ListChecks } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  const { data: assessments, error: assessmentsError } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const assessmentCount = assessments?.length || 0
  const latestAssessment = assessments?.[0]

  return (
    <div className="container py-8 relative">
      {/* Círculos decorativos */}
      <div className="hydra-circle-decoration w-64 h-64 top-20 right-20 opacity-30"></div>
      <div className="hydra-circle-decoration w-96 h-96 bottom-10 left-10 opacity-20"></div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold hydra-text-gradient">Olá, {profile?.full_name || "Usuário"}</h1>
        <p className="text-muted-foreground">Bem-vindo ao seu dashboard de saúde.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{assessmentCount}</div>
              <ListChecks className="h-5 w-5 text-primary/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Último nível de saúde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{latestAssessment?.health_level || "N/A"}</div>
              <BarChart className="h-5 w-5 text-primary/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última pontuação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{latestAssessment?.total_score || "N/A"}/32</div>
              <LineChart className="h-5 w-5 text-primary/70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {latestAssessment?.created_at
                  ? new Date(latestAssessment.created_at).toLocaleDateString("pt-BR")
                  : "N/A"}
              </div>
              <Calendar className="h-5 w-5 text-primary/70" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Iniciar nova avaliação</CardTitle>
            <CardDescription>
              Responda perguntas sobre seus hábitos e descubra seu nível de saúde atual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quiz">
              <Button className="w-full">Iniciar avaliação</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ver histórico completo</CardTitle>
            <CardDescription>Visualize todas as suas avaliações anteriores e acompanhe seu progresso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/history">
              <Button variant="outline" className="w-full border-primary/30 hover:border-primary/50">
                Ver histórico
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
