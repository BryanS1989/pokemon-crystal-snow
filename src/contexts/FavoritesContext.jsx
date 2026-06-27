import { createContext, useContext, useState, useCallback } from 'react'

const STORAGE_KEY = 'crystal-snow-favorites'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { pokemon: [], move: [], tm: [] }
    const parsed = JSON.parse(raw)
    return {
      pokemon: parsed.pokemon ?? [],
      move: parsed.move ?? [],
      tm: parsed.tm ?? [],
    }
  } catch {
    return { pokemon: [], move: [], tm: [] }
  }
}

function saveToStorage(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    pokemon: [...state.pokemon],
    move: [...state.move],
    tm: [...state.tm],
  }))
}

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const loaded = loadFromStorage()
    return {
      pokemon: new Set(loaded.pokemon),
      move: new Set(loaded.move),
      tm: new Set(loaded.tm),
    }
  })

  const toggleFavorite = useCallback((type, id) => {
    setFavorites(prev => {
      const updated = new Set(prev[type])
      if (updated.has(id)) {
        updated.delete(id)
      } else {
        updated.add(id)
      }
      const next = { ...prev, [type]: updated }
      saveToStorage(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((type, id) => {
    return favorites[type].has(id)
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
