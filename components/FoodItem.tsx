"use client"

import { useState } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { ChevronDown, ChevronUp, Edit2, Clock } from "react-native-feather"

import { useTheme } from "../context/ThemeContext"

type FoodItemProps = {
  food: {
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    quantity: string
    image?: string
    time?: string
  }
}

export default function FoodItem({ food }: FoodItemProps) {
  const { colors } = useTheme()
  const [expanded, setExpanded] = useState(false)
  const height = useSharedValue(0)
  const opacity = useSharedValue(0)

  const toggleExpand = () => {
    if (expanded) {
      opacity.value = withTiming(0, { duration: 200 })
      height.value = withTiming(0, { duration: 300, easing: Easing.bezier(0.4, 0, 0.2, 1) })
    } else {
      height.value = withTiming(150, { duration: 300, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      opacity.value = withTiming(1, { duration: 300, delay: 100 })
    }
    setExpanded(!expanded)
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
    }
  })

  return (
    <LinearGradient colors={[`${colors.card}`, `${colors.card}`]} style={[styles.container, { borderRadius: 16 }]}>
      <View style={styles.header}>
        {food.image && (
          <Image source={{ uri: food.image }} style={[styles.image, { backgroundColor: `${colors.muted}50` }]} />
        )}
        <View style={styles.infoContainer}>
          {food.time && (
            <View style={styles.timeContainer}>
              <Clock width={12} height={12} color={colors.textSecondary} />
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>{food.time}</Text>
            </View>
          )}
          <Text style={[styles.foodName, { color: colors.text }]}>{food.name}</Text>
          <Text style={[styles.quantity, { color: colors.textSecondary }]}>{food.quantity}</Text>
        </View>
        <View style={styles.caloriesContainer}>
          <Text style={[styles.calories, { color: colors.primary }]}>{food.calories} ккал</Text>
          <TouchableOpacity onPress={toggleExpand}>
            {expanded ? (
              <ChevronUp width={16} height={16} color={colors.textSecondary} />
            ) : (
              <ChevronDown width={16} height={16} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.detailsContainer, animatedStyle]}>
        <View style={[styles.separator, { backgroundColor: `${colors.border}50` }]} />
        <View style={styles.nutrientsContainer}>
          <View style={[styles.nutrientBox, { backgroundColor: `${colors.background}80` }]}>
            <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>Белки</Text>
            <Text style={[styles.nutrientValue, { color: colors.text }]}>{food.protein}г</Text>
          </View>
          <View style={[styles.nutrientBox, { backgroundColor: `${colors.background}80` }]}>
            <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>Жиры</Text>
            <Text style={[styles.nutrientValue, { color: colors.text }]}>{food.fat}г</Text>
          </View>
          <View style={[styles.nutrientBox, { backgroundColor: `${colors.background}80` }]}>
            <Text style={[styles.nutrientLabel, { color: colors.textSecondary }]}>Углеводы</Text>
            <Text style={[styles.nutrientValue, { color: colors.text }]}>{food.carbs}г</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.editButton, { borderColor: `${colors.primary}30` }]}>
          <Edit2 width={12} height={12} color={colors.primary} />
          <Text style={[styles.editText, { color: colors.primary }]}>Редактировать</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "500",
  },
  quantity: {
    fontSize: 14,
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calories: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
  detailsContainer: {
    overflow: "hidden",
  },
  separator: {
    height: 1,
    marginHorizontal: 12,
  },
  nutrientsContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  nutrientBox: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  nutrientLabel: {
    fontSize: 12,
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editText: {
    fontSize: 14,
    marginLeft: 4,
  },
})

