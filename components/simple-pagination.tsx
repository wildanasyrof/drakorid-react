"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SimplePaginationProps {
  currentPage: number
  hasResults: boolean
  basePath: string
}

export function SimplePagination({ currentPage, hasResults, basePath }: SimplePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `${basePath}?${params.toString()}`
  }

  const goToPage = (page: number) => {
    router.push(createPageUrl(page))
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="px-4 py-2 text-sm text-muted-foreground">Page {currentPage}</span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasResults}
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
