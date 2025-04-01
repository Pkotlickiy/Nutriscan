"use client"

import { useState, useEffect } from "react"
import {
  Camera,
  ImagePlus,
  Moon,
  Sun,
  Plus,
  Utensils,
  Home,
  BarChartIcon as ChartBar,
  History,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import FoodItem from "./food-item"
import CameraView from "./camera-view"
import BottomSheet from "./bottom-sheet"
import AIRecommendations from "./ai-recommendations"
import MealPlanning from "./meal-planning"
import WaterTracker from "./water-tracker"
import NutritionDonut from "./nutrition-donut"
import type { FoodItem as FoodItemType } from "../services/food-dataset"
import { formatNutrition, generateServingSize } from "../utils/food-recognition"

export default function FoodRecognition() {
  const [activeTab, setActiveTab] = useState("today")
  const [showCamera, setShowCamera] = useState(false)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [recognizedFood, setRecognizedFood] = useState<FoodItemType[]>([
    {
      id: "1",
      name: "Яблоко",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      quantity: "1 среднее (182г)",
      image: "/placeholder.svg?height=60&width=60",
      time: "08:30",
    },
    {
      id: "2",
      name: "Греческий йогурт",
      calories: 130,
      protein: 12,
      carbs: 5,
      fat: 6,
      quantity: "1 стакан (170г)",
      image: "/placeholder.svg?height=60&width=60",
      time: "10:15",
    },
    {
      id: "3",
      name: "Овсянка с ягодами",
      calories: 210,
      protein: 7,
      carbs: 35,
      fat: 4,
      quantity: "1 порция (200г)",
      image: "/placeholder.svg?height=60&width=60",
      time: "12:45",
    },
  ])

  const [dailyCalories, setDailyCalories] = useState(2000)
  const [consumedCalories, setConsumedCalories] = useState(435)
  const [totalProtein, setTotalProtein] = useState(19.5)
  const [totalFat, setTotalFat] = useState(10.3)
  const [totalCarbs, setTotalCarbs] = useState(65)

  const handleCapture = (newItems: FoodItemType[]) => {
    // Add current time to the items
    const now = new Date()
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    const itemsWithTime = newItems.map((item) => ({
      ...item,
      time: timeString,
      image: "/placeholder.svg?height=60&width=60", // Add placeholder image
      quantity: item.quantity || generateServingSize(item),
    }))

    // Add the new items to the recognized food list
    setRecognizedFood((prev) => [...itemsWithTime, ...prev])

    // Update nutrition totals
    const newCalories = itemsWithTime.reduce((sum, item) => sum + item.calories, 0)
    const newProtein = itemsWithTime.reduce((sum, item) => sum + item.protein, 0)
    const newFat = itemsWithTime.reduce((sum, item) => sum + item.fat, 0)
    const newCarbs = itemsWithTime.reduce((sum, item) => sum + item.carbs, 0)

    setConsumedCalories((prev) => prev + newCalories)
    setTotalProtein((prev) => prev + newProtein)
    setTotalFat((prev) => prev + newFat)
    setTotalCarbs((prev) => prev + newCarbs)

    setShowCamera(false)
  }

  const handleAddFood = (food: FoodItemType) => {
    // Add current time to the food item
    const now = new Date()
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    const foodWithDetails = {
      ...food,
      time: timeString,
      image: "/placeholder.svg?height=60&width=60", // Add placeholder image
      quantity: food.quantity || generateServingSize(food),
    }

    // Add the new food to the recognized food list
    setRecognizedFood((prev) => [foodWithDetails, ...prev])

    // Update nutrition totals
    setConsumedCalories((prev) => prev + food.calories)
    setTotalProtein((prev) => prev + food.protein)
    setTotalFat((prev) => prev + food.fat)
    setTotalCarbs((prev) => prev + food.carbs)
  }

  const caloriesPercentage = Math.min(100, Math.round((consumedCalories / dailyCalories) * 100))

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        {showCamera ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50"
          >
            <CameraView onCapture={handleCapture} onBack={() => setShowCamera(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            <header className="p-4 flex items-center justify-between backdrop-blur-xl bg-background/60 dark:bg-background/40 sticky top-0 z-10 border-b border-border/20">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mr-3 shadow-lg shadow-primary/20">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  NutriScan
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-9 w-9">
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </header>

            <div className="p-4 space-y-6 overflow-y-auto flex-1 pb-24">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
                <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary/5 via-purple-500/10 to-primary/5 backdrop-blur-xl dark:from-primary/10 dark:via-purple-500/15 dark:to-primary/10">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/40 via-purple-500/40 to-primary/40 rounded-t-xl"></div>

                      <div className="p-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium">Дневная цель</span>
                          <span className="text-sm font-medium">
                            {consumedCalories} / {dailyCalories} ккал
                          </span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary/30">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${caloriesPercentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-6">
                              <div className="text-center p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-md dark:shadow-none dark:bg-background/20">
                                <p className="text-xs text-muted-foreground">Белки</p>
                                <p className="font-medium text-lg">{formatNutrition(totalProtein)}г</p>
                              </div>
                              <div className="text-center p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-md dark:shadow-none dark:bg-background/20">
                                <p className="text-xs text-muted-foreground">Жиры</p>
                                <p className="font-medium text-lg">{formatNutrition(totalFat)}г</p>
                              </div>
                              <div className="text-center p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-md dark:shadow-none dark:bg-background/20">
                                <p className="text-xs text-muted-foreground">Углеводы</p>
                                <p className="font-medium text-lg">{formatNutrition(totalCarbs)}г</p>
                              </div>
                            </div>
                          </div>

                          <div className="hidden sm:block">
                            <NutritionDonut
                              protein={totalProtein}
                              fat={totalFat}
                              carbs={totalCarbs}
                              size={120}
                              percentage={caloriesPercentage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-full p-1 bg-muted/50 backdrop-blur-sm">
                  <TabsTrigger
                    value="today"
                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Сегодня
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                  >
                    <History className="h-4 w-4 mr-2" />
                    История
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                  >
                    <ChartBar className="h-4 w-4 mr-2" />
                    Статистика
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Приемы пищи</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddSheet(true)}
                      className="rounded-full border-primary/20 hover:bg-primary/10 shadow-sm"
                    >
                      <Plus className="h-4 w-4 mr-1 text-primary" />
                      Добавить
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {recognizedFood.map((food, index) => (
                      <motion.div
                        key={food.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <FoodItem food={food} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <WaterTracker />
                  </div>

                  <div className="mt-8">
                    <AIRecommendations />
                  </div>

                  <div className="mt-8">
                    <MealPlanning />
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="p-8 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center shadow-inner">
                      <History className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">История питания</h3>
                    <p className="text-muted-foreground">
                      Здесь будет отображаться история ваших приемов пищи и статистика по дням
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="stats">
                  <div className="p-8 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center shadow-inner">
                      <ChartBar className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Статистика питания</h3>
                    <p className="text-muted-foreground">Здесь будут отображаться графики и аналитика вашего питания</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 backdrop-blur-xl bg-background/60 dark:bg-background/30 border-t border-border/20 flex justify-center">
              <motion.div
                className="flex space-x-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-14 w-14 border-primary/20 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
                  onClick={() => setShowAddSheet(true)}
                >
                  <ImagePlus className="h-6 w-6 text-primary" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full h-16 w-16 bg-gradient-to-r from-primary via-purple-500 to-primary shadow-xl hover:shadow-2xl transition-all"
                  onClick={() => setShowCamera(true)}
                >
                  <Camera className="h-7 w-7 text-white" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomSheet isOpen={showAddSheet} onClose={() => setShowAddSheet(false)} onFoodSelect={handleAddFood} />
    </div>
  )
}

