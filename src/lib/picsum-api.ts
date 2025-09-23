export interface PicsumImage {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export interface PaginatedResponse {
  images: PicsumImage[]
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
}

const BASE_URL = "https://picsum.photos"
const ITEMS_PER_PAGE = 6

export class PicsumAPI {
  static async getImages(page = 1, limit: number = ITEMS_PER_PAGE, signal: AbortSignal): Promise<PaginatedResponse> {
    try {
      const response = await fetch(`${BASE_URL}/v2/list?page=${page}&limit=${limit}`, {signal})

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const images: PicsumImage[] = await response.json()

      // Parse Link header for pagination info
      const linkHeader = response.headers.get("Link")
      const hasNext = linkHeader?.includes('rel="next"') || false
      const hasPrev = page > 1

      return {
        images,
        currentPage: page,
        hasNext,
        hasPrev,
      }
    } catch (error) {
      console.error("Failed to fetch images:", error)
      throw error
    }
  }

  static getThumbnailUrl(id: string, size = 300): string {
    return `${BASE_URL}/id/${id}/${size}/${size}`
  }
}
