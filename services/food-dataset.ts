/**
 * Service for fetching and managing food dataset from Hugging Face
 */

// The base URL for the Hugging Face Datasets server
const DATASET_API_URL = "https://datasets-server.huggingface.co/rows"
const DATASET_NAME = "aryachakraborty/Food_Calorie_Dataset"
const CONFIG = "default"
const SPLIT = "train"

export type FoodItem = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  quantity?: string
  image?: string
  time?: string
}

// Cache the dataset in memory to avoid repeated API calls
let foodDatasetCache: FoodItem[] | null = null

/**
 * Fetches the food dataset from Hugging Face
 */
export async function fetchFoodDataset(offset = 0, length = 1000): Promise<FoodItem[]> {
  try {
    // Return cached data if available
    if (foodDatasetCache) {
      return foodDatasetCache
    }

    const url = `${DATASET_API_URL}?dataset=${encodeURIComponent(DATASET_NAME)}&config=${CONFIG}&split=${SPLIT}&offset=${offset}&length=${length}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch dataset: ${response.statusText}`)
    }

    const data = await response.json()

    // Transform the data into our FoodItem format
    const foodItems: FoodItem[] = data.rows.map((row: any, index: number) => ({
      id: `dataset-${index}`,
      name: row.row.Food_Item || "Unknown Food",
      calories: Number.parseFloat(row.row.Calories) || 0,
      protein: Number.parseFloat(row.row.Protein_g) || 0,
      carbs: Number.parseFloat(row.row.Carbohydrates_g) || 0,
      fat: Number.parseFloat(row.row.Fat_g) || 0,
      quantity: row.row.Serving_Size || "1 serving",
    }))

    // Cache the dataset
    foodDatasetCache = foodItems

    return foodItems
  } catch (error) {
    console.error("Error fetching food dataset:", error)
    return []
  }
}

/**
 * Searches for food items in the dataset
 */
export async function searchFoodItems(query: string): Promise<FoodItem[]> {
  const dataset = await fetchFoodDataset()

  if (!query.trim()) {
    return dataset.slice(0, 20) // Return first 20 items if no query
  }

  const normalizedQuery = query.toLowerCase().trim()

  return dataset.filter((item) => item.name.toLowerCase().includes(normalizedQuery)).slice(0, 20) // Limit to 20 results
}

/**
 * Gets a random selection of food items
 */
export async function getRandomFoodItems(count = 5): Promise<FoodItem[]> {
  const dataset = await fetchFoodDataset()
  const shuffled = [...dataset].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

/**
 * Simulates food recognition from an image
 * In a real app, this would call a machine learning model
 */
export async function recognizeFoodFromImage(): Promise<FoodItem[]> {
  const dataset = await fetchFoodDataset()
  // Simulate recognition by returning random items
  const shuffled = [...dataset].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 2) // Return 2 random food items
}

