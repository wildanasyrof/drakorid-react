"use client"

import { useState, useEffect, useRef } from "react"
import { DramaCard } from "./drama-card"
import { getOngoingDramas, type DramaListItemWithEpisode } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import Link from "next/link"

export function OngoingSection() {
  const [dramas, setDramas] = useState<DramaListItemWithEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadOngoingDramas()
  }, [])

  const loadOngoingDramas = async () => {
    setLoading(true)
    try {
      const result = await getOngoingDramas(1)
      setDramas(result)
    } catch (error) {
      console.error("Error loading ongoing dramas:", error)
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
          <Play className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Currently Airing</h2>
        </div>
        <Link href="/currently-airing">
          <Button variant="outline" size="sm" className="h-8 text-xs px-3 bg-transparent">
            View All
          </Button>
        </Link>
      </div>

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
                  <Skeleton className="h-2 w-1/2" />
                </div>
              ))
            : dramas.map((drama) => (
                <DramaCard
                  key={drama.slug}
                  slug={drama.slug}
                  title={drama.title}
                  imageUrl={drama.img_url}
                  episode={drama.episode}
                  fixedWidth
                />
              ))}
        </div>
      </div>
    </section>
  )
}
