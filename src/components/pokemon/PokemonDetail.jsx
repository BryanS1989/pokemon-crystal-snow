import { Link } from 'react-router-dom'
import pokemonData from '../../data/pokemon.json'
import movesData from '../../data/moves.json'
import moveTypes from '../../data/move-types.json'
import styles from './PokemonDetail.module.css'

const typeByName = Object.fromEntries(moveTypes.map(t => [t.name.toLowerCase(), t]))
const pokemonByName = Object.fromEntries(pokemonData.map(p => [p.name, p]))
const moveByName = Object.fromEntries(movesData.map(m => [m.name, m]))

function EvolutionInfo({ evolution }) {
  if (!evolution) {
    return <p className={styles.noEvolution}>Does not evolve</p>
  }

  const trigger =
    evolution.type === 'LEVEL'
      ? `Level ${evolution.level}`
      : evolution.item.replace(/_/g, ' ')

  const target = pokemonByName[evolution.into]

  return (
    <div className={styles.evolutionRow}>
      {target
        ? <Link to={`/pokemon/${target.id}`} className={styles.evolutionInto}>{evolution.into}</Link>
        : <span className={styles.evolutionInto}>{evolution.into}</span>
      }
      <span className={styles.evolutionTrigger}>{trigger}</span>
    </div>
  )
}

export default function PokemonDetail({ pokemon, apiData, apiLoading, onBack }) {
  const paddedId = String(pokemon.id).padStart(3, '0')

  const artwork = apiData?.sprites?.other?.['official-artwork']?.front_default
  const height = apiData ? `${(apiData.height / 10).toFixed(1)} m` : null
  const weight = apiData ? `${(apiData.weight / 10).toFixed(1)} kg` : null

  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} onClick={onBack}>
        ← Back
      </button>

      <div className={styles.topSection}>
        <div className={styles.artworkBox}>
          {apiLoading && <div className={styles.artworkSkeleton} />}
          {artwork && (
            <img
              className={styles.artwork}
              src={artwork}
              alt={pokemon.name}
              width={280}
              height={280}
            />
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.header}>
            <span className={styles.id}>#{paddedId}</span>
            <h2 className={styles.name}>{pokemon.name}</h2>
          </div>

          {apiData?.types && (
            <div className={styles.types}>
              {apiData.types.map(({ type }) => {
                const t = typeByName[type.name]
                return t
                  ? <span
                      key={type.name}
                      className={styles.typeBadge}
                      style={{ backgroundColor: t.color, color: t.textColor }}
                    >
                      {t.name}
                    </span>
                  : null
              })}
            </div>
          )}

          <div className={styles.physicalStats}>
            <div className={styles.physStat}>
              <span className={styles.physLabel}>Height</span>
              <span className={styles.physValue}>
                {apiLoading ? '—' : height}
              </span>
            </div>
            <div className={styles.physStat}>
              <span className={styles.physLabel}>Weight</span>
              <span className={styles.physValue}>
                {apiLoading ? '—' : weight}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Evolution</h3>
        <EvolutionInfo evolution={pokemon.evolution} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Level-Up Moves</h3>
        <div className={styles.movesTable}>
          <div className={styles.movesHeader}>
            <span>Level</span>
            <span>Move</span>
          </div>
          {pokemon.moves.map((entry, i) => {
            const moveRecord = moveByName[entry.move]
            const RowTag = moveRecord ? Link : 'div'
            const rowProps = moveRecord ? { to: `/moves/${moveRecord.id}` } : {}
            return (
              <RowTag key={i} className={styles.moveRow} {...rowProps}>
                <span className={styles.moveLevel}>{entry.level}</span>
                <span className={styles.moveName}>{entry.move}</span>
              </RowTag>
            )
          })}
        </div>
      </section>
    </div>
  )
}
