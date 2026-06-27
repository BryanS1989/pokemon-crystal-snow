import { useParams, Link } from 'react-router-dom'
import movesData from '../../data/moves.json'
import typesData from '../../data/move-types.json'
import pokemonData from '../../data/pokemon.json'
import eggMovesData from '../../data/egg-moves.json'
import evolutionMovesData from '../../data/evolution-moves.json'
import tmsData from '../../data/tms.json'
import styles from './MoveDetailPage.module.css'

const typeMap = Object.fromEntries(typesData.map(t => [t.id, t]))
const pokemonByName = Object.fromEntries(pokemonData.map(p => [p.name, p]))
const tmByMove = Object.fromEntries(tmsData.map(t => [t.move, t]))

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

function buildLearners(moveName) {
  const learners = []
  for (const pokemon of pokemonData) {
    const entry = pokemon.moves.find(m => m.move === moveName)
    if (entry) learners.push({ pokemon, level: entry.level })
  }
  return learners.sort((a, b) => a.level - b.level)
}

function buildEggLearners(moveName) {
  return eggMovesData
    .filter(entry => entry.moves.includes(moveName))
    .map(entry => pokemonByName[entry.species])
    .filter(Boolean)
}

function buildEvoLearners(moveName) {
  return Object.entries(evolutionMovesData)
    .filter(([, move]) => move === moveName)
    .map(([species]) => pokemonByName[species])
    .filter(Boolean)
}

export default function MoveDetailPage() {
  const { id } = useParams()
  const idx = movesData.findIndex(m => m.id === Number(id))
  const move = idx !== -1 ? movesData[idx] : null
  const prevMove = idx > 0 ? movesData[idx - 1] : null
  const nextMove = idx < movesData.length - 1 ? movesData[idx + 1] : null

  if (!move) {
    return <p style={{ color: 'var(--text-muted)', padding: '32px' }}>Move not found.</p>
  }

  const type = typeMap[move.typeId]
  const tmEntry = tmByMove[move.name] ?? null
  const learners = buildLearners(move.name)
  const eggLearners = buildEggLearners(move.name)
  const evoLearners = buildEvoLearners(move.name)

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageNav}>
        <nav className={styles.breadcrumb}>
          <Link to="/moves" className={styles.breadcrumbLink}>Moves</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{move.name}</span>
        </nav>
        <div className={styles.prevNextBtns}>
          <div>
            {prevMove && (
              <Link to={`/moves/${prevMove.id}`} className={styles.navBtn}>
                ‹ {prevMove.name}
              </Link>
            )}
          </div>
          <div>
            {nextMove && (
              <Link to={`/moves/${nextMove.id}`} className={styles.navBtn}>
                {nextMove.name} ›
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={styles.columns}>
        {/* Left: move info card */}
        <div className={styles.leftCol}>
          <div className={styles.moveCard}>
            <div className={styles.moveHeader}>
              <h2 className={styles.moveName}>{move.name}</h2>
              <span
                className={styles.typeBadge}
                style={{ backgroundColor: type.color, color: type.textColor }}
              >
                {type.name}
              </span>
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
          </div>

          {tmEntry && (
            <Link to={`/tms/${tmEntry.id}`} className={styles.tmBlock}>
              <div className={styles.tmBlockHeader}>
                <span className={styles.tmBlockIcon}>⚙</span>
                <span className={styles.tmBlockLabel}>Máquina Técnica</span>
              </div>
              <div className={styles.tmBlockBody}>
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png"
                  alt="TM"
                  width={32}
                  height={32}
                  className={styles.tmBlockSprite}
                />
                <div className={styles.tmBlockInfo}>
                  <span className={styles.tmBlockNumber}>{tmEntry.tm}</span>
                  <span className={styles.tmBlockLocation}>{tmEntry.location}</span>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Right: learners */}
        <div className={styles.rightCol}>
          <section className={styles.learnersSection}>
            <div className={styles.learnersHeader}>
              <h3 className={styles.learnersTitle}>Pokémon that learn this move</h3>
              <span className={styles.learnersCount}>{learners.length}</span>
            </div>

            {learners.length === 0 ? (
              <p className={styles.noLearners}>No Pokémon in the Pokédex learn this move.</p>
            ) : (
              <div className={styles.learnersGrid}>
                {learners.map(({ pokemon, level }) => (
                  <Link
                    key={pokemon.id}
                    to={`/pokemon/${pokemon.id}`}
                    className={styles.learnerRow}
                  >
                    <span className={styles.learnerId}>
                      #{String(pokemon.id).padStart(3, '0')}
                    </span>
                    <img
                      src={`${SPRITE_BASE}/${pokemon.id}.png`}
                      alt={pokemon.name}
                      width={48}
                      height={48}
                      className={styles.learnerSprite}
                      loading="lazy"
                    />
                    <span className={styles.learnerName}>{pokemon.name}</span>
                    <span className={styles.learnerLevel}>Lv. {level}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {eggLearners.length > 0 && (
            <section className={styles.learnersSection}>
              <div className={styles.learnersHeader}>
                <h3 className={styles.learnersTitle}>Egg move</h3>
                <span className={styles.learnersCount}>{eggLearners.length}</span>
              </div>

              <div className={styles.learnersGrid}>
                {eggLearners.map(pokemon => (
                  <Link
                    key={pokemon.id}
                    to={`/pokemon/${pokemon.id}`}
                    className={styles.learnerRow}
                  >
                    <span className={styles.learnerId}>
                      #{String(pokemon.id).padStart(3, '0')}
                    </span>
                    <img
                      src={`${SPRITE_BASE}/${pokemon.id}.png`}
                      alt={pokemon.name}
                      width={48}
                      height={48}
                      className={styles.learnerSprite}
                      loading="lazy"
                    />
                    <span className={styles.learnerName}>{pokemon.name}</span>
                    <span className={styles.learnerEgg}>Egg</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {evoLearners.length > 0 && (
            <section className={styles.learnersSection}>
              <div className={styles.learnersHeader}>
                <h3 className={styles.learnersTitle}>Learned on evolution</h3>
                <span className={styles.learnersCount}>{evoLearners.length}</span>
              </div>

              <div className={styles.learnersGrid}>
                {evoLearners.map(pokemon => (
                  <Link
                    key={pokemon.id}
                    to={`/pokemon/${pokemon.id}`}
                    className={styles.learnerRow}
                  >
                    <span className={styles.learnerId}>
                      #{String(pokemon.id).padStart(3, '0')}
                    </span>
                    <img
                      src={`${SPRITE_BASE}/${pokemon.id}.png`}
                      alt={pokemon.name}
                      width={48}
                      height={48}
                      className={styles.learnerSprite}
                      loading="lazy"
                    />
                    <span className={styles.learnerName}>{pokemon.name}</span>
                    <span className={styles.learnerEgg}>On evo</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
