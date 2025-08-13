import { notFound } from "next/navigation"
import { getDramaDetail, getDramaEpisodes } from "@/lib/api"
import { WatchClientPage } from "./WatchClientPage"

interface PageProps {
  params: Promise<{ slug: string; episode: string }>
}

export default async function WatchPage({ params }: PageProps) {
  const { slug, episode } = await params
  const episodeNumber = Number.parseInt(episode)

  if (isNaN(episodeNumber) || episodeNumber < 1) {
    notFound()
  }

  try {
    const [drama, episodes] = await Promise.all([getDramaDetail(slug), getDramaEpisodes(slug)])

    if (!drama) {
      notFound()
    }

    const episodeData = episodes.find((ep) => ep.eps_number === episodeNumber)
    if (!episodeData) {
      notFound()
    }

    return <WatchClientPage drama={drama} episode={episodeData} allEpisodes={episodes} />
  } catch (error) {
    console.error("Error loading watch page:", error)
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { slug, episode } = await params
    const drama = await getDramaDetail(slug)
    const episodeNumber = Number.parseInt(episode)

    return {
      title: drama?.title
        ? `${drama.title} - Episode ${episodeNumber} - DrakorID`
        : `Episode ${episodeNumber} - DrakorID`,
      description: drama?.synopsis || "Watch Korean drama episodes online",
      openGraph: {
        title: drama?.title ? `${drama.title} - Episode ${episodeNumber}` : `Episode ${episodeNumber}`,
        description: drama?.synopsis || "Watch Korean drama episodes online",
        images: drama?.image ? [drama.image] : [],
      },
    }
  } catch (error) {
    return {
      title: "Watch Episode - DrakorID",
      description: "Watch Korean drama episodes online",
    }
  }
}
