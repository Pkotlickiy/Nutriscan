"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

type NutritionDonutProps = {
  protein: number
  fat: number
  carbs: number
  size: number
  percentage: number
}

export default function NutritionDonut({ protein, fat, carbs, size, percentage }: NutritionDonutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10

    // Очистка холста
    ctx.clearRect(0, 0, size, size)

    // Вычисление углов для каждого сегмента
    const total = protein + fat + carbs
    const proteinAngle = (protein / total) * 2 * Math.PI
    const fatAngle = (fat / total) * 2 * Math.PI
    const carbsAngle = (carbs / total) * 2 * Math.PI

    // Рисование сегментов
    let startAngle = -Math.PI / 2

    // Белки (фиолетовый)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + proteinAngle)
    ctx.closePath()
    const proteinGradient = ctx.createLinearGradient(0, 0, size, size)
    proteinGradient.addColorStop(0, "rgba(147, 51, 234, 0.8)") // purple-600
    proteinGradient.addColorStop(1, "rgba(168, 85, 247, 0.8)") // purple-500
    ctx.fillStyle = proteinGradient
    ctx.fill()

    startAngle += proteinAngle

    // Жиры (розовый)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + fatAngle)
    ctx.closePath()
    const fatGradient = ctx.createLinearGradient(0, 0, size, size)
    fatGradient.addColorStop(0, "rgba(236, 72, 153, 0.8)") // pink-500
    fatGradient.addColorStop(1, "rgba(219, 39, 119, 0.8)") // pink-600
    ctx.fillStyle = fatGradient
    ctx.fill()

    startAngle += fatAngle

    // Углеводы (синий)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + carbsAngle)
    ctx.closePath()
    const carbsGradient = ctx.createLinearGradient(0, 0, size, size)
    carbsGradient.addColorStop(0, "rgba(59, 130, 246, 0.8)") // blue-500
    carbsGradient.addColorStop(1, "rgba(37, 99, 235, 0.8)") // blue-600
    ctx.fillStyle = carbsGradient
    ctx.fill()

    // Рисование внутреннего круга
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fill()

    // Добавление текста процента
    ctx.font = "bold 20px sans-serif"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${percentage}%`, centerX, centerY)
  }, [protein, fat, carbs, size, percentage])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <canvas ref={canvasRef} width={size} height={size} className="rounded-full shadow-lg" />
    </motion.div>
  )
}

