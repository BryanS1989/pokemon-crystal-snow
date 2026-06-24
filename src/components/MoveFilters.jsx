import RangeSlider from './RangeSlider'
import styles from './MoveFilters.module.css'

const POWER_RANGE   = [0, 250]
const ACCURACY_RANGE = [40, 100]
const PP_RANGE      = [1, 40]
const EFFECT_RANGE  = [10, 100]

export default function MoveFilters({ filters, onFiltersChange, types, totalCount, filteredCount }) {
  const set = (key, value) => onFiltersChange({ ...filters, [key]: value })

  const toggleType = (typeId) => {
    const next = filters.selectedTypes.includes(typeId)
      ? filters.selectedTypes.filter(id => id !== typeId)
      : [...filters.selectedTypes, typeId]
    set('selectedTypes', next)
  }

  const clearAll = () => {
    onFiltersChange({
      search: '',
      selectedTypes: [],
      powerRange: POWER_RANGE,
      accuracyRange: ACCURACY_RANGE,
      ppRange: PP_RANGE,
      effectRange: EFFECT_RANGE,
      includePowerless: true,
      includeStarPower: true,
      includeNoEffect: true,
    })
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.selectedTypes.length > 0 ||
    filters.powerRange[0] !== POWER_RANGE[0] ||
    filters.powerRange[1] !== POWER_RANGE[1] ||
    filters.accuracyRange[0] !== ACCURACY_RANGE[0] ||
    filters.accuracyRange[1] !== ACCURACY_RANGE[1] ||
    filters.ppRange[0] !== PP_RANGE[0] ||
    filters.ppRange[1] !== PP_RANGE[1] ||
    filters.effectRange[0] !== EFFECT_RANGE[0] ||
    filters.effectRange[1] !== EFFECT_RANGE[1] ||
    !filters.includePowerless ||
    !filters.includeStarPower ||
    !filters.includeNoEffect

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topRow}>
        <h2 className={styles.title}>Filtros</h2>
        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={clearAll}>
            Limpiar todo
          </button>
        )}
      </div>

      <p className={styles.count}>
        <strong>{filteredCount}</strong> / {totalCount} movimientos
      </p>

      {/* Búsqueda */}
      <section className={styles.section}>
        <label className={styles.sectionLabel}>Buscar</label>
        <input
          type="text"
          placeholder="Nombre o descripción..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          className={styles.searchInput}
        />
      </section>

      {/* Tipos */}
      <section className={styles.section}>
        <label className={styles.sectionLabel}>Tipo</label>
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

      {/* Power */}
      <section className={styles.section}>
        <RangeSlider
          label="Power"
          min={POWER_RANGE[0]}
          max={POWER_RANGE[1]}
          value={filters.powerRange}
          onChange={v => set('powerRange', v)}
          step={5}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.includePowerless}
            onChange={e => set('includePowerless', e.target.checked)}
          />
          Incluir sin Power (—)
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.includeStarPower}
            onChange={e => set('includeStarPower', e.target.checked)}
          />
          Incluir Power variable (★)
        </label>
        <p className={styles.starLegend}>★ = One-hit KO or damage based on level/HP</p>
      </section>

      {/* Accuracy */}
      <section className={styles.section}>
        <RangeSlider
          label="Accuracy"
          min={ACCURACY_RANGE[0]}
          max={ACCURACY_RANGE[1]}
          value={filters.accuracyRange}
          onChange={v => set('accuracyRange', v)}
          unit="%"
          step={5}
        />
      </section>

      {/* PP */}
      <section className={styles.section}>
        <RangeSlider
          label="PP"
          min={PP_RANGE[0]}
          max={PP_RANGE[1]}
          value={filters.ppRange}
          onChange={v => set('ppRange', v)}
        />
      </section>

      {/* Effect */}
      <section className={styles.section}>
        <RangeSlider
          label="Effect %"
          min={EFFECT_RANGE[0]}
          max={EFFECT_RANGE[1]}
          value={filters.effectRange}
          onChange={v => set('effectRange', v)}
          unit="%"
          step={5}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.includeNoEffect}
            onChange={e => set('includeNoEffect', e.target.checked)}
          />
          Incluir movimientos sin Effect
        </label>
      </section>
    </aside>
  )
}
