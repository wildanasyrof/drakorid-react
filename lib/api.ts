import { BASE_URL } from "@/lib/config"

// Types based on the API documentation
export interface DramaListItem {
  slug: string
  img_url: string
  title: string
}

export interface DramaListItemWithEpisode extends DramaListItem {
  episode: string
}

export interface Category {
  name: string
  slug: string
}

export interface DramaDetail {
  slug: string
  title: string
  image: string
  original_title: string
  native_title: string
  director: string[]
  writer: string[]
  network: string[]
  genres: string[]
  episodes: number
  aired: string
  duration: string | null
  language: string
  country: string
  synopsis: string
}

export interface Episode {
  eps_number: number
  url: {
    "360": string
    "480": string
    "720": string
  }
}

export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

// API Functions
export async function getTrendingDramas(time: "today" | "week" | "month" = "today"): Promise<DramaListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/drama/status/trending?time=${time}`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch trending dramas")
    }

    const result: ApiResponse<DramaListItem[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching trending dramas:", error)
    return []
  }
}

export async function getPopularDramas(page = 1): Promise<DramaListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/drama/status/popular?page=${page}`, {
      next: { revalidate: 600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch popular dramas")
    }

    const result: ApiResponse<DramaListItem[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching popular dramas:", error)
    return []
  }
}

export async function getOngoingDramas(page = 1): Promise<DramaListItemWithEpisode[]> {
  try {
    const response = await fetch(`${BASE_URL}/drama/status/on-going?page=${page}`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch ongoing dramas")
    }

    const result: ApiResponse<DramaListItemWithEpisode[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching ongoing dramas:", error)
    return []
  }
}

export async function getNewReleaseDramas(page = 1): Promise<DramaListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/drama/status/new-release?page=${page}`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch new release dramas")
    }

    const result: ApiResponse<DramaListItem[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching new release dramas:", error)
    return []
  }
}

export async function searchDramas(query: string, page = 1): Promise<DramaListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/drama?search=${encodeURIComponent(query)}&page=${page}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error("Failed to search dramas")
    }

    const result: ApiResponse<DramaListItem[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error searching dramas:", error)
    return []
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${BASE_URL}/category`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }

    const result: ApiResponse<Category[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function fetchDramasByCategory(category: string, page = 1): Promise<DramaListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/drama?category=${encodeURIComponent(category)}&page=${page}`, {
      next: { revalidate: 600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch dramas by category")
    }

    const result: ApiResponse<DramaListItem[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching dramas by category:", error)
    return []
  }
}

export async function getDramaDetail(slug: string): Promise<DramaDetail | null> {
  try {
    const response = await fetch(`${BASE_URL}/drama/${slug}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch drama detail")
    }

    const result: ApiResponse<DramaDetail> = await response.json()
    return result.data || null
  } catch (error) {
    console.error("Error fetching drama detail:", error)
    return null
  }
}

export async function getDramaEpisodes(slug: string): Promise<Episode[]> {
  try {
    const response = await fetch(`${BASE_URL}/drama/${slug}/episodes`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch drama episodes")
    }

    const result: ApiResponse<Episode[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error("Error fetching drama episodes:", error)
    return []
  }
}
