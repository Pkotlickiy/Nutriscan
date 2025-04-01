import * as tf from "@tensorflow/tfjs"
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native"
import * as FileSystem from "expo-file-system"
import * as ImageManipulator from "expo-image-manipulator"
import type { FoodItem } from "./food-dataset"

// Классы продуктов, которые может распознать модель
const FOOD_CLASSES = [
  "apple",
  "banana",
  "bread",
  "broccoli",
  "burger",
  "cake",
  "carrot",
  "cheese",
  "chicken",
  "coffee",
  "egg",
  "fish",
  "french_fries",
  "grapes",
  "ice_cream",
  "milk",
  "orange",
  "pasta",
  "pizza",
  "potato",
  "rice",
  "salad",
  "sandwich",
  "steak",
  "sushi",
  "tomato",
  "water",
  "yogurt",
]

// Маппинг классов на русские названия
const CLASS_NAMES_RU: Record<string, string> = {
  apple: "Яблоко",
  banana: "Банан",
  bread: "Хлеб",
  broccoli: "Брокколи",
  burger: "Бургер",
  cake: "Торт",
  carrot: "Морковь",
  cheese: "Сыр",
  chicken: "Курица",
  coffee: "Кофе",
  egg: "Яйцо",
  fish: "Рыба",
  french_fries: "Картофель фри",
  grapes: "Виноград",
  ice_cream: "Мороженое",
  milk: "Молоко",
  orange: "Апельсин",
  pasta: "Паста",
  pizza: "Пицца",
  potato: "Картофель",
  rice: "Рис",
  salad: "Салат",
  sandwich: "Сэндвич",
  steak: "Стейк",
  sushi: "Суши",
  tomato: "Помидор",
  water: "Вода",
  yogurt: "Йогурт",
}

// Примерные данные о питательной ценности для каждого класса
const NUTRITION_DATA: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  broccoli: { calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
  burger: { calories: 540, protein: 25, carbs: 40, fat: 29 },
  cake: { calories: 340, protein: 5, carbs: 55, fat: 12 },
  carrot: { calories: 50, protein: 1.2, carbs: 12, fat: 0.3 },
  cheese: { calories: 402, protein: 25, carbs: 2.4, fat: 33 },
  chicken: { calories: 239, protein: 27, carbs: 0, fat: 14 },
  coffee: { calories: 2, protein: 0.3, carbs: 0, fat: 0 },
  egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  fish: { calories: 206, protein: 22, carbs: 0, fat: 12 },
  french_fries: { calories: 365, protein: 4, carbs: 48, fat: 17 },
  grapes: { calories: 69, protein: 0.6, carbs: 18, fat: 0.2 },
  ice_cream: { calories: 207, protein: 3.5, carbs: 24, fat: 11 },
  milk: { calories: 149, protein: 8, carbs: 12, fat: 8 },
  orange: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  pasta: { calories: 158, protein: 6, carbs: 31, fat: 0.9 },
  pizza: { calories: 285, protein: 12, carbs: 36, fat: 10 },
  potato: { calories: 161, protein: 4.3, carbs: 37, fat: 0.2 },
  rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  salad: { calories: 152, protein: 1.2, carbs: 3.3, fat: 15 },
  sandwich: { calories: 290, protein: 15, carbs: 29, fat: 13 },
  steak: { calories: 271, protein: 26, carbs: 0, fat: 19 },
  sushi: { calories: 349, protein: 7.8, carbs: 71, fat: 0.6 },
  tomato: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  water: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  yogurt: { calories: 150, protein: 12, carbs: 17, fat: 3.8 },
}

// Размеры входного изображения для модели
const IMAGE_SIZE = 224

// Флаг, указывающий, загружена ли модель
let modelLoaded = false
let model: tf.LayersModel | null = null

/**
 * Загружает модель TensorFlow для распознавания еды
 */
