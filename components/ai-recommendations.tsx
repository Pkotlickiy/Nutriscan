"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight, Carrot, Fish, Egg } from "lucide-react"
import { motion } from "framer-motion"

type Recommendation = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  benefits: string[]
  color: string
}

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      title: "Больше белка на завтрак",
      description: "Анализ показывает, что вам не хватает белка в утренних приемах пищи",
      icon: <Egg className="h-5 w-5 text-amber-500" />,
      benefits: ["Улучшение метаболизма", "Снижение тяги к сладкому", "Более длительное чувство сытости"],
      color: "from-amber-500/10 to-amber-600/5",
    },
    {
      id: "2",
      title: "Добавьте омега-3 жирные кислоты",
      description: "В вашем рационе недостаточно полезных жиров",
      icon: <Fish className="h-5 w-5 text-blue-500" />,
      benefits: ["Поддержка здоровья сердца", "Улучшение когнитивных функций", "Снижение воспаления"],
      color: "from-blue-500/10 to-blue-600/5",
    },
    {
      id: "3",
      title: "Увеличьте потребление клетчатки",
      description: "Ваш рацион содержит меньше клетчатки, чем рекомендуется",
      icon: <Carrot className="h-5 w-5 text-orange-500" />,
      benefits: ["Улучшение пищеварения", "Стабилизация уровня сахара в крови", "Поддержка здоровой микрофлоры"],
      color: "from-orange-500/10 to-orange-600/5",
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI-рекомендации
        </h2>
        <Button variant="ghost" size="sm" className="text-primary">
          Все рекомендации
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${rec.color} backdrop-blur-xl rounded-xl`}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-t-xl"></div>

                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                        {rec.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-base">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {rec.benefits.map((benefit, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: 0.3 + i * 0.1 }}
                              className="inline-flex text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-foreground"
                            >
                              {benefit}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

