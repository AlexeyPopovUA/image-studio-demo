import {useEffect, useState} from "react";
import {PicsumAPI, PicsumImage} from "@/lib/picsum-api";

const ITEMS_PER_PAGE = 9

type HookState = {
  images: PicsumImage[]
  loading: boolean
  error: string
  hasPrevious: boolean
  hasNext: boolean
}

export function useGalleryImages(pageNumber: number) {
  const [state, setState] = useState<HookState>({
    images: [],
    loading: false,
    error: "",
    hasPrevious: false,
    hasNext: false
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchImages = async () => {
      setState(prevState => ({...prevState, loading: true, error: ""}))

      try {
        const response = await PicsumAPI.getImages(pageNumber, ITEMS_PER_PAGE, signal)
        setState({loading: false, error: "", images: response.images, hasPrevious: response.hasPrev, hasNext: response.hasNext})
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setState({loading: false, error: "Failed to load images. Please try again.", images: [], hasPrevious: false, hasNext: false})
          console.error("Error fetching images:", err)
        }
      }
    }

    void fetchImages()

    return () => {
      controller.abort()
    }
  }, [pageNumber])

  return [state.images, state.loading, state.error] as const;
}
