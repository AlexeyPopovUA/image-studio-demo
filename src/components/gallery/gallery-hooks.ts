import {useEffect, useState} from "react";
import {getImages, PicsumImage} from "@/lib/picsum-api";

const ITEMS_PER_PAGE = 9
const INVALID_PAGE_ERROR = "Invalid page number. Page numbers must be 1 or greater."

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
    loading: true,
    error: "",
    hasPrevious: false,
    hasNext: false
  });

  useEffect(() => {
    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      setState({
        images: [],
        loading: false,
        error: INVALID_PAGE_ERROR,
        hasPrevious: false,
        hasNext: false
      })
      return
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchImages = async () => {
      setState(prevState => ({...prevState, loading: true, error: ""}))

      try {
        const response = await getImages(pageNumber, ITEMS_PER_PAGE, signal)
        setState({loading: false, error: "", images: response.images, hasPrevious: response.hasPrev, hasNext: response.hasNext})
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setState({loading: false, error: err instanceof Error ? err?.message : JSON.stringify(err), images: [], hasPrevious: false, hasNext: false})
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
