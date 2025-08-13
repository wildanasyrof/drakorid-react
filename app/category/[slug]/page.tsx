import { fetchCategories } from "@/lib/api"
import { CategoryClientPage } from "./CategoryClientPage"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  try {
    const categories = await fetchCategories()
    const category = categories.find((c) => c.slug === slug)

    if (!category) {
      notFound()
    }

    return <CategoryClientPage params={{ slug }} />
  } catch (error) {
    console.error("Error loading category page:", error)
    notFound()
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const { slug } = await params
    const categories = await fetchCategories()
    const category = categories.find((c) => c.slug === slug)

    return {
      title: category?.name ? `${category.name} - DrakorID` : "Category - DrakorID",
      description: `Browse ${category?.name || "category"} Korean dramas`,
      openGraph: {
        title: category?.name ? `${category.name} Dramas` : "Category Dramas",
        description: `Browse ${category?.name || "category"} Korean dramas`,
      },
    }
  } catch (error) {
    return {
      title: "Category - DrakorID",
      description: "Browse Korean dramas by category",
    }
  }
}
