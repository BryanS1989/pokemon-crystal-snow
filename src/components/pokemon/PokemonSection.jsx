import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import pokemonData from '../../data/pokemon.json'
import PokemonCard from './PokemonCard'
import PokemonFilters from './PokemonFilters'
import styles from './PokemonSection.module.css'
import { useFavorites } from '../../contexts/FavoritesContext'

const PAGE_SIZE = 20
const INITIAL_FILTERS = { name: '', id: '' }

function getPageNumbers(page, totalPages) {
  const isEdge = page === 1 || page === totalPages
  const pages = isEdge
    ? [1, 2, totalPages - 1, totalPages]
    : [1, page - 1, page, page + 1, totalPages]

  const sorted = [...new Set(pages.filter(p => p >= 1 && p <= totalPages))].sort((a, b) => a - b)

  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}

export default function PokemonSection() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState('asc')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const { isFavorite } = useFavorites()

  function setPage(p) {
    setSearchParams({ page: String(p) }, { replace: true })
  }

  const filtered = useMemo(() => {
    const name = filters.name.trim().toLowerCase()
    const id = filters.id.trim()
    return pokemonData.filter(p => {
      if (name && !p.name.toLowerCase().includes(name)) return false
      if (id && p.id !== Number(id)) return false
      return true
    })
  }, [filters])

  const finalFiltered = useMemo(() => {
    if (!onlyFavorites) return filtered
    return filtered.filter(p => isFavorite('pokemon', p.id))
  }, [filtered, onlyFavorites, isFavorite])

  const sorted = useMemo(() => {
    const arr = [...finalFiltered]
    arr.sort((a, b) => {
      const va = a[sortBy]
      const vb = b[sortBy]
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return arr
  }, [finalFiltered, sortBy, sortDir])

  const totalPages = Math.ceil(finalFiltered.length / PAGE_SIZE)
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pageNumbers = getPageNumbers(page, totalPages)

  const hasActiveFilters = filters.name !== '' || filters.id !== '' || onlyFavorites
  const activeFilterCount = (filters.name ? 1 : 0) + (filters.id ? 1 : 0) + (onlyFavorites ? 1 : 0)

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortDir('asc')
    }
  }

  const sortIcon = (col) => {
    if (sortBy !== col) return <span className={styles.sortNeutral}>↕</span>
    return <span className={styles.sortActive}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  function handleFiltersChange(next) {
    setFilters(next)
    setSearchParams({ page: '1' }, { replace: true })
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Pokémon</h2>
        <p className={styles.pageDesc}>
          Complete reference of all <strong>{pokemonData.length} Pokémon</strong> in the game. Click any card to see moves and evolution.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Overlay móvil */}
        {filtersOpen && (
          <div className={styles.overlay} onClick={() => setFiltersOpen(false)} />
        )}

        {/* Panel de filtros */}
        <div className={`${styles.filterPanel} ${filtersOpen ? styles.filterPanelOpen : ''}`}>
          <div className={styles.filterPanelHeader}>
            <span>Filters</span>
            <button className={styles.closeBtn} onClick={() => setFiltersOpen(false)}>✕</button>
          </div>
          <PokemonFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            totalCount={pokemonData.length}
            filteredCount={finalFiltered.length}
            onlyFavorites={onlyFavorites}
            onOnlyFavoritesChange={setOnlyFavorites}
          />
        </div>

        {/* Contenido principal */}
        <div className={styles.main}>
          <div className={styles.controls}>
            {/* Toggle filtros — solo móvil */}
            <button
              className={styles.filterToggle}
              onClick={() => setFiltersOpen(true)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
              <span className={styles.filterArrow}>▼</span>
            </button>

            {/* Toolbar resultado */}
            <div className={styles.toolbar}>
              <div className={styles.sort}>
                <p className={styles.sortLabel}>Sort by:</p>
                <div className={styles.sortBtns}>
                  {[
                    { key: 'id',   label: 'ID' },
                    { key: 'name', label: 'Name' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => toggleSort(key)}
                      className={`${styles.sortBtn} ${sortBy === key ? styles.sortBtnActive : ''}`}
                    >
                      {label} {sortIcon(key)}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.toolbarLeft}>
                <p className={styles.resultCount}>
                  <strong>{finalFiltered.length}</strong> / {pokemonData.length} Pokémon
                </p>
                {hasActiveFilters && (
                  <button
                    className={styles.clearFiltersBtn}
                    onClick={() => { handleFiltersChange(INITIAL_FILTERS); setOnlyFavorites(false) }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {finalFiltered.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>❄️</span>
              <p>No Pokémon match your filters.</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {pageItems.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button className={styles.pageBtn} onClick={() => setPage(1)} disabled={page === 1} title="First page">«</button>
                  <button className={styles.pageBtn} onClick={() => setPage(page - 1)} disabled={page === 1} title="Previous page">‹</button>

                  {pageNumbers.map((p, i) =>
                    p === '...'
                      ? <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
                      : <button
                          key={p}
                          className={`${styles.pageNum} ${p === page ? styles.pageNumActive : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                  )}

                  <button className={styles.pageBtn} onClick={() => setPage(page + 1)} disabled={page === totalPages} title="Next page">›</button>
                  <button className={styles.pageBtn} onClick={() => setPage(totalPages)} disabled={page === totalPages} title="Last page">»</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
