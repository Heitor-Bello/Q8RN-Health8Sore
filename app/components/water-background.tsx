"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface Fish {
  x: number
  y: number
  size: number
  speed: number
  direction: number
  color: string
  tailFrequency: number
  tailAmplitude: number
  phase: number
}

interface WaterBackgroundProps {
  children: React.ReactNode
}

export default function WaterBackground({ children }: WaterBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = container.clientWidth
    let height = container.clientHeight

    // Configurar o canvas para ocupar toda a tela
    canvas.width = width
    canvas.height = height

    // Parâmetros das ondas
    const waves = {
      A: 5, // Amplitude
      L: 300, // Comprimento de onda
      f: 0.02, // Frequência
      phase: 0, // Fase
      mouseX: width / 2,
      mouseY: height / 2,
    }

    // Criar peixes
    const fishColors = [
      "#C084FC", // Roxo claro
      "#A855F7", // Roxo médio
      "#8B5CF6", // Violeta
      "#E879F9", // Rosa
      "#D946EF", // Rosa escuro
      "#F0ABFC", // Rosa claro
    ]

    const createFish = (): Fish => {
      const size = Math.random() * 15 + 10 // Tamanho entre 10 e 25
      const direction = Math.random() > 0.5 ? 1 : -1 // Direção: esquerda ou direita
      return {
        x: direction > 0 ? -size * 2 : width + size * 2, // Começa fora da tela
        y: Math.random() * height * 0.8 + height * 0.1, // Posição Y entre 10% e 90% da altura
        size,
        speed: Math.random() * 0.5 + 0.5, // Velocidade entre 0.5 e 1
        direction,
        color: fishColors[Math.floor(Math.random() * fishColors.length)],
        tailFrequency: Math.random() * 0.1 + 0.05, // Frequência do movimento da cauda
        tailAmplitude: Math.random() * 0.5 + 0.5, // Amplitude do movimento da cauda
        phase: Math.random() * Math.PI * 2, // Fase inicial aleatória
      }
    }

    // Criar um cardume de peixes
    const fishes: Fish[] = Array.from({ length: 15 }, () => createFish())

    // Atualizar dimensões do canvas quando a janela for redimensionada
    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width
      canvas.height = height
    }

    // Atualizar posição do mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      waves.mouseX = e.clientX - rect.left
      waves.mouseY = e.clientY - rect.top
    }

    // Função para desenhar um peixe
    function drawFish(ctx: CanvasRenderingContext2D, fish: Fish, time: number) {
      const { x, y, size, direction, color, tailFrequency, tailAmplitude, phase } = fish

      // Salvar o estado atual do contexto
      ctx.save()

      // Transladar para a posição do peixe
      ctx.translate(x, y)

      // Espelhar horizontalmente se o peixe estiver nadando para a esquerda
      if (direction < 0) {
        ctx.scale(-1, 1)
      }

      // Calcular o movimento da cauda
      const tailWag = Math.sin(time * tailFrequency + phase) * tailAmplitude

      // Desenhar o corpo do peixe (forma de gota)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(size, 0) // Nariz do peixe

      // Corpo superior
      ctx.quadraticCurveTo(size * 0.5, -size * 0.7, -size, tailWag * size * 0.3)

      // Cauda
      ctx.lineTo(-size * 1.5, tailWag * size * 0.8)
      ctx.lineTo(-size, tailWag * size * 0.3)

      // Corpo inferior
      ctx.quadraticCurveTo(size * 0.5, size * 0.7, size, 0)

      ctx.closePath()
      ctx.fill()

      // Desenhar o olho
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(size * 0.7, -size * 0.1, size * 0.15, 0, Math.PI * 2)
      ctx.fill()

      // Pupila
      ctx.fillStyle = "#1E1B4B"
      ctx.beginPath()
      ctx.arc(size * 0.75, -size * 0.1, size * 0.07, 0, Math.PI * 2)
      ctx.fill()

      // Barbatana dorsal
      ctx.fillStyle = color
      ctx.globalAlpha = 0.7
      ctx.beginPath()
      ctx.moveTo(size * 0.2, -size * 0.1)
      ctx.quadraticCurveTo(0, -size * 1.2, -size * 0.4, -size * 0.1)
      ctx.closePath()
      ctx.fill()

      // Barbatana inferior
      ctx.beginPath()
      ctx.moveTo(0, size * 0.2)
      ctx.quadraticCurveTo(-size * 0.2, size * 0.6, -size * 0.5, size * 0.2)
      ctx.closePath()
      ctx.fill()

      // Restaurar o estado do contexto
      ctx.restore()
    }

    // Função para desenhar as ondas
    function drawWaveLayer(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      amplitude: number,
      wavelength: number,
      frequency: number,
      phase: number,
      color: string,
    ) {
      ctx.beginPath()
      ctx.moveTo(0, height / 2)

      // Desenhar a onda ponto a ponto
      for (let x = 0; x < width; x++) {
        // Calcular distância do mouse (efeito de ondulação)
        const dx = x - waves.mouseX
        const dy = height / 2 - waves.mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Adicionar ondulação extra perto do mouse
        const mouseEffect = Math.sin(distance * 0.05) * Math.min(15, 300 / (distance + 1))

        // Calcular a altura da onda neste ponto
        const y = height / 2 + amplitude * Math.sin(x / wavelength + phase) + mouseEffect

        ctx.lineTo(x, y)
      }

      // Completar o caminho até o fundo do canvas
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()

      // Preencher a onda
      ctx.fillStyle = color
      ctx.fill()
    }

    // Função para atualizar a posição dos peixes
    function updateFishes(time: number) {
      for (let i = 0; i < fishes.length; i++) {
        const fish = fishes[i]

        // Mover o peixe
        fish.x += fish.speed * fish.direction

        // Adicionar um movimento vertical suave baseado em seno
        fish.y += Math.sin(time * 0.001 + i) * 0.3

        // Verificar se o peixe saiu da tela
        if ((fish.direction > 0 && fish.x > width + fish.size * 2) || (fish.direction < 0 && fish.x < -fish.size * 2)) {
          // Reposicionar o peixe do outro lado
          if (fish.direction > 0) {
            fish.x = -fish.size * 2
            fish.y = Math.random() * height * 0.8 + height * 0.1
          } else {
            fish.x = width + fish.size * 2
            fish.y = Math.random() * height * 0.8 + height * 0.1
          }
        }

        // Verificar proximidade com o mouse e reagir
        const dx = fish.x - waves.mouseX
        const dy = fish.y - waves.mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Se o mouse estiver próximo, o peixe tenta se afastar um pouco
        if (distance < 100) {
          fish.y += (fish.y > waves.mouseY ? 1 : -1) * 0.5
          fish.speed = Math.min(fish.speed * 1.05, 2) // Acelerar um pouco, até um limite
        } else {
          fish.speed = Math.max(fish.speed * 0.99, 0.5) // Voltar à velocidade normal
        }
      }
    }

    // Função principal de animação
    function animate(time: number) {
      // Limpar o canvas
      ctx.clearRect(0, 0, width, height)

      // Gradiente de fundo roxo escuro
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "rgba(30, 27, 75, 0.8)") // indigo-950
      gradient.addColorStop(1, "rgba(49, 46, 129, 0.8)") // indigo-900

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Desenhar múltiplas camadas de ondas
      drawWaveLayer(ctx, width, height, waves.A, waves.L, waves.f, waves.phase, "rgba(139, 92, 246, 0.3)") // violeta
      drawWaveLayer(
        ctx,
        width,
        height,
        waves.A * 0.8,
        waves.L * 0.8,
        waves.f * 1.2,
        waves.phase + 0.2,
        "rgba(168, 85, 247, 0.3)",
      ) // roxo
      drawWaveLayer(
        ctx,
        width,
        height,
        waves.A * 0.6,
        waves.L * 1.2,
        waves.f * 0.8,
        waves.phase + 0.4,
        "rgba(217, 70, 239, 0.2)",
      ) // rosa

      // Atualizar fase para animação
      waves.phase += 0.005

      // Ajustar amplitude com base na posição do mouse
      const mouseDistanceFromCenter = Math.sqrt(
        Math.pow(waves.mouseX - width / 2, 2) + Math.pow(waves.mouseY - height / 2, 2),
      )

      // Aumentar amplitude quando o mouse está próximo do centro
      waves.A = 5 + Math.max(0, (width / 4 - mouseDistanceFromCenter) / 20)

      // Atualizar e desenhar peixes
      updateFishes(time)
      for (const fish of fishes) {
        drawFish(ctx, fish, time * 0.001)
      }

      // Continuar animação
      requestAnimationFrame(animate)
    }

    // Iniciar animação
    animate(0)

    // Adicionar event listeners
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)

    // Limpar event listeners quando o componente for desmontado
    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
