"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface DramaCardProps {
  slug: string
  title: string
  imageUrl: string
  episode?: string
  fixedWidth?: boolean
}

export function DramaCard({ slug, title, imageUrl, episode, fixedWidth }: DramaCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setLoading(true)
    router.push(`/drama/${slug}`)
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      <div
        className={`${fixedWidth ? "w-[140px] flex-shrink-0" : "w-full"} cursor-pointer`}
        onClick={handleClick}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg?height=187&width=140"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes={fixedWidth ? "140px" : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"}
            />
            {episode && (
              <Badge className="absolute top-1 right-1 bg-primary/90 text-primary-foreground text-xs px-1.5 py-0.5">
                Ep {episode}
              </Badge>
            )}
          </div>
          <CardContent className="p-2 flex-1 flex items-start">
            <h3 className="font-medium text-xs sm:text-sm line-clamp-2 hover:text-primary transition-colors leading-tight">
              {title}
            </h3>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
