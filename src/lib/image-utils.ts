import {PicsumImage} from "@/lib/picsum-api";

export interface ImageSettings {
  width: number
  height: number
  grayscale: boolean
  blur: number
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
