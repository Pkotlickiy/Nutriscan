"use client"

import { useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Dimensions } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from "react-native-reanimated"
import { X, Search, Camera, Clock, Barcode, Sparkles, Mic } from "react-native-feather"

import { useTheme } from "../context/ThemeContext"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50

type BottomSheetProps = {
  isVisible: boolean
  onClose: () => void
}

export default function BottomSheet({ isVisible, onClose }: BottomSheetProps) {
  const { colors } = useTheme()
  const translateY = useSharedValue(0)
  const context = useSharedValue({ y: 0 })
  const active = useSharedValue(false)

  const scrollRef = useRef<ScrollView>(null)

  const popularFoods = [
    "Яблоко",
    "Банан",
    "Куриная грудка",
    "Овсянка",
    "Греческий йогурт",
    "Авокадо",
    "Лосось",
    "Киноа",
    "Брокколи",
    "Яйца",
    "Миндаль",
    "Черника",
  ]

  const recentFoods = [
    { name: "Греческий салат", time: "Вчера, 19:30" },
    { name: "Овсянка с ягодами", time: "Сегодня, 08:15" },
    { name: "Куриная грудка с овощами", time: "Вчера, 13:45" },
  ]

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(-SCREEN_HEIGHT / 1.5, { damping: 50 })
      active.value = true
    } else {
      translateY.value = withSpring(0, { damping: 50 })
      active.value = false
    }
  }, [isVisible])

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value }
    })
    .onUpdate((event) => {
      translateY.value = Math.max(MAX_TRANSLATE_Y, context.value.y + event.translationY)
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        translateY.value = withSpring(0, { damping: 50 })
        runOnJS(onClose)()
      } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 })
      } else {
        translateY.value = withSpring(-SCREEN_HEIGHT / 1.5, { damping: 50 })
      }
    })

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 1 : 0),
      display: active.value ? "flex" : "none",
    }
  })

  return (
    <>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        onTouchStart={() => {
          translateY.value = withSpring(0, { damping: 50 })
          runOnJS(onClose)()
        }}
      />

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, bottomSheetStyle, { backgroundColor: colors.background }]}>
          <View style={styles.line} />

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Добавить продукт</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X width={20} height={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search width={16} height={16} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                placeholder="Поиск продуктов..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.searchInput, { color: colors.text, backgroundColor: `${colors.muted}50` }]}
              />
              <TouchableOpacity style={styles.micButton}>
                <Mic width={16} height={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity style={[styles.optionButton, { borderColor: `${colors.primary}30` }]}>
                <Camera width={20} height={20} color={colors.primary} />
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Камера</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>Сфотографировать</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.optionButton, { borderColor: `${colors.primary}30` }]}>
                <Barcode width={20} height={20} color={colors.primary} />
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Штрих-код</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>Сканировать</Text>
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock width={16} height={16} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Недавние</Text>
                </View>

                <View style={styles.recentItemsContainer}>
                  {recentFoods.map((food, index) => (
                    <TouchableOpacity key={index} style={[styles.recentItem, { backgroundColor: `${colors.muted}50` }]}>
                      <View style={[styles.recentItemIcon, { backgroundColor: `${colors.primary}10` }]}>
                        <Clock width={16} height={16} color={colors.primary} />
                      </View>
                      <View>
                        <Text style={[styles.recentItemName, { color: colors.text }]}>{food.name}</Text>
                        <Text style={[styles.recentItemTime, { color: colors.textSecondary }]}>{food.time}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Sparkles width={16} height={16} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Популярные продукты</Text>
                </View>

                <View style={styles.popularItemsContainer}>
                  {popularFoods.map((food, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.popularItem, { borderColor: `${colors.textSecondary}20` }]}
                    >
                      <Text style={[styles.popularItemText, { color: colors.text }]}>{food}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ height: 100 }} />
            </ScrollView>
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  line: {
    width: 48,
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignSelf: "center",
    marginTop: 8,
    borderRadius: 3,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 40,
    fontSize: 16,
  },
  micButton: {
    position: "absolute",
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionTextContainer: {
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  recentItemsContainer: {
    gap: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  recentItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentItemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  recentItemTime: {
    fontSize: 12,
  },
  popularItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  popularItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  popularItemText: {
    fontSize: 14,
  },
})

