export interface DiaryEntry {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  category?: string
  tags: string[]
  isFavorite: boolean
}

export interface DiaryFilters {
  search: string
  category: string
  dateFrom: string
  dateTo: string
  tags: string[]
  favoritesOnly: boolean
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalEntries: number
  entriesPerPage: number
}
