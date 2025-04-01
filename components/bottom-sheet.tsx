"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo, useMotionValue } from "framer-motion"
import { X, Search, Camera, Clock, Barcode, Sparkles, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchFoodItems, getRandomFoodItems, type FoodItem } from "../services/food-dataset"

type BottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  onFoodSelect?: (food: FoodItem) => void
}

export default function BottomSheet({ isOpen, onClose, onFoodSelect }: BottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)

  const recentFoods = [
    { name: "Греческий салат", time: "Вчера, 19:30", calories: 320, protein: 12, carbs: 15, fat: 22 },
    { name: "Овсянка с ягодами", time: "Сегодня, 08:15", calories: 210, protein: 7, carbs: 35, fat: 4 },
    { name: "Куриная грудка с овощами", time: "Вчера, 13:45", calories: 350, protein: 35, carbs: 10, fat: 15 },
  ]

  useEffect(() => {
    // Load popular foods when the component mounts
    const loadPopularFoods = async () => {
      const foods = await getRandomFoodItems(12)
      setPopularFoods(foods)
    }

    loadPopularFoods()
  }, [])

  useEffect(() => {
    // Search for food items when the query changes
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsLoading(true)
        const results = await searchFoodItems(searchQuery)
        setSearchResults(results)
        setIsLoading(false)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose()
    }
  }

  const handleFoodSelect = (food: FoodItem) => {
    if (onFoodSelect) {
      onFoodSelect(food)
    }
    onClose()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ y }}
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Добавить продукт
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск продуктов..."
                  className={`pl-10 rounded-full border-muted bg-muted/50 transition-all duration-300 ${searchFocused ? "ring-2 ring-primary/50" : ""}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
                >
                  <Mic className="h-4 w-4 text-primary" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  variant="outline"
                  className="h-auto py-3 rounded-xl border-primary/20 hover:bg-primary/10 shadow-sm"
                >
                  <Camera className="h-5 w-5 mr-2 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Камера</div>
                    <div className="text-xs text-muted-foreground">Сфотографировать</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-3 rounded-xl border-primary/20 hover:bg-primary/10 shadow-sm"
                >
                  <Barcode className="h-5 w-5 mr-2 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Штрих-код</div>
                    <div className="text-xs text-muted-foreground">Сканировать</div>
                  </div>
                </Button>
              </div>

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                    <Search className="h-4 w-4 mr-1 text-primary/70" />
                    Результаты поиска
                  </h3>

                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((food) => (
                        <motion.div
                          key={food.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors shadow-sm"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleFoodSelect(food)}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{food.name}</div>
                            <div className="text-xs text-muted-foreground">{food.quantity}</div>
                          </div>
                          <div className="text-sm font-medium text-primary">{food.calories} ккал</div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">Ничего не найдено</div>
                  )}
                </div>
              )}

              {!searchQuery.trim() && (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-primary/70" />
                      Недавние
                    </h3>
                    <div className="space-y-2">
                      {recentFoods.map((food, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors shadow-sm"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() =>
                            handleFoodSelect({
                              id: `recent-${index}`,
                              name: food.name,
                              calories: food.calories,
                              protein: food.protein,
                              carbs: food.carbs,
                              fat: food.fat,
                              time: food.time,
                            })
                          }
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shadow-sm">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{food.name}</div>
                              <div className="text-xs text-muted-foreground">{food.time}</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-primary">{food.calories} ккал</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-primary/70" />
                      Популярные продукты
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularFoods.map((food) => (
                        <motion.div key={food.id} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                          <Button
                            variant="outline"
                            className="rounded-full text-sm border-muted-foreground/20 hover:bg-muted/80 shadow-sm"
                            onClick={() => handleFoodSelect(food)}
                          >
                            {food.name}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="h-20"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

