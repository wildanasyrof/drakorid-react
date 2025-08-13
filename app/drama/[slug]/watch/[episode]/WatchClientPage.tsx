"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { DramaDetail, Episode } from "@/lib/api"

interface WatchClientPageProps {
  drama: DramaDetail
  episode: Episode
  allEpisodes: Episode[]
}

export function WatchClientPage({ drama, episode, allEpisodes }: WatchClientPageProps) {
  const router = useRouter()

  const navigateEpisode = (direction: "prev" | "next") => {
    const newEpisodeNumber = direction === "prev" ? episode.eps_number - 1 : episode.eps_number + 1
    const targetEpisode = allEpisodes.find((ep) => ep.eps_number === newEpisodeNumber)

    if (targetEpisode) {
      router.push(`/drama/${drama.slug}/watch/${newEpisodeNumber}`)
    }
  }

  const canGoPrev = episode.eps_number > 1
  const canGoNext = episode.eps_number < Math.max(...allEpisodes.map((ep) => ep.eps_number))

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <VideoPlayer episode={episode} dramaTitle={drama.title} episodeNumber={episode.eps_number} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-2">
              {drama.title} - Episode {episode.eps_number}
            </h1>
            <p className="text-muted-foreground mb-4">{drama.synopsis || "No synopsis available."}</p>

            <div className="flex gap-2 mb-6">
              <Button variant="outline" onClick={() => navigateEpisode("prev")} disabled={!canGoPrev} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button variant="outline" onClick={() => navigateEpisode("next")} disabled={!canGoNext} className="gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Episodes:</strong> {drama.episodes}
                </p>
                <p>
                  <strong>Aired:</strong> {drama.aired}
                </p>
                {drama.duration && (
                  <p>
                    <strong>Duration:</strong> {drama.duration}
                  </p>
                )}
              </div>
              <div>
                <p>
                  <strong>Country:</strong> {drama.country}
                </p>
                <p>
                  <strong>Language:</strong> {drama.language}
                </p>
                {drama.network && drama.network.length > 0 && (
                  <p>
                    <strong>Network:</strong> {drama.network.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Episodes</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allEpisodes
                .sort((a, b) => b.eps_number - a.eps_number)
                .map((ep) => (
                  <Button
                    key={ep.eps_number}
                    variant={ep.eps_number === episode.eps_number ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => router.push(`/drama/${drama.slug}/watch/${ep.eps_number}`)}
                  >
                    Episode {ep.eps_number}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
