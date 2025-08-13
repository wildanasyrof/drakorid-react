"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Plus, Loader2 } from "lucide-react"
import type { DramaDetail } from "@/lib/api"

interface DramaHeroProps {
  drama: DramaDetail
}

export function DramaHero({ drama }: DramaHeroProps) {
  const [overlay, setOverlay] = useState(false)

  const genres = Array.isArray(drama.genres) ? drama.genres : []
  const episodes =
    typeof drama.episodes === "number" && drama.episodes > 0
      ? `${drama.episodes} episodes`
      : "Episodes N/A"

  return (
    <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
      {/* Full-page overlay */}
      {overlay && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      <Image
        src={drama.image || "/placeholder.svg?height=600&width=1200"}
        alt={drama.title || "Drama poster"}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {drama.title || "Untitled"}
            </h1>

            {drama.original_title &&
              drama.original_title !== drama.title && (
                <p className="text-white/80 text-lg mb-2">{drama.original_title}</p>
              )}

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {drama.aired && <span className="text-white">{drama.aired}</span>}
              <span className="text-white">{episodes}</span>
              {drama.duration && <span className="text-white">{drama.duration}</span>}
              {drama.country && <Badge variant="secondary">{drama.country}</Badge>}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="text-white border-white/30"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {drama.synopsis && (
              <p className="text-white/90 text-lg mb-6 line-clamp-3">
                {drama.synopsis}
              </p>
            )}

            <div className="flex gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link
                  href={`/drama/${drama.slug}/watch/1`}
                  prefetch={false}
                  onClick={() => setOverlay(true)}
                >
                  <Play className="h-5 w-5" />
                  Watch Now
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-white border-white/30 hover:bg-white/10 bg-transparent"
              >
                <Plus className="h-5 w-5" />
                Add to List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
