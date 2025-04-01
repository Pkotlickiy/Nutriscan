"use client"

import { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import Svg, { Circle, G, Text as SvgText } from "react-native-svg"
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from "react-native-reanimated"

import { useTheme } from "../context/ThemeContext"

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type NutritionDonutProps = {
  protein: number
  fat: number
  carbs: number
  percentage: number
  size: number
}

export default function NutritionDonut({ protein, fat, carbs, percentage, size }: NutritionDonutProps) {
  const { colors } = useTheme()
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius

  const total = protein + fat + carbs
  const proteinAngle = (protein / total) * 360
  const fatAngle = (fat / total) * 360
  const carbsAngle = (carbs / total) * 360

  const proteinStroke = useSharedValue(0)
  const fatStroke = useSharedValue(0)
  const carbsStroke = useSharedValue(0)

  useEffect(() => {
    proteinStroke.value = withTiming((proteinAngle / 360) * circumference, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })

    fatStroke.value = withTiming((fatAngle / 360) * circumference, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })

    carbsStroke.value = withTiming((carbsAngle / 360) * circumference, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
  }, [protein, fat, carbs])

  const proteinProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - proteinStroke.value,
    }
  })

  const fatProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - fatStroke.value,
    }
  })

  const carbsProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - carbsStroke.value,
    }
  })

  const getCoordinatesForAngle = (angle: number) => {
    const x = radius * Math.cos((angle * Math.PI) / 180)
    const y = radius * Math.sin((angle * Math.PI) / 180)
    return { x: x + size / 2, y: y + size / 2 }
  }

  const proteinStart = getCoordinatesForAngle(-90)
  const proteinEnd = getCoordinatesForAngle(-90 + proteinAngle)
  const fatStart = getCoordinatesForAngle(-90 + proteinAngle)
  const fatEnd = getCoordinatesForAngle(-90 + proteinAngle + fatAngle)
  const carbsStart = getCoordinatesForAngle(-90 + proteinAngle + fatAngle)
  const carbsEnd = getCoordinatesForAngle(-90 + proteinAngle + fatAngle + carbsAngle)

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Protein Segment */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.purple}
            strokeWidth={20}
            strokeDasharray={circumference}
            animatedProps={proteinProps}
            strokeLinecap="round"
            fill="transparent"
          />

          {/* Fat Segment */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EC4899"
            strokeWidth={20}
            strokeDasharray={circumference}
            animatedProps={fatProps}
            strokeLinecap="round"
            fill="transparent"
            rotation={proteinAngle}
            origin={`${size / 2}, ${size / 2}`}
          />

          {/* Carbs Segment */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.blue}
            strokeWidth={20}
            strokeDasharray={circumference}
            animatedProps={carbsProps}
            strokeLinecap="round"
            fill="transparent"
            rotation={proteinAngle + fatAngle}
            origin={`${size / 2}, ${size / 2}`}
          />
        </G>

        {/* Inner Circle */}
        <Circle cx={size / 2} cy={size / 2} r={radius - 15} fill="white" />

        {/* Percentage Text */}
        <SvgText x={size / 2} y={size / 2 + 6} fontSize="20" fontWeight="bold" fill={colors.text} textAnchor="middle">
          {percentage}%
        </SvgText>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
})

