"use client"

import { Droplets, Sun, Leaf, Activity, Divide, Wind, Moon, Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const PILLARS = [
    { name: "Alimentação", icon: <Leaf size={20} />, color: "#A3D977" },
    { name: "Água", icon: <Droplets size={20} />, color: "#4FC3F7" },
    { name: "Luz Solar", icon: <Sun size={20} />, color: "#FFD54F" },
    { name: "Exercício", icon: <Activity size={20} />, color: "#FFB74D" },
    { name: "Temperança", icon: <Divide size={20} />, color: "#CE93D8" },
    { name: "Ar Puro", icon: <Wind size={20} />, color: "#90CAF9" },
    { name: "Descanso", icon: <Moon size={20} />, color: "#7986CB" },
    { name: "Confiança", icon: <Shield size={20} />, color: "#AB47BC" },
]

interface CircleChartProps {
    pillarValues: number[]
    onSliceClick?: (pillarName: string) => void
    average?: number
}

export default function CircleChart({ pillarValues, average = 0, onSliceClick }: CircleChartProps) {
    const radius = 140
    const center = 160
    const innerRadius = 60 // Raio do círculo interno
    const outerRadius = radius // Raio do círculo externo

    const getStatusMessage = (value: number) => {
        if (value < 5) return { text: "Abaixo do esperado", color: "#FB8C00" }
        if (value < 8) return { text: "Bom", color: "#FDD835" }
        return { text: "Muito bom", color: "#43A047" }
    }

    const createSlice = (index: number) => {
        const total = PILLARS.length
        const angle = (2 * Math.PI) / total
        const gap = 0.01 // ângulo de separação entre fatias
        const startAngle = index * angle - Math.PI / 2 + gap / 2
        const endAngle = (index + 1) * angle - Math.PI / 2 - gap / 2

        // Calcular o raio baseado no valor (0-10)
        // Para valor 0, o raio será innerRadius (sem preenchimento)
        // Para valor 10, o raio será outerRadius (preenchimento completo)
        const valueRatio = Math.max(0, Math.min(pillarValues[index] / 10, 1))
        const sliceRadius = innerRadius + (outerRadius - innerRadius) * valueRatio

        // Pontos para o arco externo
        const x1 = center + sliceRadius * Math.cos(startAngle)
        const y1 = center + sliceRadius * Math.sin(startAngle)
        const x2 = center + sliceRadius * Math.cos(endAngle)
        const y2 = center + sliceRadius * Math.sin(endAngle)

        // Pontos para o arco interno
        const x3 = center + innerRadius * Math.cos(endAngle)
        const y3 = center + innerRadius * Math.sin(endAngle)
        const x4 = center + innerRadius * Math.cos(startAngle)
        const y4 = center + innerRadius * Math.sin(startAngle)

        const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

        // Construir o caminho SVG
        const pathData = `
          M ${x1} ${y1}
          A ${sliceRadius} ${sliceRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          L ${x3} ${y3}
          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
          Z
        `

        const status = getStatusMessage(pillarValues[index])

        // Linha separadora entre as fatias
        const separatorOuterX = center + outerRadius * Math.cos(startAngle - gap / 2)
        const separatorOuterY = center + outerRadius * Math.sin(startAngle - gap / 2)
        const separatorInnerX = center + innerRadius * Math.cos(startAngle - gap / 2)
        const separatorInnerY = center + innerRadius * Math.sin(startAngle - gap / 2)

        return (
            <g key={index}>
                <defs>
                    <filter id={`shadow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
                    </filter>
                </defs>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {pathData && PILLARS[index] && (
                            <path
                                d={pathData}
                                fill={PILLARS[index].color}
                                filter={`url(#shadow-${index})`}
                                onClick={() => {
                                    if (onSliceClick) onSliceClick(PILLARS[index].name.toLowerCase())
                                }}
                                className="cursor-pointer transition-opacity hover:opacity-80 opacity-80"
                            />
                        )}
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <div className="text-sm font-medium">
                            <span>{PILLARS[index].name}</span>
                            <div style={{ color: status.color }}>{status.text}</div>
                            <div className="text-xs text-gray-500">Valor: {pillarValues[index]}/10</div>
                        </div>
                    </TooltipContent>
                </Tooltip>
                <line
                    x1={separatorInnerX}
                    y1={separatorInnerY}
                    x2={separatorOuterX}
                    y2={separatorOuterY}
                    stroke="white"
                    strokeWidth={2}
                />
            </g>
        )
    }

    const renderIcons = () => {
        const total = PILLARS.length
        const angle = (2 * Math.PI) / total

        return PILLARS.map((pillar, index) => {
            const rotation = angle * index - Math.PI / 2 + angle / 2
            const iconRadius = (innerRadius + outerRadius) / 2
            const x = center + iconRadius * Math.cos(rotation)
            const y = center + iconRadius * Math.sin(rotation)
            return (
                <foreignObject key={index} x={x - 10} y={y - 10} width={20} height={20} style={{ pointerEvents: "none" }}>
                    <div className="flex items-center justify-center w-5 h-5">{pillar.icon}</div>
                </foreignObject>
            )
        })
    }

    return (
        <TooltipProvider>
            <div className="flex justify-center items-center py-12">
                <svg width={320} height={320}>
                    {/* Círculo interno */}
                    <circle cx={center} cy={center} r={innerRadius} fill="#1e1e2e" stroke="white" strokeWidth="2" />

                    {/* Fatias */}
                    <g>{PILLARS.map((_, i) => createSlice(i))}</g>

                    {/* Ícones */}
                    <g>{renderIcons()}</g>

                    {/* Círculo externo */}
                    <circle
                        cx={center}
                        cy={center}
                        r={outerRadius}
                        fill="transparent"
                        stroke="white"
                        strokeWidth="2"
                        style={{ pointerEvents: "none" }}
                    />
                </svg>
            </div>
        </TooltipProvider>
    )
}
