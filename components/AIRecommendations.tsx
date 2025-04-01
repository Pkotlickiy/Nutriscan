"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated from "react-native-reanimated"
import { Sparkles, ChevronRight, Egg, Fish, Carrot } from "react-native-feather"

import { useTheme } from "../context/ThemeContext"

type Recommendation = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  benefits: string[]
  color: string
  gradientColors: string[]
}

export default function AIRecommendations() {
  const { colors } = useTheme()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      title: "Больше белка на завтрак",
      description: "Анализ показывает, что вам не хватает белка в утренних приемах пищи",
      icon: <Egg width={20} height={20} color="#F59E0B" />,
      benefits: ["Улучшение метаболизма", "Снижение тяги к сладкому", "Более длительное чувство сытости"],
      color: "#F59E0B",
      gradientColors: [`${colors.background}`, `rgba(245, 158, 11, 0.1)`],
    },
    {
      id: "2",
      title: "Добавьте омега-3 жирные кислоты",
      description: "В вашем рационе недостаточно полезных жиров",
      icon: <Fish width={20} height={20} color="#3B82F6" />,
      benefits: ["Поддержка здоровья сердца", "Улучшение когнитивных функций", "Снижение воспаления"],
      color: "#3B82F6",
      gradientColors: [`${colors.background}`, `rgba(59, 130, 246, 0.1)`],
    },
    {
      id: "3",
      title: "Увеличьте потребление клетчатки",
      description: "Ваш рацион содержит меньше клетчатки, чем рекомендуется",
      icon: <Carrot width={20} height={20} color="#F97316" />,
      benefits: ["Улучшение пищеварения", "Стабилизация уровня сахара в крови", "Поддержка здоровой микрофлоры"],
      color: "#F97316",
      gradientColors: [`${colors.background}`, `rgba(249, 115, 22, 0.1)`],
    },
  ])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Sparkles width={20} height={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>AI-рекомендации</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={{ color: colors.primary, fontSize: 14 }}>Все рекомендации</Text>
          <ChevronRight width={16} height={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.recommendationsContainer}>
        {recommendations.map((rec, index) => (
          <Animated.View
            key={rec.id}
            style={styles.recommendationCard}
            entering={Animated.withDelay(
              index * 200,
              Animated.withTiming(Animated.FadeInUp.build(), { duration: 400 }),
            )}
          >
            <LinearGradient
              colors={rec.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${rec.color}20` }]}>{rec.icon}</View>
                <View style={styles.textContainer}>
                  <Text style={[styles.recommendationTitle, { color: colors.text }]}>{rec.title}</Text>
                  <Text style={[styles.recommendationDescription, { color: colors.textSecondary }]}>
                    {rec.description}
                  </Text>

                  <View style={styles.benefitsContainer}>
                    {rec.benefits.map((benefit, i) => (
                      <View key={i} style={[styles.benefitTag, { backgroundColor: `${rec.color}20` }]}>
                        <Text style={[styles.benefitText, { color: rec.color }]}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardGradient: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
    flexDirection: "row",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  benefitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  benefitTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  benefitText: {
    fontSize: 12,
  },
})

