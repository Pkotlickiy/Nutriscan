"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import { lightColors, darkColors, type Colors } from "../styles/colors"

type ThemeContextType = {
  theme: "light" | "dark"
  colors: Colors
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colors: lightColors,
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme()
  const [theme, setTheme] = useState<"light" | "dark">(deviceTheme === "dark" ? "dark" : "light")

  useEffect(() => {
    // Можно добавить логику для загрузки сохраненной темы из AsyncStorage
  }, [])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const colors = theme === "light" ? lightColors : darkColors

  return <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>{children}</ThemeContext.Provider>
}

