import { useParams, useNavigate, Link } from 'react-router-dom'
import tmsData from '../../data/tms.json'
import movesData from '../../data/moves.json'
import typesData from '../../data/move-types.json'
import pokemonData from '../../data/pokemon.json'
import eggMovesData from '../../data/egg-moves.json'
import evolutionMovesData from '../../data/evolution-moves.json'
import styles from './TMDetailPage.module.css'

const moveMap = Object.fromEntries(movesData.map(m => [m.name, m]))
const typeMap = Object.fromEntries(typesData.map(t => [t.id, t]))
const pokemonByName = Object.fromEntries(pokemonData.map(p => [p.name, p]))

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

export default function TMDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const idx = tmsData.findIndex(t => t.id === Number(id))
  const tm = idx !== -1 ? tmsData[idx] : null
  const prevTM = idx > 0 ? tmsData[idx - 1] : null
  const nextTM = idx < tmsData.length - 1 ? tmsData[idx + 1] : null

  if (!tm) {
    return <p style={{ color: 'var(--text-muted)', padding: '32px' }}>TM not found.</p>
  }

  const move = moveMap[tm.move] ?? null
  const type = move ? typeMap[move.typeId] : null

  const learners = move ? buildLearners(move.name) : []
  const eggLearners = move ? buildEggLearners(move.name) : []
  const evoLearners = move ? buildEvoLearners(move.name) : []

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageNav}>
        <button className={styles.navBtn} onClick={() => navigate('/tms')}>← TMs</button>
        <div className={styles.prevNextBtns}>
          {prevTM && (
            <Link to={`/tms/${prevTM.id}`} className={styles.navBtn}>
              ‹ {prevTM.tm}
            </Link>
          )}
          {nextTM && (
            <Link to={`/tms/${nextTM.id}`} className={styles.navBtn}>
              {nextTM.tm} ›
            </Link>
          )}
        </div>
      </div>

      <div className={styles.columns}>
        {/* Left: TM info */}
        <div className={styles.leftCol}>
          <div className={styles.tmTitleRow}>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png"
              alt="TM"
              width={48}
              height={48}
              className={styles.tmSprite}
            />
            <h2 className={styles.tmTitle}>{tm.tm}</h2>
          </div>

          {tm.inCrystal ? (
            <div className={styles.bannerInfo}>
              <span className={styles.bannerIcon}>✓</span>
              Also a TM in vanilla Pokémon Crystal
            </div>
          ) : (
            <div className={styles.bannerWarning}>
              <span className={styles.bannerIcon}>★</span>
              New or reassigned in Crystal Snow
            </div>
          )}

          <section>
            <h3 className={styles.sectionLabel}>Move</h3>
            {move ? (
              <Link to={`/moves/${move.id}`} className={styles.moveCard}>
                <div className={styles.moveHeader}>
                  <h4 className={styles.moveName}>{tm.move}</h4>
                  {type && (
                    <span
                      className={styles.typeBadge}
                      style={{ backgroundColor: type.color, color: type.textColor }}
                    >
                      {type.name}
                    </span>
                  )}
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
            ) : (
              <div className={styles.moveCard}>
                <div className={styles.moveHeader}>
                  <h4 className={styles.moveName}>{tm.move}</h4>
                </div>
              </div>
            )}
          </section>

          <section className={styles.locationSection}>
            <h3 className={styles.sectionLabel}>Location</h3>
            <div className={styles.locationCard}>
              <span className={styles.locationIcon}>📍</span>
              <span className={styles.locationText}>{tm.location}</span>
            </div>
          </section>
        </div>

        {/* Right: Pokémon learners */}
        <div className={styles.rightCol}>
          <section className={styles.learnersSection}>
            <div className={styles.learnersHeader}>
              <h3 className={styles.learnersTitle}>Pokémon that learn this move</h3>
              <span className={styles.learnersCount}>{learners.length}</span>
            </div>

            {learners.length === 0 ? (
              <p className={styles.noLearners}>No Pokémon in the Pokédex learn this move by level-up.</p>
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
