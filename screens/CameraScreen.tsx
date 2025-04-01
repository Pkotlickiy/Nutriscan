"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Camera as ExpoCamera } from "expo-camera"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from "react-native-reanimated"
import { ArrowLeft, Camera, X, Check, Zap } from "react-native-feather"

import { useTheme } from "../context/ThemeContext"
import { recognizeFood, simulateRecognition, loadFoodRecognitionModel } from "../services/tensorflow-service"
import type { FoodItem } from "../services/food-dataset"

const { width, height } = Dimensions.get("window")

export default function CameraScreen() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [recognizedItems, setRecognizedItems] = useState<FoodItem[]>([])
  const [totalCalories, setTotalCalories] = useState(0)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null)

  const cameraRef = useRef<ExpoCamera>(null)
  const borderAnimation = useSharedValue(0)
  const scanLinePosition = useSharedValue(0)

  useEffect(() => {
    // Запрашиваем разрешение на использование камеры
    ;(async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    })()

    // Загружаем модель
    const loadModel = async () => {
      try {
        const loaded = await loadFoodRecognitionModel()
        setModelLoaded(loaded)
        console.log("Модель загружена:", loaded)
      } catch (error) {
        console.error("Ошибка при загрузке модели:", error)
        Alert.alert("Ошибка", "Не удалось загрузить модель распознавания. Будет использована имитация распознавания.")
      }
    }

    loadModel()

    // Анимация рамки
    borderAnimation.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [])

  useEffect(() => {
    if (isProcessing) {
      // Анимация сканирующей линии
      scanLinePosition.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.linear }), -1, false)

      // Имитация процесса распознавания
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
          setIsProcessing(false)
        } catch (error) {
          console.error("Ошибка при распознавании:", error)
          // В случае ошибки используем имитацию
          const items = simulateRecognition()
          setRecognizedItems(items)
          const total = items.reduce((sum, item) => sum + item.calories, 0)
          setTotalCalories(total)
          setHasPhoto(true)
          setIsProcessing(false)
        }
      }

      processImage()

      return () => clearInterval(interval)
    }
  }, [isProcessing, capturedImageUri, modelLoaded])

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return

    try {
      setIsProcessing(true)
      setScanProgress(0)

      // Делаем снимок
      const photo = await cameraRef.current.takePictureAsync()
      setCapturedImageUri(photo.uri)

      console.log("Фото сделано:", photo.uri)
    } catch (error) {
      console.error("Ошибка при захвате изображения:", error)
      setIsProcessing(false)
      Alert.alert("Ошибка", "Не удалось сделать фото. Пожалуйста, попробуйте еще раз.")
    }
  }

  const handleConfirm = () => {
    navigation.navigate("Home", { recognizedItems })
  }

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: `rgba(255, 255, 255, ${0.5 + borderAnimation.value * 0.3})`,
    }
  })

  const animatedScanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLinePosition.value * 270 }],
      opacity: 1 - Math.abs(scanLinePosition.value - 0.5) * 0.5,
    }
  })

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ textAlign: "center", color: colors.text }}>
          Нет доступа к камере. Пожалуйста, предоставьте разрешение в настройках.
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {!hasPhoto ? (
        <ExpoCamera style={{ flex: 1 }} ratio="16:9" ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ArrowLeft width={20} height={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.cameraContent}>
              {isProcessing ? (
                <View style={styles.processingContainer}>
                  <View style={styles.spinnerContainer}>
                    <ActivityIndicator size={80} color="#FFFFFF" />
                    <Text style={styles.progressText}>{scanProgress}%</Text>
                  </View>
                  <Text style={styles.processingText}>Анализируем изображение...</Text>
                  <Text style={styles.processingSubtext}>Распознаем продукты и калории</Text>

                  <View style={styles.loadingBars}>
                    <Animated.View style={[styles.loadingBar, { backgroundColor: colors.primary }]} />
                    <Animated.View
                      style={[styles.loadingBar, { backgroundColor: colors.secondary, animationDelay: "0.2s" }]}
                    />
                    <Animated.View
                      style={[styles.loadingBar, { backgroundColor: colors.primary, animationDelay: "0.4s" }]}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.guideContainer}>
                  <Text style={styles.guideText}>Наведите камеру на еду</Text>
                  <Animated.View style={[styles.frameBorder, animatedBorderStyle]}>
                    <Animated.View style={[styles.scanLine, animatedScanLineStyle]} />
                    <Text style={styles.frameText}>Для лучшего результата сфотографируйте{"\n"}всю порцию целиком</Text>
                  </Animated.View>
                </View>
              )}
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={[styles.captureButton, isProcessing && styles.disabledButton]}
                onPress={handleCapture}
                disabled={isProcessing}
              >
                <Camera width={32} height={32} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </ExpoCamera>
      ) : (
        <View style={styles.resultContainer}>
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.resultGradient}>
            <View style={styles.recognizedContainer}>
              <Text style={styles.recognizedTitle}>
                <Zap width={20} height={20} color="#FFD700" /> Распознано:
              </Text>
              <View style={styles.recognizedItems}>
                {recognizedItems.map((item, index) => (
                  <Animated.View
                    key={index}
                    style={styles.recognizedItem}
                    entering={Animated.withDelay(
                      index * 200,
                      Animated.withTiming(Animated.FadeInLeft.build(), { duration: 300 }),
                    )}
                  >
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCalories}>{Math.round(item.calories)} ккал</Text>
                  </Animated.View>
                ))}
                <Animated.View
                  style={[styles.recognizedItem, styles.totalItem]}
                  entering={Animated.withDelay(
                    recognizedItems.length * 200,
                    Animated.withTiming(Animated.FadeInLeft.build(), { duration: 300 }),
                  )}
                >
                  <Text style={styles.totalText}>Всего</Text>
                  <Text style={styles.totalText}>{Math.round(totalCalories)} ккал</Text>
                </Animated.View>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.resultControls}>
            <TouchableOpacity style={styles.resultButton} onPress={() => setHasPhoto(false)}>
              <X width={24} height={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resultButton, styles.confirmButton]} onPress={handleConfirm}>
              <LinearGradient colors={["#10B981", "#059669"]} style={styles.confirmGradient}>
                <Check width={24} height={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cameraContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  guideContainer: {
    alignItems: "center",
  },
  guideText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  frameBorder: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  frameText: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontSize: 14,
  },
  processingContainer: {
    alignItems: "center",
  },
  spinnerContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  progressText: {
    position: "absolute",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  processingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  processingSubtext: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 8,
  },
  loadingBars: {
    flexDirection: "row",
    marginTop: 16,
    gap: 4,
  },
  loadingBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  resultGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: "flex-end",
    padding: 16,
  },
  recognizedContainer: {
    marginBottom: 16,
  },
  recognizedTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  recognizedItems: {
    gap: 8,
  },
  recognizedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
  itemName: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  itemCalories: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  totalItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  totalText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
  },
  resultButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  confirmGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
  },
})

