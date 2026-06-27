import { useState, useMemo } from 'react'
import tmsData from '../../data/tms.json'
import movesData from '../../data/moves.json'
import typesData from '../../data/move-types.json'
import TMCard from './TMCard'
import styles from './TMsSection.module.css'

const moveMap = Object.fromEntries(movesData.map(m => [m.name, m]))
const typeMap = Object.fromEntries(typesData.map(t => [t.id, t]))

export default function TMsSection() {
  const [search, setSearch] = useState('')
  const [showStats, setShowStats] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return tmsData
    return tmsData.filter(
      tm =>
        tm.tm.toLowerCase().includes(q) ||
        tm.move.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar por TM o movimiento…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label className={styles.toggle}>
          <span className={styles.toggleLabel}>Show stats</span>
          <button
            role="switch"
            aria-checked={showStats}
            className={`${styles.toggleSwitch} ${showStats ? styles.toggleSwitchOn : ''}`}
            onClick={() => setShowStats(v => !v)}
          >
            <span className={styles.toggleThumb} />
          </button>
        </label>
        <p className={styles.resultCount}>
          {filtered.length} / {tmsData.length} TMs
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>❄️</span>
          <span>No se encontraron TMs</span>
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
  )
}
