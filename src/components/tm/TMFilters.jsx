import styles from './TMFilters.module.css'

export default function TMFilters({ filters, onFiltersChange, types, totalCount, filteredCount, showStats, onShowStatsChange, onlyFavorites, onOnlyFavoritesChange }) {
  const set = (key, value) => onFiltersChange({ ...filters, [key]: value })

  const toggleType = (typeId) => {
    const next = filters.selectedTypes.includes(typeId)
      ? filters.selectedTypes.filter(id => id !== typeId)
      : [...filters.selectedTypes, typeId]
    set('selectedTypes', next)
  }

  const hasActiveFilters = filters.search !== '' || filters.selectedTypes.length > 0 || onlyFavorites

  const clearAll = () => { onFiltersChange({ search: '', selectedTypes: [] }); onOnlyFavoritesChange(false) }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topRow}>
        <h2 className={styles.title}>Filters</h2>
        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={clearAll}>Clear all</button>
        )}
      </div>

      <p className={styles.count}>
        <strong>{filteredCount}</strong> / {totalCount} TMs
      </p>

      <section className={styles.section}>
        <label className={styles.toggle}>
          <span className={styles.toggleLabel}>Only Favorites</span>
          <button
            role="switch"
            aria-checked={onlyFavorites}
            className={`${styles.toggleSwitch} ${onlyFavorites ? styles.toggleSwitchFav : ''}`}
            onClick={() => onOnlyFavoritesChange(!onlyFavorites)}
          >
            <span className={styles.toggleThumb} />
          </button>
        </label>
      </section>

      <section className={styles.section}>
        <label className={styles.toggle}>
          <span className={styles.toggleLabel}>Show stats</span>
          <button
            role="switch"
            aria-checked={showStats}
            className={`${styles.toggleSwitch} ${showStats ? styles.toggleSwitchOn : ''}`}
            onClick={() => onShowStatsChange(!showStats)}
          >
            <span className={styles.toggleThumb} />
          </button>
        </label>
      </section>

      <section className={styles.section}>
        <label className={styles.sectionLabel}>Search</label>
        <input
          type="text"
          placeholder="TM or move name..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          className={styles.searchInput}
        />
      </section>

      <section className={styles.section}>
        <label className={styles.sectionLabel}>Type</label>
        <div className={styles.typeGrid}>
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={styles.typeBtn}
              style={
                filters.selectedTypes.includes(type.id)
                  ? { backgroundColor: type.color, color: type.textColor, borderColor: type.color }
                  : {}
              }
            >
              {type.name}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}
