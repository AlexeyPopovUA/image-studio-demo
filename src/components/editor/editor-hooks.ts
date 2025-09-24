import {useCallback, useEffect, useRef, useState} from "react";
import {getImageInfo, getImageUrl, ImageSettings, PicsumImage} from "@/lib/picsum-api";


const BASE_DEFAULT_SETTINGS: ImageSettings = {
  width: 800,
  height: 600,
  grayscale: false,
  blur: 0,
}

function computeDefaultSettings(image: PicsumImage): ImageSettings {
  const aspectRatio = image.width / image.height
  const width = BASE_DEFAULT_SETTINGS.width
  const height = Math.max(1, Math.round(width / aspectRatio))

  return {
    ...BASE_DEFAULT_SETTINGS,
    width,
    height,
  }
}

function settingsAreEqual(a: ImageSettings, b: ImageSettings) {
  return (
    a.width === b.width &&
    a.height === b.height &&
    a.grayscale === b.grayscale &&
    a.blur === b.blur
  )
}

type ImageStatus = "idle" | "loading" | "ready" | "missing"

function getStorageKey(imageId: string) {
  return `image-settings-${imageId}`
}

function removeStoredSettings(imageId: string) {
  try {
    localStorage.removeItem(getStorageKey(imageId))
  } catch (error) {
    console.error("Failed to remove saved settings:", error)
  }
}


export function useEditorState(id: string | null) {
  const [imageInfo, setImageInfo] = useState<PicsumImage | null>(null)
  const [settings, setSettings] = useState<ImageSettings>(BASE_DEFAULT_SETTINGS)
  const [imageStatus, setImageStatus] = useState<ImageStatus>("idle")
  const defaultSettingsRef = useRef<ImageSettings>(BASE_DEFAULT_SETTINGS)

  const processedImageUrl = imageInfo ? getImageUrl(imageInfo.id, settings.width, settings.height, {
    grayscale: settings.grayscale,
    blur: settings.blur,
  }) : ""

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    defaultSettingsRef.current = BASE_DEFAULT_SETTINGS
    setImageInfo(null)
    setImageStatus(id ? "loading" : "missing")

    if (!id) {
      setSettings({...BASE_DEFAULT_SETTINGS})
      return () => controller.abort()
    }

    const storageKey = getStorageKey(id)
    let storedSettings: ImageSettings | null = null

    try {
      const savedSettings = localStorage.getItem(storageKey)

      if (savedSettings) {
        storedSettings = JSON.parse(savedSettings) as ImageSettings
        setSettings(storedSettings)
      } else {
        setSettings({...BASE_DEFAULT_SETTINGS})
      }
    } catch (error) {
      console.error("Failed to load saved settings:", error)
      setSettings({...BASE_DEFAULT_SETTINGS})
    }

    const fetchImageInfo = async () => {
      try {
        const image = await getImageInfo(id, signal)
        if (signal.aborted) {
          return
        }

        if (!image) {
          defaultSettingsRef.current = BASE_DEFAULT_SETTINGS
          setSettings({...BASE_DEFAULT_SETTINGS})
          setImageStatus("missing")
          return
        }

        const defaults = computeDefaultSettings(image)
        defaultSettingsRef.current = defaults
        setImageInfo(image)
        setImageStatus("ready")

        if (!storedSettings) {
          setSettings({...defaults})
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Failed to load image info:", error)
          setSettings({...BASE_DEFAULT_SETTINGS})
          setImageStatus("missing")
        }
      }
    }

    void fetchImageInfo()

    return () => {
      controller.abort()
    }
  }, [id])

  const persistSettings = useCallback((next: ImageSettings) => {
    if (!id) {
      return
    }

    const defaults = defaultSettingsRef.current
    const storageKey = getStorageKey(id)

    if (settingsAreEqual(next, defaults)) {
      removeStoredSettings(id)
      return
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }, [id])

  const updateSettings = useCallback((updates: Partial<ImageSettings>) => {
    setSettings((prev: ImageSettings) => {
      const next = {...prev, ...updates}

      if (settingsAreEqual(prev, next)) {
        return prev
      }

      persistSettings(next)
      return next
    })
  }, [persistSettings])

  const resetSettings = useCallback(() => {
    const defaults = defaultSettingsRef.current
    persistSettings(defaults)
    setSettings({...defaults})
  }, [persistSettings])

  return [processedImageUrl, imageInfo, settings, updateSettings, resetSettings, imageStatus] as const
}
