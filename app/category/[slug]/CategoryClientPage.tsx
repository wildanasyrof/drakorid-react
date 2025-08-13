"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { fetchDramasByCategory, fetchCategories, type DramaListItem, type Category } from "@/lib/api"
import { DramaCard } from "@/components/drama-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface CategoryClientPageProps {
  params: { slug: string }
}

export function CategoryClientPage({ params }: CategoryClientPageProps) {
  const [dramas, setDramas] = useState<DramaListItem[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadCategoryData()
  }, [params.slug])

  const loadCategoryData = async () => {
    try {
      const categories = await fetchCategories()
      const foundCategory = categories.find((c) => c.slug === params.slug)
      setCategory(foundCategory || null)

      if (foundCategory) {
        loadDramas(1, true)
      }
    } catch (error) {
      console.error("Error loading category:", error)
      setLoading(false)
    }
  }

  const loadDramas = async (pageNum: number, reset = false) => {
    if (reset) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const result = await fetchDramasByCategory(params.slug, pageNum)

      if (reset) {
        setDramas(result)
      } else {
        setDramas((prev) => [...prev, ...result])
      }

      setHasMore(result.length > 0)
      setCurrentPage(pageNum)
    } catch (error) {
      console.error("Error loading category dramas:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadDramas(currentPage + 1)
    }
  }, [currentPage, loadingMore, hasMore, params.slug])

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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{category?.name || "Category"}</h1>
            <p className="text-muted-foreground mt-1">Browse {category?.name || "category"} Korean dramas</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
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
            <p className="text-muted-foreground text-lg">No dramas found in this category</p>
          </div>
        )}
      </main>
    </div>
  )
}
