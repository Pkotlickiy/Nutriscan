"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated from "react-native-reanimated"
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Check } from "react-native-feather"

import { useTheme } from "../context/ThemeContext"

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
  const { colors } = useTheme()
  const [currentWeek, setCurrentWeek] = useState("Эта неделя")
  const [selectedDay, setSelectedDay] = useState(0)

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

  const toggleMealCompleted = (mealIndex: number) => {
    const updatedMealPlans = [...mealPlans]
    const meal = updatedMealPlans[selectedDay].meals[mealIndex]
    meal.completed = !meal.completed
    setMealPlans(updatedMealPlans)
  }

  return (
    <LinearGradient
      colors={[`${colors.primaryLight}30`, `${colors.purpleLight}30`]}
      style={[styles.container, { borderRadius: 16 }]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <CalendarDays width={20} height={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>План питания</Text>
        </View>
        <View style={styles.weekSelector}>
          <TouchableOpacity style={styles.weekButton}>
            <ChevronLeft width={16} height={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.weekText, { color: colors.text }]}>{currentWeek}</Text>
          <TouchableOpacity style={styles.weekButton}>
            <ChevronRight width={16} height={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysContainer}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === index && { backgroundColor: `${colors.primary}20` }]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[styles.dayText, { color: colors.textSecondary }]}>{day}</Text>
            <Text style={[styles.dateText, { color: selectedDay === index ? colors.primary : colors.text }]}>
              {index + 15}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.mealsContainer}>
        <Text style={[styles.dayTitle, { color: colors.textSecondary }]}>
          {mealPlans[selectedDay].day}, {mealPlans[selectedDay].date}
        </Text>

        {mealPlans[selectedDay]?.meals.map((meal, index) => (
          <Animated.View
            key={`${meal.type}-${index}`}
            style={styles.mealCard}
            entering={Animated.withDelay(
              index * 100,
              Animated.withTiming(Animated.FadeInUp.build(), { duration: 300 }),
            )}
          >
            <View
              style={[styles.mealCardContent, { backgroundColor: meal.completed ? `${colors.muted}80` : colors.card }]}
            >
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  {
                    backgroundColor: meal.completed ? `${colors.success}20` : `${colors.primary}10`,
                  },
                ]}
                onPress={() => toggleMealCompleted(index)}
              >
                {meal.completed ? (
                  <Check width={16} height={16} color={colors.success} />
                ) : (
                  <View style={[styles.checkCircle, { borderColor: `${colors.primary}50` }]} />
                )}
              </TouchableOpacity>

              <View style={styles.mealInfo}>
                <Text style={[styles.mealTime, { color: colors.textSecondary }]}>
                  {meal.type} • {meal.time}
                </Text>
                <Text
                  style={[
                    styles.mealName,
                    {
                      color: colors.text,
                      textDecorationLine: meal.completed ? "line-through" : "none",
                      opacity: meal.completed ? 0.6 : 1,
                    },
                  ]}
                >
                  {meal.name}
                </Text>
                <Text style={[styles.mealCalories, { color: colors.textSecondary }]}>{meal.calories} ккал</Text>
              </View>

              <TouchableOpacity style={styles.mealAction}>
                <Plus width={16} height={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}

        <TouchableOpacity style={[styles.addButton, { borderColor: `${colors.primary}30` }]}>
          <Plus width={16} height={16} color={colors.primary} />
          <Text style={[styles.addButtonText, { color: colors.primary }]}>Добавить прием пищи</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
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
  weekSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  weekButton: {
    padding: 4,
  },
  weekText: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  daysContainer: {
    paddingBottom: 16,
  },
  dayButton: {
    width: 48,
    height: 64,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  dayText: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  mealsContainer: {
    gap: 12,
  },
  dayTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  mealCard: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  mealCardContent: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  mealInfo: {
    flex: 1,
  },
  mealTime: {
    fontSize: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "500",
  },
  mealCalories: {
    fontSize: 12,
  },
  mealAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    marginLeft: 8,
  },
})

