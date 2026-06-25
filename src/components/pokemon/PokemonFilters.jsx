import styles from './PokemonFilters.module.css'

export default function PokemonFilters({ filters, onFiltersChange, totalCount, filteredCount }) {
  const set = (key, value) => onFiltersChange({ ...filters, [key]: value })

  const clearAll = () => onFiltersChange({ name: '', id: '' })

  const hasActiveFilters = filters.name !== '' || filters.id !== ''

  const handleIdChange = (e) => {
    const val = e.target.value
    if (val === '' || /^\d+$/.test(val)) set('id', val)
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topRow}>
        <h2 className={styles.title}>Filters</h2>
        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={clearAll}>Clear all</button>
        )}
      </div>

      <p className={styles.count}>
        <strong>{filteredCount}</strong> / {totalCount} Pokémon
      </p>

      <section className={styles.section}>
        <label className={styles.sectionLabel}>Name</label>
        <input
          type="text"
          placeholder="e.g. Char..."
          value={filters.name}
          onChange={e => set('name', e.target.value)}
          className={styles.searchInput}
        />
      </section>

      <section className={styles.section}>
        <label className={styles.sectionLabel}># ID</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="e.g. 25"
          value={filters.id}
          onChange={handleIdChange}
          className={styles.searchInput}
        />
      </section>
    </aside>
  )
}
