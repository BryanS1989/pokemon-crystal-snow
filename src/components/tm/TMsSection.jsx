import { useState, useMemo } from 'react'
import tmsData from '../../data/tms.json'
import movesData from '../../data/moves.json'
import typesData from '../../data/move-types.json'
import TMCard from './TMCard'
import TMFilters from './TMFilters'
import styles from './TMsSection.module.css'

const moveMap = Object.fromEntries(movesData.map(m => [m.name, m]))
const typeMap = Object.fromEntries(typesData.map(t => [t.id, t]))

const INITIAL_FILTERS = { search: '', selectedTypes: [] }

function countActiveFilters(filters) {
  let count = 0
  if (filters.search.trim()) count++
  if (filters.selectedTypes.length > 0) count++
  return count
}

export default function TMsSection() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [showStats, setShowStats] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return tmsData.filter(tm => {
      if (q && !tm.tm.toLowerCase().includes(q) && !tm.move.toLowerCase().includes(q)) return false
      if (filters.selectedTypes.length > 0) {
        const move = moveMap[tm.move]
        if (!move || !filters.selectedTypes.includes(move.typeId)) return false
      }
      return true
    })
  }, [filters])

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  return (
    <section>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>TMs</h2>
        <p className={styles.pageDesc}>
          Complete reference of all <strong>{tmsData.length} TMs</strong> in the game. Filter by type or search by TM number and move name.
        </p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.layout}>
          {filtersOpen && (
            <div className={styles.overlay} onClick={() => setFiltersOpen(false)} />
          )}

          <div className={`${styles.filterPanel} ${filtersOpen ? styles.filterPanelOpen : ''}`}>
            <div className={styles.filterPanelHeader}>
              <span>Filters</span>
              <button className={styles.closeBtn} onClick={() => setFiltersOpen(false)}>✕</button>
            </div>
            <TMFilters
              filters={filters}
              onFiltersChange={setFilters}
              types={typesData}
              totalCount={tmsData.length}
              filteredCount={filtered.length}
              showStats={showStats}
              onShowStatsChange={setShowStats}
            />
          </div>

          <div className={styles.main}>
            <div className={styles.controls}>
              <button
                className={styles.filterToggle}
                onClick={() => setFiltersOpen(v => !v)}
              >
                <span>⚙ Filters</span>
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge}>{activeFilterCount}</span>
                )}
                <span className={styles.filterArrow}>{filtersOpen ? '▲' : '▼'}</span>
              </button>

              <div className={styles.toolbar}>
                <p className={styles.resultCount}>
                  {filtered.length === 0
                    ? 'No TMs found'
                    : `${filtered.length} TM${filtered.length !== 1 ? 's' : ''}`
                  }
                </p>
                {activeFilterCount > 0 && (
                  <button
                    className={styles.clearFiltersBtn}
                    onClick={() => setFilters(INITIAL_FILTERS)}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>❄️</span>
                <p>No TMs match the applied filters.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map(tm => {
                  const move = moveMap[tm.move] ?? null
                  const type = move ? typeMap[move.typeId] : null
                  return <TMCard key={tm.id} tm={tm} move={move} type={type} showStats={showStats} />
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
