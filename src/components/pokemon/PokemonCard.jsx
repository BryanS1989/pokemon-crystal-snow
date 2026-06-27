import { Link } from 'react-router-dom'
import styles from './PokemonCard.module.css'
import FavoriteButton from '../shared/FavoriteButton'

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export default function PokemonCard({ pokemon }) {
  const paddedId = String(pokemon.id).padStart(3, '0')

  return (
    <Link className={styles.card} to={`/pokemon/${pokemon.id}`}>
      <div className={styles.idRow}>
        <span className={styles.id}>#{paddedId}</span>
        <FavoriteButton type="pokemon" id={pokemon.id} className={styles.favBtn} />
      </div>
      <img
        className={styles.sprite}
        src={`${SPRITE_BASE}/${pokemon.id}.png`}
        alt={pokemon.name}
        width={110}
        height={110}
        loading="lazy"
      />
      <span className={styles.name}>{pokemon.name}</span>
    </Link>
  )
}
