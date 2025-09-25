import {getPageNumbers} from "@/lib/pagination";

describe("getPageNumbers", () => {
  it("returns a fixed window of five pages", () => {
    expect(getPageNumbers(1)).toEqual([1, 2, 3, 4, 5]);
  });

  it("centers the window around the current page when possible", () => {
    expect(getPageNumbers(7)).toEqual([5, 6, 7, 8, 9]);
  });

  it("keeps the window length consistent for higher pages", () => {
    const pages = getPageNumbers(25);

    expect(pages).toHaveLength(5);
    expect(pages[0]).toBe(23);
    expect(pages.at(-1)).toBe(27);
  });
});

