import { Link } from 'react-router-dom'
import styles from './MoveCard.module.css'
import FavoriteButton from '../shared/FavoriteButton'

export default function MoveCard({ move, type }) {
  return (
    <Link className={styles.card} to={`/moves/${move.id}`}>
      <div className={styles.header}>
        <h3 className={styles.name}>{move.name}</h3>
        <span
          className={styles.typeBadge}
          style={{ backgroundColor: type.color, color: type.textColor }}
        >
          {type.name}
        </span>
        <FavoriteButton type="move" id={move.id} className={styles.favBtn} />
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Power</span>
          <span className={styles.statValue}>
            {move.power === '★'
              ? <span title="One-hit KO or damage based on level/HP" style={{ cursor: 'help' }}>★</span>
              : move.power !== null ? move.power : '—'
            }
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Accuracy</span>
          <span className={styles.statValue}>{move.accuracy}%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>PP</span>
          <span className={styles.statValue}>{move.pp}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Effect%</span>
          <span className={styles.statValue}>
            {move.effect !== null ? `${move.effect}%` : '—'}
          </span>
        </div>
      </div>

      <p className={styles.description}>{move.description}</p>
    </Link>
  )
}
