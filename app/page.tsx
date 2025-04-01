import FoodRecognition from "@/components/food-recognition"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="flex min-h-screen flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-background/90 dark:from-background dark:via-background/95 dark:to-background/90">
        <FoodRecognition />
      </main>
    </ThemeProvider>
  )
}

