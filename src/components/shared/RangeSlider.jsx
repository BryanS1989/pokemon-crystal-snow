import { useCallback } from 'react'
import styles from './RangeSlider.module.css'

export default function RangeSlider({ label, min, max, value, onChange, unit = '', step = 1 }) {
  const [low, high] = value

  const handleLow = useCallback((e) => {
    const newLow = Math.min(Number(e.target.value), high - step)
    onChange([newLow, high])
  }, [high, onChange, step])

  const handleHigh = useCallback((e) => {
    const newHigh = Math.max(Number(e.target.value), low + step)
    onChange([low, newHigh])
  }, [low, onChange, step])

  const lowPct = ((low - min) / (max - min)) * 100
  const highPct = ((high - min) / (max - min)) * 100

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.range}>
          {low}{unit} – {high}{unit}
        </span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleLow}
          className={styles.input}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={handleHigh}
          className={styles.input}
        />
      </div>
      <div className={styles.ticks}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
