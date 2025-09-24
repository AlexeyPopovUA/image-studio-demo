import {useEffect, useState} from "react";
import {getImageInfo, getImageUrl, ImageSettings, PicsumImage} from "@/lib/picsum-api";


export function useEditorState(id: string | null) {
  const [imageInfo, setImageInfo] = useState<PicsumImage | null>(null)
  const [settings, setSettings] = useState<ImageSettings>({
    width: 800,
    height: 600,
    grayscale: false,
    blur: 0,
  })

  const processedImageUrl = imageInfo ? getImageUrl(imageInfo.id, settings.width, settings.height, {
    grayscale: settings.grayscale,
    blur: settings.blur,
  }) : ""

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function fetchImageInfo(imageId: string) {
      const image = await getImageInfo(imageId, signal)
      setImageInfo(image)
    }

    if (typeof id === "string" && id) {
      void fetchImageInfo(id)
    }

    return () => {
      controller.abort()
    }
  }, [id])

  // Load settings from localStorage
  useEffect(() => {
    if (imageInfo?.id) {
      try {
        const savedSettings = localStorage.getItem(`image-settings-${imageInfo.id}`)
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        } else {
          const aspectRatio = imageInfo.width / imageInfo.height
          const defaultWidth = 800
          const defaultHeight = Math.round(defaultWidth / aspectRatio)

          setSettings((prev: ImageSettings) => ({
            ...prev,
            width: defaultWidth,
            height: defaultHeight,
          }))
        }
      } catch (error) {
        console.error("Failed to load saved settings:", error)
      }
    }

  }, [imageInfo?.id, imageInfo?.width, imageInfo?.height])

  // Save settings to localStorage
  useEffect(() => {
    if (imageInfo?.id) {
      try {
        localStorage.setItem(`image-settings-${imageInfo.id}`, JSON.stringify(settings))
      } catch (error) {
        console.error("Failed to save settings:", error)
      }
    }
  }, [settings, imageInfo?.id])

  function updateSettings(updates: Partial<ImageSettings>) {
    setSettings((prev: ImageSettings) => ({...prev, ...updates}))
  }

  function resetSettings() {
    if (imageInfo) {
      const aspectRatio = imageInfo.width / imageInfo.height
      const defaultWidth = 800
      const defaultHeight = Math.round(defaultWidth / aspectRatio)

      const defaultSettings: ImageSettings = {
        width: defaultWidth,
        height: defaultHeight,
        grayscale: false,
        blur: 0,
      }
      setSettings(defaultSettings)
    }
  }

  return [processedImageUrl, imageInfo, settings, updateSettings, resetSettings] as const
}
