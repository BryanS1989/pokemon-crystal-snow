import pokemonData from '../../data/pokemon.json'
import movesData from '../../data/moves.json'
import tmsData from '../../data/tms.json'
import typesData from '../../data/move-types.json'
import { useFavorites } from '../../contexts/FavoritesContext'
import PokemonCard from '../pokemon/PokemonCard'
import MoveCard from '../move/MoveCard'
import TMCard from '../tm/TMCard'
import styles from './FavoritesPage.module.css'

const typeById = Object.fromEntries(typesData.map(t => [t.id, t]))
const moveMap  = Object.fromEntries(movesData.map(m => [m.name, m]))

export default function FavoritesPage() {
  const { isFavorite, clearFavorites } = useFavorites()

  const favPokemon = pokemonData.filter(p => isFavorite('pokemon', p.id))
  const favMoves   = movesData.filter(m => isFavorite('move', m.id))
  const favTMs     = tmsData.filter(t => isFavorite('tm', t.id))

  const totalFavorites = favPokemon.length + favMoves.length + favTMs.length

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Favorites</h2>
        <p className={styles.pageDesc}>
          Your saved Pokémon, moves and TMs.
        </p>
      </div>

      {totalFavorites === 0 ? (
        <div className={styles.emptyAll}>
          <span className={styles.emptyAllIcon}>❄️</span>
          <p>No favorites yet.</p>
          <p className={styles.emptyAllSub}>Star any Pokémon, move or TM to save it here.</p>
        </div>
      ) : (
        <>
          <section>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                Pokémon <span className={styles.sectionCount}>({favPokemon.length})</span>
              </h3>
              {favPokemon.length > 0 && (
                <button className={styles.clearBtn} onClick={() => clearFavorites('pokemon')}>
                  Remove all
                </button>
              )}
            </div>
            {favPokemon.length === 0 ? (
              <p className={styles.emptySection}>No favorite Pokémon yet.</p>
            ) : (
              <div className={styles.gridPokemon}>
                {favPokemon.map(p => <PokemonCard key={p.id} pokemon={p} />)}
              </div>
            )}
          </section>

          <section>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                Moves <span className={styles.sectionCount}>({favMoves.length})</span>
              </h3>
              {favMoves.length > 0 && (
                <button className={styles.clearBtn} onClick={() => clearFavorites('move')}>
                  Remove all
                </button>
              )}
            </div>
            {favMoves.length === 0 ? (
              <p className={styles.emptySection}>No favorite moves yet.</p>
            ) : (
              <div className={styles.gridMoves}>
                {favMoves.map(m => (
                  <MoveCard key={m.id} move={m} type={typeById[m.typeId]} />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                TMs <span className={styles.sectionCount}>({favTMs.length})</span>
              </h3>
              {favTMs.length > 0 && (
                <button className={styles.clearBtn} onClick={() => clearFavorites('tm')}>
                  Remove all
                </button>
              )}
            </div>
            {favTMs.length === 0 ? (
              <p className={styles.emptySection}>No favorite TMs yet.</p>
            ) : (
              <div className={styles.gridTMs}>
                {favTMs.map(t => {
                  const move = moveMap[t.move] ?? null
                  const type = move ? typeById[move.typeId] : null
                  return <TMCard key={t.id} tm={t} move={move} type={type} showStats={false} />
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
