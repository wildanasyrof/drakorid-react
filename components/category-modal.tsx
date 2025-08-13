"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Grid3X3, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchCategories, type Category } from "@/lib/api"

export function CategoryModal() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      loadCategories()
    }
  }, [isOpen, categories.length])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch (error) {
      console.error("Failed to load categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Grid3X3 className="h-4 w-4" />
          Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Browse Categories</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading categories...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 text-left hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No categories available</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
