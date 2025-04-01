"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { Droplets, Plus, Minus } from "react-native-feather"

import { useTheme } from "../context/ThemeContext"

export default function WaterTracker() {
  const { colors } = useTheme()
  const [waterGoal, setWaterGoal] = useState(2000) // мл
  const [waterConsumed, setWaterConsumed] = useState(750) // мл

  const waterPercentage = Math.min(100, Math.round((waterConsumed / waterGoal) * 100))
  const waveOffset = useSharedValue(0)

  useEffect(() => {
    waveOffset.value = withRepeat(withTiming(400, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [])

  const addWater = (amount: number) => {
    setWaterConsumed((prev) => Math.min(prev + amount, waterGoal * 1.5))
  }

  const removeWater = (amount: number) => {
    setWaterConsumed((prev) => Math.max(prev - amount, 0))
  }

  const waveStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: waveOffset.value }],
    }
  })

  const heightStyle = useAnimatedStyle(() => {
    return {
      height: `${waterPercentage}%`,
    }
  })

  return (
    <LinearGradient
      colors={[`${colors.blueLight}50`, `${colors.blue}20`]}
      style={[styles.container, { borderRadius: 16 }]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Droplets width={20} height={20} color={colors.blue} />
          <Text style={[styles.title, { color: colors.text }]}>Водный баланс</Text>
        </View>
        <Text style={[styles.waterAmount, { color: colors.text }]}>
          {waterConsumed} / {waterGoal} мл
        </Text>
      </View>

      <View style={styles.trackerContainer}>
        <View style={[styles.waterContainer, { backgroundColor: `${colors.blueLight}50` }]}>
          <Animated.View style={[styles.waterFill, heightStyle, { backgroundColor: colors.blue }]}>
            <Animated.View style={[styles.waterWave, waveStyle]} />
          </Animated.View>
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentageText, { color: waterPercentage > 50 ? "#FFFFFF" : colors.blue }]}>
              {waterPercentage}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        {[200, 300, 500].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.amountButton, { borderColor: `${colors.blue}30` }]}
            onPress={() => addWater(amount)}
          >
            <Text style={[styles.amountText, { color: colors.blue }]}>+{amount} мл</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, { borderColor: `${colors.blue}30` }]}
          onPress={() => removeWater(200)}
        >
          <Minus width={16} height={16} color={colors.blue} />
        </TouchableOpacity>

        <View style={styles.indicatorsContainer}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                {
                  height: i < Math.floor(waterConsumed / (waterGoal / 8)) ? 4 : 2,
                  backgroundColor: i < Math.floor(waterConsumed / (waterGoal / 8)) ? colors.blue : `${colors.blue}30`,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.controlButton, { borderColor: `${colors.blue}30` }]}
          onPress={() => addWater(200)}
        >
          <Plus width={16} height={16} color={colors.blue} />
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
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  waterAmount: {
    fontSize: 14,
    fontWeight: "500",
  },
  trackerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  waterContainer: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  waterFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#3B82F6",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
  },
  waterWave: {
    position: "absolute",
    top: -10,
    left: -200,
    width: 400,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 100,
  },
  percentageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  amountButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "500",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  indicator: {
    width: 24,
    borderRadius: 2,
  },
})

