import React, { useState, useEffect, useMemo } from 'react'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Heart, 
  Edit3, 
  Trash2, 
  Download, 
  Upload,
  ChevronLeft,
  ChevronRight,
  Star,
  Settings,
  X,
  Check
} from 'lucide-react'
import { DiaryEntry, DiaryFilters, PaginationInfo } from '../types/diary'
import { 
  saveDiaryEntry, 
  getAllDiaryEntries, 
  deleteDiaryEntry, 
  searchDiaryEntries, 
  filterDiaryEntries,
  exportDiaryEntries,
  importDiaryEntries,
  getCategories,
  addCategory,
  removeCategory,
  updateCategory
} from '../utils/diaryStorage'

const ENTRIES_PER_PAGE = 6

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    entriesPerPage: ENTRIES_PER_PAGE
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  })

  const [filters, setFilters] = useState<DiaryFilters>({
    search: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    tags: [],
    favoritesOnly: false
  })

  // Load entries and categories on component mount
  useEffect(() => {
    loadEntries()
    loadCategories()
  }, [])

  // Filter and search entries
  useEffect(() => {
    let filtered = [...entries]
    
    // Apply search
    if (filters.search) {
      filtered = searchDiaryEntries(filters.search, filtered)
    }
    
    // Apply filters
    filtered = filterDiaryEntries(filtered, {
      category: filters.category,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      tags: filters.tags,
      favoritesOnly: filters.favoritesOnly
    })
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    setFilteredEntries(filtered)
    
    // Update pagination
    const totalPages = Math.ceil(filtered.length / ENTRIES_PER_PAGE)
    setPagination({
      currentPage: 1,
      totalPages,
      totalEntries: filtered.length,
      entriesPerPage: ENTRIES_PER_PAGE
    })
  }, [entries, filters])

  const loadEntries = () => {
    const loadedEntries = getAllDiaryEntries()
    setEntries(loadedEntries)
  }

  const loadCategories = () => {
    const loadedCategories = getCategories()
    setCategories(loadedCategories)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in both title and description')
      return
    }

    const now = new Date()
    const entryData: DiaryEntry = {
      id: currentEntry?.id || crypto.randomUUID(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category || undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: currentEntry?.createdAt || now,
      updatedAt: now,
      isFavorite: currentEntry?.isFavorite || false
    }

    saveDiaryEntry(entryData)
    loadEntries()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: ''
    })
    setCurrentEntry(null)
    setIsEditing(false)
  }

  const handleEdit = (entry: DiaryEntry) => {
    setCurrentEntry(entry)
    setFormData({
      title: entry.title,
      description: entry.description,
      category: entry.category || '',
      tags: entry.tags.join(', ')
    })
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteDiaryEntry(id)
      loadEntries()
      if (currentEntry?.id === id) {
        resetForm()
      }
    }
  }

  const toggleFavorite = (id: string) => {
    const entry = entries.find(e => e.id === id)
    if (entry) {
      const updatedEntry = { ...entry, isFavorite: !entry.isFavorite }
      saveDiaryEntry(updatedEntry)
      loadEntries()
    }
  }

  const handleExport = () => {
    const data = exportDiaryEntries(entries)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diary-entries-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = event.target?.result as string
          const importedEntries = importDiaryEntries(data)
          
          // Save imported entries
          importedEntries.forEach(entry => {
            saveDiaryEntry(entry)
          })
          
          loadEntries()
          alert(`Successfully imported ${importedEntries.length} entries`)
        } catch (error) {
          alert('Error importing file. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  // Category management functions
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim())
      setNewCategory('')
      loadCategories()
    }
  }

  const handleEditCategory = (category: string) => {
    setEditingCategory(category)
    setEditingCategoryName(category)
  }

  const handleSaveCategoryEdit = () => {
    if (editingCategory && editingCategoryName.trim()) {
      updateCategory(editingCategory, editingCategoryName.trim())
      loadCategories()
      setEditingCategory(null)
      setEditingCategoryName('')
    }
  }

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null)
    setEditingCategoryName('')
  }

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Are you sure you want to delete the category "${category}"? This will remove it from all entries.`)) {
      removeCategory(category)
      loadCategories()
    }
  }

  // Get current page entries
  const currentPageEntries = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * ENTRIES_PER_PAGE
    const endIndex = startIndex + ENTRIES_PER_PAGE
    return filteredEntries.slice(startIndex, endIndex)
  }, [filteredEntries, pagination.currentPage])

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in flex items-center justify-center gap-3">
            <BookOpen className="w-12 h-12" />
            Personal Diary
          </h1>
          <p className="text-xl text-white/80 animate-fade-in">
            Capture your thoughts, memories, and experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Entry Form */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                {isEditing ? 'Edit Entry' : 'New Entry'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="What's on your mind?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    placeholder="Tell me more about it..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-white/90">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryManager(!showCategoryManager)}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <Settings className="w-4 h-4" />
                      Manage
                    </button>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="proxy, server, test"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    {isEditing ? 'Update' : 'Save'}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Category Manager */}
              {showCategoryManager && (
                <div className="mt-6 bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Manage Categories
                  </h3>
                  
                  {/* Add new category */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Add new category"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      />
                      <button
                        onClick={handleAddCategory}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Categories list */}
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        {editingCategory === category ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingCategoryName}
                              onChange={(e) => setEditingCategoryName(e.target.value)}
                              className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveCategoryEdit()}
                            />
                            <button
                              onClick={handleSaveCategoryEdit}
                              className="p-1 text-green-400 hover:text-green-300"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelCategoryEdit}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1 text-white">{category}</span>
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="p-1 text-blue-400 hover:text-blue-300"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Entries List */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl p-6 shadow-2xl">
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Search entries..."
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                  </button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="bg-black/20 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                        <select
                          value={filters.category}
                          onChange={(e) => setFilters({...filters, category: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="">All categories</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                          ))}
                        </select>
                      </div>


                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Date From</label>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Date To</label>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="flex items-center gap-2 text-white/90">
                          <input
                            type="checkbox"
                            checked={filters.favoritesOnly}
                            onChange={(e) => setFilters({...filters, favoritesOnly: e.target.checked})}
                            className="rounded"
                          />
                          Favorites only
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Export/Import */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleExport}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Entries List */}
              <div className="space-y-4">
                {currentPageEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">
                      {filteredEntries.length === 0 ? 'No entries found' : 'No entries on this page'}
                    </p>
                    {filteredEntries.length === 0 && (
                      <p className="text-white/40 text-sm mt-2">
                        Start by creating your first diary entry!
                      </p>
                    )}
                  </div>
                ) : (
                  currentPageEntries.map((entry) => (
                    <div key={entry.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                            {entry.title}
                            {entry.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-white/60 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {entry.createdAt.toLocaleDateString()}
                            </span>
                            {entry.category && (
                              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                                {entry.category}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFavorite(entry.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${entry.isFavorite ? 'text-red-400 fill-current' : 'text-white/40'}`} />
                          </button>
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/60 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm leading-relaxed mb-3">
                        {entry.description.length > 200 
                          ? `${entry.description.substring(0, 200)}...` 
                          : entry.description
                        }
                      </p>
                      
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, index) => (
                            <span key={index} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <div className="text-white/60 text-sm">
                    Showing {((pagination.currentPage - 1) * ENTRIES_PER_PAGE) + 1} to {Math.min(pagination.currentPage * ENTRIES_PER_PAGE, pagination.totalEntries)} of {pagination.totalEntries} entries
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            page === pagination.currentPage
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 hover:bg-white/20 text-white/80'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => goToPage(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
