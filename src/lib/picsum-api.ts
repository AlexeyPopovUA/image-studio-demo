export type PicsumImage = {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export type PaginatedResponse = {
  images: PicsumImage[]
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
}

export type ImageSettings = {
  width: number
  height: number
  grayscale: boolean
  blur: number
}

const BASE_URL = "https://picsum.photos"
const ITEMS_PER_PAGE = 6

export async function getImages(page = 1, limit: number = ITEMS_PER_PAGE, signal: AbortSignal): Promise<PaginatedResponse> {
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

export async function getImageInfo(id: string, signal: AbortSignal): Promise<PicsumImage | null> {
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

export function getImageUrl(
  id: string,
  width = 1200,
  height = 900,
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

export function getThumbnailUrl(id: string, size = 300): string {
  return `${BASE_URL}/id/${id}/${size}/${size}`
}

export function getDownloadUrl(imageId: string, settings: ImageSettings): string {
  const baseUrl = `https://picsum.photos/id/${imageId}/${settings.width}/${settings.height}`
  const params = new URLSearchParams()

  if (settings.grayscale) {
    params.append("grayscale", "")
  }

  if (settings.blur > 0) {
    params.append("blur", settings.blur.toString())
  }

  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
}

export async function downloadImage(imageInfo: PicsumImage, settings: ImageSettings) {
  try {
    const downloadUrl = getDownloadUrl(imageInfo.id, settings)
    const response = await fetch(downloadUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `photo-${imageInfo.id}-by-${imageInfo.author.replace(/\s+/g, "-")}-edited.jpg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Failed to download image:", error)
  }
}
