import { useState, useMemo } from 'react'
import movesData from '../data/moves.json'
import typesData from '../data/move-types.json'
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
  includeNoEffect: true,
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

  const filtered = useMemo(() => applyFilters(movesData, filters), [filters])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let va = a[sortBy]
      let vb = b[sortBy]
      if (va === null) va = sortDir === 'asc' ? Infinity : -Infinity
      if (vb === null) vb = sortDir === 'asc' ? Infinity : -Infinity
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
    <div className={styles.layout}>
      <MoveFilters
        filters={filters}
        onFiltersChange={setFilters}
        types={typesData}
        totalCount={movesData.length}
        filteredCount={filtered.length}
      />

      <div className={styles.main}>
        <div className={styles.toolbar}>
          <p className={styles.resultCount}>
            {sorted.length === 0
              ? 'No se encontraron movimientos'
              : `${sorted.length} movimiento${sorted.length !== 1 ? 's' : ''}`
            }
          </p>
          <div className={styles.sortBtns}>
            <span className={styles.sortLabel}>Ordenar:</span>
            {[
              { key: 'name',     label: 'Nombre' },
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

        {sorted.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>❄️</span>
            <p>Ningún movimiento coincide con los filtros aplicados.</p>
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
  )
}
