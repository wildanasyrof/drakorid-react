import { Header } from "@/components/header"
import { TrendingSection } from "@/components/trending-section"
import { PopularSection } from "@/components/popular-section"
import { OngoingSection } from "@/components/ongoing-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TrendingSection />
        <PopularSection />
        <OngoingSection />
      </main>
    </div>
  )
}

export const metadata = {
  title: "DrakorID - Watch Korean Dramas Online",
  description: "Watch the latest Korean dramas online. Stream trending, popular, and currently airing K-dramas.",
}
