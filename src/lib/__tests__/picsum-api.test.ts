import {
  downloadImage,
  getDownloadUrl,
  getImageInfo,
  getImages,
  getImageUrl,
  getThumbnailUrl,
  type ImageSettings,
  type PicsumImage,
} from "@/lib/picsum-api";

const mockImage: PicsumImage = {
  id: "123",
  author: "Alejandro Escamilla",
  width: 1200,
  height: 800,
  url: "https://example.com/image",
  download_url: "https://example.com/download",
};

const mockSettings: ImageSettings = {
  width: 600,
  height: 400,
  grayscale: true,
  blur: 3,
};

describe("picsum-api", () => {
  const controller = new AbortController();
  const signal = controller.signal;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fetches images with pagination metadata", async () => {
    const images = [mockImage];
    const headers = new Headers({
      Link: "</v2/list?page=2&limit=6>; rel=\"next\"",
    });

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => images,
      headers,
    });

    const result = await getImages(1, 6, signal);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://picsum.photos/v2/list?page=1&limit=6",
      {signal}
    );
    expect(result).toEqual({
      images,
      currentPage: 1,
      hasNext: true,
      hasPrev: false,
    });
  });

  it("exposes hasPrev when navigating past the first page", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
      headers: new Headers(),
    });

    const result = await getImages(3, 6, signal);

    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(false);
  });

  it("returns null when an image is missing", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const info = await getImageInfo("missing", signal);

    expect(info).toBeNull();
  });

  it("returns null when fetching image info fails", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error("network"));

    const info = await getImageInfo("broken", signal);

    expect(info).toBeNull();
  });

  it("builds image URLs with optional parameters", () => {
    expect(
      getImageUrl("15", 800, 600, {grayscale: true, blur: 2})
    ).toBe("https://picsum.photos/id/15/800/600?grayscale=&blur=2");

    expect(getImageUrl("15", 800, 600)).toBe(
      "https://picsum.photos/id/15/800/600"
    );
  });

  it("builds thumbnail and download URLs", () => {
    expect(getThumbnailUrl("10", 150)).toBe(
      "https://picsum.photos/id/10/150/150"
    );

    expect(getDownloadUrl(mockImage.id, mockSettings)).toBe(
      "https://picsum.photos/id/123/600/400?grayscale=&blur=3"
    );
  });

  it("downloads an image with the expected filename", async () => {
    const blob = new Blob(["data"]);
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      blob: async () => blob,
    });

    const clickMock = jest.fn();
    const anchor = document.createElement("a");
    anchor.click = clickMock;

    jest.spyOn(document, "createElement").mockReturnValue(anchor);
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: jest.fn(() => "blob:url"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });

    await downloadImage(mockImage, mockSettings);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://picsum.photos/id/123/600/400?grayscale=&blur=3"
    );
    expect(anchor.download).toBe("photo-123-by-Alejandro-Escamilla-edited.jpg");
    expect(clickMock).toHaveBeenCalled();
    expect((URL.createObjectURL as jest.Mock)).toHaveBeenCalledWith(blob);
    expect((URL.revokeObjectURL as jest.Mock)).toHaveBeenCalledWith("blob:url");
  });
});
