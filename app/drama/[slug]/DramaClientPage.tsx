"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { DramaHero } from "@/components/drama-hero"
import { DramaInfo } from "@/components/drama-info"
import { EpisodeList } from "@/components/episode-list"
import { getDramaEpisodes, type DramaDetail, type Episode } from "@/lib/api"

interface DramaClientPageProps {
  drama: DramaDetail
}

export function DramaClientPage({ drama }: DramaClientPageProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const data = await getDramaEpisodes(drama.slug)
        setEpisodes(data)
      } catch (error) {
        console.error("Failed to fetch episodes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEpisodes()
  }, [drama.slug])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <DramaHero drama={drama} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EpisodeList episodes={episodes} dramaSlug={drama.slug} isLoading={isLoading} />
            </div>
            <div>
              <DramaInfo drama={drama} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
