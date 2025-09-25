import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {debounce} from "lodash-es";
import {getImageInfo, getImageUrl, ImageSettings, PicsumImage} from "@/lib/picsum-api";

// Baseline editor configuration used before image-specific defaults load.
const BASE_DEFAULT_SETTINGS: ImageSettings = {
  width: 1200,
  height: 1200,
  grayscale: false,
  blur: 0,
}

// Limit preview fetches to a smaller size while preserving aspect ratio.
const PREVIEW_MAX_DIMENSION = 1200

// Derive default settings using the source image dimensions.
function computeDefaultSettings(image: PicsumImage): ImageSettings {
  return {
    ...BASE_DEFAULT_SETTINGS,
    width: image.width,
    height: image.height
  }
}

// Lightweight equality check to avoid redundant state updates or localStorage writes.
function settingsAreEqual(a: ImageSettings, b: ImageSettings) {
  return (
    a.width === b.width &&
    a.height === b.height &&
    a.grayscale === b.grayscale &&
    a.blur === b.blur
  )
}

function enforceDimensionBounds(settings: ImageSettings, maxDimensions: ImageSettings): ImageSettings {
  const clampedWidth = Math.min(Math.max(1, settings.width), maxDimensions.width)
  const clampedHeight = Math.min(Math.max(1, settings.height), maxDimensions.height)

  if (clampedWidth === settings.width && clampedHeight === settings.height) {
    return settings
  }

  return {
    ...settings,
    width: clampedWidth,
    height: clampedHeight,
  }
}

// Determine a smaller preview size while maintaining the editor's aspect ratio.
function computePreviewDimensions(settings: ImageSettings) {
  const {width, height} = settings

  const maxDimension = Math.max(width, height)

  if (maxDimension <= PREVIEW_MAX_DIMENSION) {
    return {width, height}
  }

  if (width >= height) {
    const previewWidth = PREVIEW_MAX_DIMENSION
    const previewHeight = Math.max(1, Math.round((height / width) * previewWidth))
    return {width: previewWidth, height: previewHeight}
  }

  const previewHeight = PREVIEW_MAX_DIMENSION
  const previewWidth = Math.max(1, Math.round((width / height) * previewHeight))

  return {width: previewWidth, height: previewHeight}
}

type ImageStatus = "idle" | "loading" | "ready" | "missing"

// Namespaced key for persisting image-specific settings across sessions.
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


/**
 * Orchestrates editor state for a Picsum image, handling persistence, fetching, and derived URLs.
 */
export function useEditorState(id: string | null) {
  const [imageInfo, setImageInfo] = useState<PicsumImage | null>(null)
  const [settings, setSettings] = useState<ImageSettings>(BASE_DEFAULT_SETTINGS)
  const [processedImageUrl, setProcessedImageUrl] = useState("")
  const [imageStatus, setImageStatus] = useState<ImageStatus>("idle")
  const defaultSettingsRef = useRef<ImageSettings>(BASE_DEFAULT_SETTINGS)

  const debouncedSetProcessedImageUrl = useMemo(() => debounce(setProcessedImageUrl, 200), [])
  // Update preview scale in lock-step with user-configured dimensions.
  const previewDimensions = useMemo(() => computePreviewDimensions(settings), [settings])

  // React to image id changes: hydrate from storage, fetch metadata, and seed defaults.
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    defaultSettingsRef.current = BASE_DEFAULT_SETTINGS
    setImageInfo(null)
    setImageStatus(id ? "loading" : "missing")
    setProcessedImageUrl("")

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

  // Update the processed image URL when settings change, debounced to limit network churn.
  useEffect(() => {
    // Fetch the downsized preview variant but keep filters identical to the download image.
    const nextUrl = imageInfo?.id ? getImageUrl(imageInfo.id, previewDimensions.width, previewDimensions.height, {
      grayscale: settings.grayscale,
      blur: settings.blur,
    }) : ""

    debouncedSetProcessedImageUrl(nextUrl)

    return () => {
      debouncedSetProcessedImageUrl.cancel()
    }
  }, [debouncedSetProcessedImageUrl, imageInfo?.id, previewDimensions, previewDimensions.height, previewDimensions.width, settings.blur, settings.grayscale])

  // Persist non-default settings per image, pruning storage when returning to defaults.
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

  // Merge updates and persist meaningful changes.
  const updateSettings = useCallback((updates: Partial<ImageSettings>) => {
    setSettings((prev: ImageSettings) => {
      const defaults = defaultSettingsRef.current
      const merged = {...prev, ...updates}
      const next = enforceDimensionBounds(merged, defaults)

      if (settingsAreEqual(prev, next)) {
        return prev
      }

      persistSettings(next)
      return next
    })
  }, [persistSettings])

  // Reset to image defaults while keeping persistence layer in sync.
  const resetSettings = useCallback(() => {
    const defaults = defaultSettingsRef.current
    persistSettings(defaults)
    setSettings({...defaults})
  }, [persistSettings])

  return [processedImageUrl, imageInfo, settings, updateSettings, resetSettings, imageStatus, previewDimensions] as const
}
