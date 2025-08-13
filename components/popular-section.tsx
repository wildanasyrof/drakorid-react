"use client"

import { useState, useEffect, useRef } from "react"
import { DramaCard } from "./drama-card"
import { getPopularDramas, type DramaListItem } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Link from "next/link"

export function PopularSection() {
  const [dramas, setDramas] = useState<DramaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPopularDramas()
  }, [])

  const loadPopularDramas = async () => {
    setLoading(true)
    try {
      const result = await getPopularDramas(1)
      setDramas(result)
    } catch (error) {
      console.error("Error loading popular dramas:", error)
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
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Popular Dramas</h2>
        </div>
        <Link href="/popular">
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
