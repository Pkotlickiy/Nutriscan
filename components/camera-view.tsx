"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Camera, X, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import type { FoodItem } from "../services/food-dataset"
import { recognizeFood, simulateRecognition, loadFoodRecognitionModel } from "../services/tensorflow-service"

type CameraViewProps = {
  onCapture: (recognizedItems: FoodItem[]) => void
  onBack: () => void
}

export default function CameraView({ onCapture, onBack }: CameraViewProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [recognizedItems, setRecognizedItems] = useState<FoodItem[]>([])
  const [totalCalories, setTotalCalories] = useState(0)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null)
  const cameraRef = useRef<any>(null)

  // Загружаем модель при монтировании компонента
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loaded = await loadFoodRecognitionModel()
        setModelLoaded(loaded)
      } catch (error) {
        console.error("Ошибка при загрузке модели:", error)
      }
    }

    loadModel()
  }, [])

  useEffect(() => {
    if (isProcessing) {
      // Имитируем прогресс сканирования
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + 5
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 100)

      // Обрабатываем изображение
      const processImage = async () => {
        try {
          let items: FoodItem[]

          if (capturedImageUri && modelLoaded) {
            // Используем реальное распознавание, если модель загружена и есть изображение
            items = await recognizeFood(capturedImageUri)
          } else {
            // Иначе используем имитацию
            items = simulateRecognition()
          }

          setRecognizedItems(items)
          const total = items.reduce((sum, item) => sum + item.calories, 0)
          setTotalCalories(total)
          setHasPhoto(true)
        } catch (error) {
          console.error("Ошибка при распознавании:", error)
          // В случае ошибки используем имитацию
          const items = simulateRecognition()
          setRecognizedItems(items)
          const total = items.reduce((sum, item) => sum + item.calories, 0)
          setTotalCalories(total)
          setHasPhoto(true)
        } finally {
          setIsProcessing(false)
        }
      }

      processImage()

      return () => clearInterval(interval)
    }
  }, [isProcessing, capturedImageUri, modelLoaded])

  const handleCapture = async () => {
    try {
      // В реальном приложении здесь был бы код для захвата изображения с камеры
      // Например, с использованием expo-camera:
      // if (cameraRef.current) {
      //   const photo = await cameraRef.current.takePictureAsync();
      //   setCapturedImageUri(photo.uri);
      // }

      // Для демонстрации просто начинаем обработку
      setIsProcessing(true)
      setScanProgress(0)

      // Имитируем захват изображения
      setCapturedImageUri("dummy-uri")
    } catch (error) {
      console.error("Ошибка при захвате изображения:", error)
    }
  }

  const handleConfirm = () => {
    onCapture(recognizedItems)
  }

  return (
    <div className="relative h-full w-full flex flex-col bg-black">
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/20 backdrop-blur-sm border-0 hover:bg-black/30"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Здесь в реальном приложении был бы компонент камеры */}
          <div className="absolute inset-0 flex items-center justify-center">
            {hasPhoto ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="relative w-full h-full bg-gradient-to-b from-black/0 via-black/0 to-black/80">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                      Распознано:
                    </h3>
                    <div className="space-y-2">
                      {recognizedItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="flex justify-between p-3 bg-white/10 backdrop-blur-md rounded-lg"
                        >
                          <span>{item.name}</span>
                          <span>{Math.round(item.calories)} ккал</span>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="flex justify-between p-3 bg-white/10 backdrop-blur-md rounded-lg"
                      >
                        <span className="text-yellow-400">Всего</span>
                        <span className="text-yellow-400">{Math.round(totalCalories)} ккал</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white text-center">
                {isProcessing ? (
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4 relative h-32 w-32">
                      <svg className="animate-spin h-32 w-32" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{scanProgress}%</span>
                      </div>
                    </div>
                    <p className="text-lg">Анализируем изображение...</p>
                    <p className="text-sm text-white/70 mt-2">Распознаем продукты и калории</p>

                    <div className="mt-4 flex space-x-2">
                      <motion.div
                        className="h-1 w-16 bg-white/30 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "4rem" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-purple-500"
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                      <motion.div
                        className="h-1 w-16 bg-white/30 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "4rem" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-primary"
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{
                            duration: 1.2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: 0.1,
                          }}
                        />
                      </motion.div>
                      <motion.div
                        className="h-1 w-16 bg-white/30 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "4rem" }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-purple-500"
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{
                            duration: 0.8,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: 0.2,
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    <p className="mb-4 text-lg font-medium">Наведите камеру на еду</p>
                    <motion.div
                      className="w-72 h-72 border-2 border-white/50 rounded-2xl relative"
                      animate={{
                        borderColor: ["rgba(255,255,255,0.5)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.5)"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <motion.div
                        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-purple-500"
                        animate={{
                          y: ["0%", "100%", "0%"],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />

                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-sm text-white/70">
                          Для лучшего результата сфотографируйте
                          <br />
                          всю порцию целиком
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {hasPhoto ? (
          <div className="flex space-x-4">
            <Button
              onClick={() => setHasPhoto(false)}
              variant="outline"
              className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
            >
              <X className="h-6 w-6 text-white" />
            </Button>
            <Button
              onClick={handleConfirm}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
            >
              <Check className="h-6 w-6 text-white" />
            </Button>
          </div>
        ) : (
          <Button
            disabled={isProcessing}
            onClick={handleCapture}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary/30"
          >
            <Camera className="h-8 w-8 text-white" />
          </Button>
        )}
      </div>
    </div>
  )
}

