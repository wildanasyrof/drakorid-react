"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { getPopularDramas, type DramaListItem } from "@/lib/api"
import { DramaCard } from "@/components/drama-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Star } from "lucide-react"

export default function PopularPage() {
  const [dramas, setDramas] = useState<DramaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadPopularDramas(1, true)
  }, [])

  const loadPopularDramas = async (pageNum: number, reset = false) => {
    if (reset) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const result = await getPopularDramas(pageNum)

      if (reset) {
        setDramas(result)
      } else {
        setDramas((prev) => [...prev, ...result])
      }

      setHasMore(result.length > 0)
      setCurrentPage(pageNum)
    } catch (error) {
      console.error("Error loading popular dramas:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadPopularDramas(currentPage + 1)
    }
  }, [currentPage, loadingMore, hasMore])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMore])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Star className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Popular Dramas</h1>
            <p className="text-muted-foreground mt-1">Most popular Korean dramas</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : dramas.length > 0 ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
              {dramas.map((drama, index) => (
                <DramaCard
                  key={`${drama.slug}-${index}`}
                  slug={drama.slug}
                  title={drama.title}
                  imageUrl={drama.img_url}
                />
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading more...</span>
              </div>
            )}

            {!hasMore && dramas.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">No more dramas to load</div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No popular dramas found</p>
          </div>
        )}
      </main>
    </div>
  )
}