export async function loadFoodRecognitionModel(): Promise<boolean> {
  try {
    // Если модель уже загружена, возвращаем true
    if (modelLoaded && model) {
      return true
    }

    // Инициализируем TensorFlow.js
    await tf.ready()
    console.log("TensorFlow.js готов")

    // Загружаем модель из ресурсов приложения
    // В реальном приложении здесь будут пути к файлам модели
    const modelJson = require("../assets/model/model.json")
    const modelWeights = require("../assets/model/weights.bin")

    // Загружаем модель
    model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
    console.log("Модель загружена")

    // Прогреваем модель
    const dummyInput = tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])
    const warmupResult = await model.predict(dummyInput)
    tf.dispose([dummyInput, warmupResult])
    console.log("Модель прогрета")

    modelLoaded = true
    return true
  } catch (error) {
    console.error("Ошибка при загрузке модели:", error)
    return false
  }
}

/**
 * Предобрабатывает изображение для подачи в модель
 */
async function preprocessImage(uri: string): Promise<tf.Tensor3D> {
  try {
    // Изменяем размер изображения
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: IMAGE_SIZE, height: IMAGE_SIZE } }],
      { format: ImageManipulator.SaveFormat.JPEG },
    )

    // Читаем файл как base64
    const imgB64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    })

    // Декодируем JPEG в тензор
    const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer
    const raw = new Uint8Array(imgBuffer)
    const imgTensor = decodeJpeg(raw)

    // Нормализуем значения пикселей
    const normalized = tf.div(imgTensor, 255.0)

    // Расширяем размерность для батча
    return normalized as tf.Tensor3D
  } catch (error) {
    console.error("Ошибка при предобработке изображения:", error)
    throw error
  }
}

/**
 * Распознает еду на изображении
 */
export async function recognizeFood(imageUri: string): Promise<FoodItem[]> {
  try {
    // Проверяем, загружена ли модель
    if (!modelLoaded || !model) {
      const loaded = await loadFoodRecognitionModel()
      if (!loaded) {
        throw new Error("Не удалось загрузить модель")
      }
    }

    // Предобрабатываем изображение
    const imageTensor = await preprocessImage(imageUri)
    const batchedImage = tf.expandDims(imageTensor, 0)

    // Получаем предсказания
    const predictions = (await model!.predict(batchedImage)) as tf.Tensor
    const probabilities = await predictions.data()

    // Освобождаем память
    tf.dispose([imageTensor, batchedImage, predictions])

    // Находим топ-3 предсказания
    const topIndices = findTopKIndices(Array.from(probabilities), 3)

    // Формируем результат
    const recognizedItems: FoodItem[] = topIndices.map((index, i) => {
      const className = FOOD_CLASSES[index]
      const nameRu = CLASS_NAMES_RU[className] || className
      const nutrition = NUTRITION_DATA[className]

      return {
        id: `recognized-${Date.now()}-${i}`,
        name: nameRu,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        quantity: "1 порция",
        confidence: probabilities[index],
      }
    })

    return recognizedItems
  } catch (error) {
    console.error("Ошибка при распознавании еды:", error)
    // В случае ошибки возвращаем пустой массив
    return []
  }
}

/**
 * Находит индексы топ-K элементов в массиве
 */
function findTopKIndices(array: number[], k: number): number[] {
  return array
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, k)
    .map((item) => item.index)
}

/**
 * Имитирует распознавание еды (для тестирования без модели)
 */
export function simulateRecognition(): FoodItem[] {
  // Выбираем случайные классы
  const randomIndices = Array.from({ length: 2 }, () => Math.floor(Math.random() * FOOD_CLASSES.length))

  return randomIndices.map((index, i) => {
    const className = FOOD_CLASSES[index]
    const nameRu = CLASS_NAMES_RU[className] || className
    const nutrition = NUTRITION_DATA[className]

    return {
      id: `simulated-${Date.now()}-${i}`,
      name: nameRu,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      quantity: "1 порция",
      confidence: Math.random() * 0.5 + 0.5, // Случайная уверенность от 0.5 до 1.0
    }
  })
}

