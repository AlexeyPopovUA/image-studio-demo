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

  static async getImageInfo(id: string, signal: AbortSignal): Promise<PicsumImage | null> {
    try {
      const response = await fetch(`${BASE_URL}/id/${id}/info`, {signal})

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to fetch image info:", error)
      return null
    }
  }

  static getImageUrl(
    id: string,
    width = 800,
    height = 600,
    options?: {
      grayscale?: boolean
      blur?: number
    },
  ): string {
    let url = `${BASE_URL}/id/${id}/${width}/${height}`

    const params = new URLSearchParams()

    if (options?.grayscale) {
      params.append("grayscale", "")
    }

    if (options?.blur && options.blur > 0) {
      params.append("blur", options.blur.toString())
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    return url
  }

  static getThumbnailUrl(id: string, size = 300): string {
    return `${BASE_URL}/id/${id}/${size}/${size}`
  }
}
