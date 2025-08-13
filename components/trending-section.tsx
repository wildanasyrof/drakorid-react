"use client"

import { useState, useEffect, useRef } from "react"
import { DramaCard } from "./drama-card"
import { getTrendingDramas, type DramaListItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TrendingSection() {
  const [dramas, setDramas] = useState<DramaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">("today")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadTrendingDramas(activeTab)
  }, [activeTab])

  const loadTrendingDramas = async (time: "today" | "week" | "month") => {
    setLoading(true)
    try {
      const result = await getTrendingDramas(time)
      setDramas(result)
    } catch (error) {
      console.error("Error loading trending dramas:", error)
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
    }
  }

  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Trending Now</h2>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "today" | "week" | "month")}
        className="mb-4"
      >
        <TabsList className="h-8">
          <TabsTrigger value="today" className="text-xs px-3">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="text-xs px-3">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" className="text-xs px-3">
            This Month
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-[140px] flex-shrink-0 space-y-2">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))
            : dramas.map((drama) => (
              <DramaCard
                key={drama.slug}
                slug={drama.slug}
                title={drama.title}
                imageUrl={drama.img_url}
                fixedWidth // ✅ keeps size consistent in horizontal scroll
              />
            ))}
        </div>
      </div>
    </section>
  )
}
