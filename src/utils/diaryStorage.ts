import { DiaryEntry } from '../types/diary'

const STORAGE_KEY = 'diary-entries'

export const saveDiaryEntry = (entry: DiaryEntry): void => {
  const entries = getAllDiaryEntries()
  const existingIndex = entries.findIndex(e => e.id === entry.id)
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry
  } else {
    entries.push(entry)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const getAllDiaryEntries = (): DiaryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const entries = JSON.parse(stored)
    return entries.map((entry: any) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt)
    }))
  } catch (error) {
    console.error('Error loading diary entries:', error)
    return []
  }
}

export const deleteDiaryEntry = (id: string): void => {
  const entries = getAllDiaryEntries()
  const filtered = entries.filter(entry => entry.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export const getDiaryEntryById = (id: string): DiaryEntry | null => {
  const entries = getAllDiaryEntries()
  return entries.find(entry => entry.id === id) || null
}

export const searchDiaryEntries = (query: string, entries: DiaryEntry[]): DiaryEntry[] => {
  if (!query.trim()) return entries
  
  const lowercaseQuery = query.toLowerCase()
  return entries.filter(entry => 
    entry.title.toLowerCase().includes(lowercaseQuery) ||
    entry.description.toLowerCase().includes(lowercaseQuery) ||
    entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export const filterDiaryEntries = (
  entries: DiaryEntry[], 
  filters: {
    category?: string
    dateFrom?: string
    dateTo?: string
    tags?: string[]
    favoritesOnly?: boolean
  }
): DiaryEntry[] => {
  return entries.filter(entry => {
    if (filters.category && entry.category !== filters.category) return false
    if (filters.favoritesOnly && !entry.isFavorite) return false
    
    if (filters.dateFrom) {
      const entryDate = new Date(entry.createdAt)
      const fromDate = new Date(filters.dateFrom)
      if (entryDate < fromDate) return false
    }
    
    if (filters.dateTo) {
      const entryDate = new Date(entry.createdAt)
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // Include the entire day
      if (entryDate > toDate) return false
    }
    
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(filterTag => 
        entry.tags.some(entryTag => 
          entryTag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
      if (!hasMatchingTag) return false
    }
    
    return true
  })
}

export const exportDiaryEntries = (entries: DiaryEntry[]): string => {
  const exportData = entries.map(entry => ({
    title: entry.title,
    description: entry.description,
    category: entry.category || '',
    tags: entry.tags.join(', '),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    isFavorite: entry.isFavorite
  }))
  
  return JSON.stringify(exportData, null, 2)
}

export const importDiaryEntries = (jsonData: string): DiaryEntry[] => {
  try {
    const data = JSON.parse(jsonData)
    const entries: DiaryEntry[] = data.map((item: any) => ({
      id: crypto.randomUUID(),
      title: item.title,
      description: item.description,
      category: item.category || undefined,
      tags: item.tags ? item.tags.split(',').map((tag: string) => tag.trim()) : [],
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      isFavorite: item.isFavorite || false
    }))
    
    return entries
  } catch (error) {
    console.error('Error importing diary entries:', error)
    return []
  }
}

// Category management functions
const CATEGORIES_STORAGE_KEY = 'diary-categories'

export const getDefaultCategories = (): string[] => [
  'Mobile Proxies',
  'Resi Proxies', 
  'Datacenter Proxies',
  'IPv6 Proxies',
  'ISP Proxies'
]

export const getCategories = (): string[] => {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (!stored) {
      const defaultCategories = getDefaultCategories()
      saveCategories(defaultCategories)
      return defaultCategories
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error loading categories:', error)
    return getDefaultCategories()
  }
}

export const saveCategories = (categories: string[]): void => {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
}

export const addCategory = (category: string): void => {
  const categories = getCategories()
  if (!categories.includes(category)) {
    categories.push(category)
    saveCategories(categories)
  }
}

export const removeCategory = (category: string): void => {
  const categories = getCategories()
  const filtered = categories.filter(cat => cat !== category)
  saveCategories(filtered)
}

export const updateCategory = (oldCategory: string, newCategory: string): void => {
  const categories = getCategories()
  const index = categories.indexOf(oldCategory)
  if (index !== -1) {
    categories[index] = newCategory
    saveCategories(categories)
  }
}
