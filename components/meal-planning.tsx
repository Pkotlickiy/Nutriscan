"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type MealPlan = {
  id: string
  day: string
  date: string
  meals: {
    type: string
    name: string
    calories: number
    time?: string
    completed?: boolean
  }[]
}

export default function MealPlanning() {
  const [currentWeek, setCurrentWeek] = useState("Эта неделя")
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([
    {
      id: "1",
      day: "Понедельник",
      date: "15 апр",
      meals: [
        { type: "Завтрак", name: "Овсянка с ягодами", calories: 320, time: "08:00", completed: true },
        { type: "Обед", name: "Куриный салат", calories: 450, time: "13:00", completed: false },
        { type: "Ужин", name: "Лосось с овощами", calories: 520, time: "19:00", completed: false },
      ],
    },
    {
      id: "2",
      day: "Вторник",
      date: "16 апр",
      meals: [
        { type: "Завтрак", name: "Яичница с авокадо", calories: 380, time: "08:00", completed: false },
        { type: "Обед", name: "Суп с киноа", calories: 410, time: "13:00", completed: false },
        { type: "Ужин", name: "Тофу с овощами", calories: 480, time: "19:00", completed: false },
      ],
    },
    {
      id: "3",
      day: "Среда",
      date: "17 апр",
      meals: [
        { type: "Завтрак", name: "Смузи с протеином", calories: 290, time: "08:00", completed: false },
        { type: "Обед", name: "Греческий салат", calories: 380, time: "13:00", completed: false },
        { type: "Ужин", name: "Киноа с овощами", calories: 420, time: "19:00", completed: false },
      ],
    },
    {
      id: "4",
      day: "Четверг",
      date: "18 апр",
      meals: [
        { type: "Завтрак", name: "Творог с ягодами", calories: 310, time: "08:00", completed: false },
        { type: "Обед", name: "Суп-пюре", calories: 350, time: "13:00", completed: false },
        { type: "Ужин", name: "Индейка с овощами", calories: 490, time: "19:00", completed: false },
      ],
    },
    {
      id: "5",
      day: "Пятница",
      date: "19 апр",
      meals: [
        { type: "Завтрак", name: "Омлет с овощами", calories: 340, time: "08:00", completed: false },
        { type: "Обед", name: "Боул с киноа", calories: 420, time: "13:00", completed: false },
        { type: "Ужин", name: "Рыба на гриле", calories: 460, time: "19:00", completed: false },
      ],
    },
    {
      id: "6",
      day: "Суббота",
      date: "20 апр",
      meals: [
        { type: "Завтрак", name: "Панкейки с ягодами", calories: 380, time: "09:00", completed: false },
        { type: "Обед", name: "Салат с тунцом", calories: 390, time: "14:00", completed: false },
        { type: "Ужин", name: "Паста с овощами", calories: 450, time: "19:00", completed: false },
      ],
    },
    {
      id: "7",
      day: "Воскресенье",
      date: "21 апр",
      meals: [
        { type: "Завтрак", name: "Гранола с йогуртом", calories: 360, time: "09:00", completed: false },
        { type: "Обед", name: "Овощной суп", calories: 320, time: "14:00", completed: false },
        { type: "Ужин", name: "Запеченная курица", calories: 480, time: "19:00", completed: false },
      ],
    },
  ])

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
  const [selectedDay, setSelectedDay] = useState(0)

  const toggleMealCompleted = (mealIndex: number) => {
    const updatedMealPlans = [...mealPlans]
    const meal = updatedMealPlans[selectedDay].meals[mealIndex]
    meal.completed = !meal.completed
    setMealPlans(updatedMealPlans)
  }

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary/5 via-purple-500/10 to-primary/5 backdrop-blur-xl rounded-xl">
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/40 via-purple-500/40 to-primary/40 rounded-t-xl"></div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                План питания
              </h2>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">{currentWeek}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {days.map((day, index) => (
                <Button
                  key={day}
                  variant="ghost"
                  className={`h-auto py-2 px-0 rounded-lg ${selectedDay === index ? "bg-primary/20 text-primary" : ""}`}
                  onClick={() => setSelectedDay(index)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs">{day}</span>
                    <span className="text-sm font-medium mt-1">{index + 15}</span>
                  </div>
                </Button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {mealPlans[selectedDay].day}, {mealPlans[selectedDay].date}
                </div>

                {mealPlans[selectedDay]?.meals.map((meal, index) => (
                  <motion.div
                    key={`${meal.type}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card
                      className={`overflow-hidden border-none shadow-sm ${meal.completed ? "bg-muted/50" : "bg-card/80"} backdrop-blur-sm hover:shadow-md transition-all duration-300`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-full mr-2 ${meal.completed ? "bg-green-500/20" : "bg-primary/10"}`}
                              onClick={() => toggleMealCompleted(index)}
                            >
                              {meal.completed ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-primary/50"></div>
                              )}
                            </Button>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {meal.type} • {meal.time}
                              </p>
                              <h3
                                className={`font-medium ${meal.completed ? "line-through text-muted-foreground" : ""}`}
                              >
                                {meal.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">{meal.calories} ккал</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                <Button
                  variant="outline"
                  className="w-full mt-2 border-dashed border-primary/30 text-primary shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить прием пищи
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

