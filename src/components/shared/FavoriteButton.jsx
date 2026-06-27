import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'
import { useFavorites } from '../../contexts/FavoritesContext'
import styles from './FavoriteButton.module.css'

export default function FavoriteButton({ type, id, className = '' }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const active = isFavorite(type, id)

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(type, id)
  }

  return (
    <button
      data-active={active || undefined}
      className={`${styles.btn} ${active ? styles.active : ''} ${className}`}
      onClick={handleClick}
      aria-label={active ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      title={active ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <FontAwesomeIcon icon={active ? faStarSolid : faStarRegular} />
    </button>
  )
}
