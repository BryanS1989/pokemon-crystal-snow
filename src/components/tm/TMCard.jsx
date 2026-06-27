import { Link } from 'react-router-dom'
import styles from './TMCard.module.css'
import FavoriteButton from '../shared/FavoriteButton'

export default function TMCard({ tm, move, type, showStats }) {
  return (
    <Link className={styles.card} to={`/tms/${tm.id}`}>
      <div className={styles.header}>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png"
          alt="TM"
          width={30}
          height={30}
          className={styles.tmSprite}
        />
        <span className={styles.tmLabel}>{tm.tm}</span>
        <FavoriteButton type="tm" id={tm.id} className={styles.favBtn} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{tm.move}</h3>
        {type && (
          <span
            className={styles.typeBadge}
            style={{ backgroundColor: type.color, color: type.textColor }}
          >
            {type.name}
          </span>
        )}
      </div>
      {move && showStats && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Power</span>
            <span className={styles.statValue}>
              {move.power === '★' ? '★' : move.power !== null ? move.power : '—'}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Acc</span>
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
      )}
    </Link>
  )
}
