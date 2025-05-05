import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function HistoryPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  const { data: assessments, error } = await supabase
    .from("assessments")
    .select(`
      id,
      total_score,
      health_level,
      created_at,
      assessment_details (
        id,
        remedy_id,
        remedy_name,
        score
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar avaliações:", error)
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Histórico de Avaliações</h1>
        <p className="text-muted-foreground">Veja todas as suas avaliações anteriores.</p>
      </div>

      {!assessments || assessments.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <p className="mb-4">Você ainda não realizou nenhuma avaliação.</p>
            <Link href="/quiz">
              <Button>Fazer primeira avaliação</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Nível: {assessment.health_level}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(assessment.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-lg font-semibold">Pontuação total: {assessment.total_score}/32</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                  {assessment.assessment_details.map((detail) => (
                    <div key={detail.id} className="rounded-md border p-2 text-center">
                      <p className="text-sm font-medium">{detail.remedy_name}</p>
                      <p className="text-lg font-bold">{detail.score}/4</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
