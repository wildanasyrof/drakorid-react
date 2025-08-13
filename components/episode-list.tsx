"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Episode } from "@/lib/api"

interface EpisodeListProps {
  episodes: Episode[]
  dramaSlug: string
  isLoading: boolean
}

export function EpisodeList({ episodes, dramaSlug, isLoading }: EpisodeListProps) {
  const [overlay, setOverlay] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Episodes</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-28" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Full-page overlay */}
      {overlay && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          aria-live="polite"
          role="status"
        >
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      <h2 className="text-2xl font-bold">Episodes ({episodes.length})</h2>

      <div className="space-y-4">
        {episodes
          .slice()
          .sort((a, b) => b.eps_number - a.eps_number)
          .map((episode) => (
            <Card key={episode.eps_number} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-16 bg-muted rounded flex items-center justify-center">
                    <Play className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Episode {episode.eps_number}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Watch Episode {episode.eps_number} online
                    </p>
                  </div>

                  <Button
                    asChild
                    aria-busy={overlay}
                    className={overlay ? "pointer-events-none opacity-70" : ""}
                  >
                    <Link
                      href={`/drama/${dramaSlug}/watch/${episode.eps_number}`}
                      prefetch={false}
                      onClick={() => setOverlay(true)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {!isLoading && episodes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No episodes available</div>
      )}
    </div>
  )
}
