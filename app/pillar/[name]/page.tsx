'use client'
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"


import { Slider } from "@/components/ui/slider"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { PILLARS } from "../../components/circle-chart"



export default function PillarDetailPage() {
  function removeAcentos(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c").replace(/Ç/g, "C")
  }

  const params = useParams()

  const rawName = Array.isArray(params?.name) ? params.name[0] : params?.name ?? ""
  const decodedName = decodeURIComponent(rawName)
  const nameSlug = removeAcentos(decodedName)

  console.log("name", nameSlug)
  console.log("pilar", PILLARS.find(p => removeAcentos(p.name.toLowerCase())))

  const pillar = PILLARS.find(p => removeAcentos(p.name.toLowerCase()) === nameSlug)

  const [value, setValue] = useState(5)

  if (!pillar) {
    return <div className="text-center mt-10">Pilar não encontrado</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">{pillar.icon}</div>
          <CardTitle className="text-2xl">{pillar.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Avalie de 0 a 10 como está sua prática em relação ao pilar <strong>{pillar.name}</strong>.
          </p>

          <div className="space-y-2">
            <Slider
              defaultValue={[value]}
              max={10}
              step={1}
              onValueChange={([val]) => setValue(val)}
            />
            <div className="text-sm text-muted-foreground">Valor atual: <strong>{value}</strong></div>
          </div>

          <Button onClick={() => alert(`Valor salvo: ${value}`)}>
            Salvar Avaliação
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
