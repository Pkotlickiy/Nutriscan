"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"

export default function WaterTracker() {
  const [waterGoal, setWaterGoal] = useState(2000) // мл
  const [waterConsumed, setWaterConsumed] = useState(750) // мл

  const addWater = (amount: number) => {
    setWaterConsumed((prev) => Math.min(prev + amount, waterGoal * 1.5))
  }

  const removeWater = (amount: number) => {
    setWaterConsumed((prev) => Math.max(prev - amount, 0))
  }

  const waterPercentage = Math.min(100, Math.round((waterConsumed / waterGoal) * 100))

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl">
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400/40 via-cyan-400/40 to-blue-400/40 rounded-t-xl"></div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center">
                <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                Водный баланс
              </h3>
              <span className="text-sm font-medium">
                {waterConsumed} / {waterGoal} мл
              </span>
            </div>

            <div className="relative h-20 w-full overflow-hidden rounded-xl bg-blue-100/30 dark:bg-blue-950/30 mb-4 shadow-inner">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-b-xl"
                initial={{ height: 0 }}
                animate={{ height: `${waterPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1 bg-white/30"
                  animate={{
                    y: [0, 5, 0],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute top-2 left-0 right-0 h-1 bg-white/20"
                  animate={{
                    y: [0, 8, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
              </motion.div>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{waterPercentage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[200, 300, 500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => addWater(amount)}
                  className="border-blue-300/30 hover:bg-blue-500/10 text-blue-700 dark:text-blue-300 shadow-sm"
                >
                  +{amount} мл
                </Button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeWater(200)}
                className="border-blue-300/30 hover:bg-blue-500/10 text-blue-700 dark:text-blue-300 h-10 w-10 rounded-full shadow-sm"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: "0.25rem" }}
                    animate={{
                      height: i < Math.floor(waterConsumed / (waterGoal / 8)) ? "0.5rem" : "0.25rem",
                      opacity: i < Math.floor(waterConsumed / (waterGoal / 8)) ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-6 rounded-full ${i < Math.floor(waterConsumed / (waterGoal / 8)) ? "bg-gradient-to-r from-blue-500 to-cyan-400" : "bg-blue-200 dark:bg-blue-800"}`}
                  ></motion.div>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => addWater(200)}
                className="border-blue-300/30 hover:bg-blue-500/10 text-blue-700 dark:text-blue-300 h-10 w-10 rounded-full shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

