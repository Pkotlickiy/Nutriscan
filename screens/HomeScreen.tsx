"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import Animated from "react-native-reanimated"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Camera, Plus, Home, History, BarChart2, Moon, Sun, User, Utensils } from "react-native-feather"

import { useTheme } from "../context/ThemeContext"
import FoodItem from "../components/FoodItem"
import WaterTracker from "../components/WaterTracker"
import AIRecommendations from "../components/AIRecommendations"
import MealPlanning from "../components/MealPlanning"
import NutritionDonut from "../components/NutritionDonut"
import BottomSheet from "../components/BottomSheet"

const Tab = createBottomTabNavigator()

const foodData = [
  {
    id: "1",
    name: "Яблоко",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    quantity: "1 среднее (182г)",
    image: "https://via.placeholder.com/60",
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
    image: "https://via.placeholder.com/60",
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
    image: "https://via.placeholder.com/60",
    time: "12:45",
  },
]

function TodayTab() {
  const { colors } = useTheme()
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const dailyCalories = 2000
  const consumedCalories = 435
  const caloriesPercentage = Math.min(100, Math.round((consumedCalories / dailyCalories) * 100))

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: 16, gap: 24 }}>
        {/* Калории и макронутриенты */}
        <LinearGradient
          colors={[`${colors.primaryLight}50`, `${colors.purpleLight}50`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderRadius: 16 }]}
        >
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={[styles.subtitle, { color: colors.text }]}>Дневная цель</Text>
              <Text style={[styles.subtitle, { color: colors.text }]}>
                {consumedCalories} / {dailyCalories} ккал
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <View style={{ height: 12, backgroundColor: `${colors.muted}80`, borderRadius: 6, marginBottom: 24 }}>
                  <Animated.View
                    style={[
                      {
                        height: "100%",
                        width: `${caloriesPercentage}%`,
                        backgroundColor: colors.primary,
                        borderRadius: 6,
                      },
                    ]}
                  />
                </View>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={[styles.nutrientBox, { backgroundColor: `${colors.background}80` }]}>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>Белки</Text>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text }}>19.5г</Text>
                  </View>
                  <View style={[styles.nutrientBox, { backgroundColor: `${colors.background}80` }]}>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>Жиры</Text>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text }}>10.3г</Text>
                  </View>
                  <View style={[styles.nutrientBox, { backgroundColor: `${colors.background}80` }]}>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>Углеводы</Text>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text }}>65г</Text>
                  </View>
                </View>
              </View>

              <NutritionDonut protein={19.5} fat={10.3} carbs={65} percentage={caloriesPercentage} size={120} />
            </View>
          </View>
        </LinearGradient>

        {/* Приемы пищи */}
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Приемы пищи</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.background, borderColor: `${colors.primary}30` }]}
              onPress={() => setShowBottomSheet(true)}
            >
              <Plus width={16} height={16} color={colors.primary} />
              <Text style={{ color: colors.primary, marginLeft: 4, fontSize: 14 }}>Добавить</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12 }}>
            {foodData.map((food) => (
              <FoodItem key={food.id} food={food} />
            ))}
          </View>
        </View>

        {/* Водный баланс */}
        <WaterTracker />

        {/* AI-рекомендации */}
        <AIRecommendations />

        {/* План питания */}
        <MealPlanning />
      </View>

      <BottomSheet isVisible={showBottomSheet} onClose={() => setShowBottomSheet(false)} />
    </ScrollView>
  )
}

function HistoryTab() {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <View style={{ alignItems: "center" }}>
        <View style={[styles.iconCircle, { backgroundColor: `${colors.muted}80` }]}>
          <History width={40} height={40} color={colors.textSecondary} />
        </View>
        <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>История питания</Text>
        <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 8, paddingHorizontal: 32 }}>
          Здесь будет отображаться история ваших приемов пищи и статистика по дням
        </Text>
      </View>
    </View>
  )
}

function StatsTab() {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <View style={{ alignItems: "center" }}>
        <View style={[styles.iconCircle, { backgroundColor: `${colors.muted}80` }]}>
          <BarChart2 width={40} height={40} color={colors.textSecondary} />
        </View>
        <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>Статистика питания</Text>
        <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 8, paddingHorizontal: 32 }}>
          Здесь будут отображаться графики и аналитика вашего питания
        </Text>
      </View>
    </View>
  )
}

function TabNavigator() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: `${colors.border}80`,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="TodayTab"
        component={TodayTab}
        options={{
          tabBarLabel: "Сегодня",
          tabBarIcon: ({ color }) => <Home width={20} height={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryTab}
        options={{
          tabBarLabel: "История",
          tabBarIcon: ({ color }) => <History width={20} height={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsTab}
        options={{
          tabBarLabel: "Статистика",
          tabBarIcon: ({ color }) => <BarChart2 width={20} height={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme()
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.logoContainer}>
            <Utensils width={20} height={20} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.appTitle, { color: colors.text }]}>NutriScan</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${colors.muted}50` }]} onPress={toggleTheme}>
            {theme === "dark" ? (
              <Sun width={20} height={20} color={colors.text} />
            ) : (
              <Moon width={20} height={20} color={colors.text} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${colors.muted}50` }]}>
            <User width={20} height={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <TabNavigator />

      {/* Плавающие кнопки */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={[
            styles.floatingButton,
            styles.smallButton,
            { backgroundColor: colors.background, borderColor: `${colors.primary}30` },
          ]}
        >
          <Plus width={24} height={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatingButton, styles.largeButton]}
          onPress={() => navigation.navigate("Camera")}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={{ width: "100%", height: "100%", borderRadius: 30, justifyContent: "center", alignItems: "center" }}
          >
            <Camera width={28} height={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  nutrientBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  floatingButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  smallButton: {
    width: 56,
    height: 56,
    borderWidth: 1,
  },
  largeButton: {
    width: 64,
    height: 64,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
})

