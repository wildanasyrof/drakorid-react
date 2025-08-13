import { notFound } from "next/navigation"
import { getDramaDetail } from "@/lib/api"
import { DramaClientPage } from "./DramaClientPage"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DramaPage({ params }: PageProps) {
  const { slug } = await params
  const drama = await getDramaDetail(slug)

  if (!drama) {
    notFound()
  }

  return <DramaClientPage drama={drama} />
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const drama = await getDramaDetail(slug)

  if (!drama) {
    return {
      title: "Drama Not Found - DrakorID",
      description: "The requested drama could not be found.",
    }
  }

  return {
    title: `${drama.title} - DrakorID`,
    description: drama.synopsis || `Watch ${drama.title} Korean drama online`,
    openGraph: {
      title: drama.title,
      description: drama.synopsis || `Watch ${drama.title} Korean drama online`,
      images: [{ url: drama.image }],
    },
  }
}
