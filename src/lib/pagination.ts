// Generate page numbers for pagination
export const getPageNumbers = (currentPage: number) => {
  const pages = []
  const maxVisible = 5
  const start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const end = start + maxVisible - 1

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}
