"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { FoodItem as FoodItemType } from "../services/food-dataset"
import { formatNutrition } from "../utils/food-recognition"

type FoodItemProps = {
  food: FoodItemType
}

export default function FoodItem({ food }: FoodItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-xl rounded-xl">
      <CardContent className="p-0">
        <div className="p-3 flex items-center">
          {food.image && (
            <div className="mr-3 rounded-xl overflow-hidden bg-muted/30 h-14 w-14 flex-shrink-0 shadow-md">
              <Image
                src={food.image || "/placeholder.svg"}
                alt={food.name}
                width={60}
                height={60}
                className="object-cover h-full w-full"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center">
              {food.time && (
                <div className="flex items-center text-xs text-muted-foreground mr-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {food.time}
                </div>
              )}
            </div>
            <h3 className="font-medium">{food.name}</h3>
            <p className="text-sm text-muted-foreground">{food.quantity}</p>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2 text-primary">{Math.round(food.calories)} ккал</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pt-2 border-t border-border/30">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-gradient-to-br from-background/80 to-background/50 shadow-sm">
                    <p className="text-xs text-muted-foreground">Белки</p>
                    <p className="font-medium">{formatNutrition(food.protein)}г</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gradient-to-br from-background/80 to-background/50 shadow-sm">
                    <p className="text-xs text-muted-foreground">Жиры</p>
                    <p className="font-medium">{formatNutrition(food.fat)}г</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gradient-to-br from-background/80 to-background/50 shadow-sm">
                    <p className="text-xs text-muted-foreground">Углеводы</p>
                    <p className="font-medium">{formatNutrition(food.carbs)}г</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full border-primary/20 hover:bg-primary/10 shadow-sm"
                >
                  <Edit2 className="h-3 w-3 mr-1 text-primary" />
                  Редактировать
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

