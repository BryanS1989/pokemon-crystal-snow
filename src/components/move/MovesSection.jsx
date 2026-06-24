import { useState, useMemo } from 'react'
import movesData from '../../data/moves.json'
import typesData from '../../data/move-types.json'
import MoveCard from './MoveCard'
import MoveFilters from './MoveFilters'
import styles from './MovesSection.module.css'

const typeMap = Object.fromEntries(typesData.map(t => [t.id, t]))

const INITIAL_FILTERS = {
  search: '',
  selectedTypes: [],
  powerRange: [0, 250],
  accuracyRange: [40, 100],
  ppRange: [1, 40],
  effectRange: [10, 100],
  includePowerless: true,
  includeStarPower: true,
  includeNoEffect: true,
}

function countActiveFilters(filters) {
  let count = 0
  if (filters.search.trim()) count++
  if (filters.selectedTypes.length > 0) count++
  if (filters.powerRange[0] !== 0 || filters.powerRange[1] !== 250) count++
  if (filters.accuracyRange[0] !== 40 || filters.accuracyRange[1] !== 100) count++
  if (filters.ppRange[0] !== 1 || filters.ppRange[1] !== 40) count++
  if (filters.effectRange[0] !== 10 || filters.effectRange[1] !== 100) count++
  if (!filters.includePowerless) count++
  if (!filters.includeStarPower) count++
  if (!filters.includeNoEffect) count++
  return count
}

function applyFilters(moves, filters) {
  const searchLower = filters.search.toLowerCase().trim()

  return moves.filter(move => {
    if (searchLower) {
      const nameMatch = move.name.toLowerCase().includes(searchLower)
      const descMatch = move.description.toLowerCase().includes(searchLower)
      if (!nameMatch && !descMatch) return false
    }

    if (filters.selectedTypes.length > 0 && !filters.selectedTypes.includes(move.typeId)) {
      return false
    }

    if (move.power === null) {
      if (!filters.includePowerless) return false
    } else if (move.power === '★') {
      if (!filters.includeStarPower) return false
    } else {
      if (move.power < filters.powerRange[0] || move.power > filters.powerRange[1]) return false
    }

    if (move.accuracy < filters.accuracyRange[0] || move.accuracy > filters.accuracyRange[1]) {
      return false
    }

    if (move.pp < filters.ppRange[0] || move.pp > filters.ppRange[1]) {
      return false
    }

    if (move.effect === null) {
      if (!filters.includeNoEffect) return false
    } else {
      if (move.effect < filters.effectRange[0] || move.effect > filters.effectRange[1]) return false
    }

    return true
  })
}

export default function MovesSection() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => applyFilters(movesData, filters), [filters])
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let va = a[sortBy]
      let vb = b[sortBy]
      if (va === null || va === '★') va = sortDir === 'asc' ? Infinity : -Infinity
      if (vb === null || vb === '★') vb = sortDir === 'asc' ? Infinity : -Infinity
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return arr
  }, [filtered, sortBy, sortDir])

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.layout}>
        {filtersOpen && (
          <div
            className={styles.overlay}
            onClick={() => setFiltersOpen(false)}
          />
        )}

        <div className={`${styles.filterPanel} ${filtersOpen ? styles.filterPanelOpen : ''}`}>
          <div className={styles.filterPanelHeader}>
            <span>Filters</span>
            <button className={styles.closeBtn} onClick={() => setFiltersOpen(false)}>✕</button>
          </div>
          <MoveFilters
            filters={filters}
            onFiltersChange={setFilters}
            types={typesData}
            totalCount={movesData.length}
            filteredCount={filtered.length}
            onClose={() => setFiltersOpen(false)}
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
              <div className={styles.sort}>
                <p className={styles.sortLabel}>Sort by:</p>
                <div className={styles.sortBtns}>
                  {[
                    { key: 'name',     label: 'Name' },
                    { key: 'power',    label: 'Power' },
                    { key: 'accuracy', label: 'Accuracy' },
                    { key: 'pp',       label: 'PP' },
                    { key: 'effect',   label: 'Effect' },
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
                  {sorted.length === 0
                    ? 'No moves found'
                    : `${sorted.length} move${sorted.length !== 1 ? 's' : ''}`
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
          </div>

          {sorted.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>❄️</span>
              <p>No moves match the applied filters.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {sorted.map(move => (
                <MoveCard
                  key={move.id}
                  move={move}
                  type={typeMap[move.typeId]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
