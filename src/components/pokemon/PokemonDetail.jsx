import { Link } from 'react-router-dom'
import pokemonData from '../../data/pokemon.json'

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'
const ITEM_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items'
import movesData from '../../data/moves.json'
import moveTypes from '../../data/move-types.json'
import eggMovesData from '../../data/egg-moves.json'
import evolutionMovesData from '../../data/evolution-moves.json'
import styles from './PokemonDetail.module.css'

const typeByName = Object.fromEntries(moveTypes.map(t => [t.name.toLowerCase(), t]))
const typeById = Object.fromEntries(moveTypes.map(t => [t.id, t]))
const pokemonByName = Object.fromEntries(pokemonData.map(p => [p.name, p]))
const moveByName = Object.fromEntries(movesData.map(m => [m.name, m]))
const eggMovesBySpecies = Object.fromEntries(eggMovesData.map(e => [e.species, e.moves]))

const STAT_CONDITION_LABEL = {
  ATK_GT_DEF: 'ATK > DEF',
  ATK_LT_DEF: 'ATK < DEF',
  ATK_EQ_DEF: 'ATK = DEF',
}

function getTrigger(evolution) {
  switch (evolution.type) {
    case 'LEVEL': return `Lv. ${evolution.level}`
    case 'ITEM':  return evolution.item.replace(/_/g, ' ')
    case 'HAPPINESS': return 'Happiness'
    case 'FRIENDSHIP': {
      if (evolution.condition === 'DAY')   return 'Friendship (Day)'
      if (evolution.condition === 'NIGHT') return 'Friendship (Night)'
      return 'Friendship'
    }
    case 'STAT': {
      const cond = STAT_CONDITION_LABEL[evolution.condition] || evolution.condition
      return `Lv. ${evolution.level} (${cond})`
    }
    default: return evolution.type
  }
}

function EvolutionCard({ evolution, pokemon: overridePokemon, showEvoMove = true }) {
  const trigger = getTrigger(evolution)
  const target = overridePokemon ?? (evolution.into ? pokemonByName[evolution.into] : null)
  const paddedId = target ? String(target.id).padStart(3, '0') : null
  const itemSpriteUrl = evolution.type === 'ITEM'
    ? `${ITEM_SPRITE_BASE}/${evolution.item.toLowerCase().replace(/_/g, '-')}.png`
    : null
  const evoMove = showEvoMove && target ? evolutionMovesData[target.name] : null
  const evoMoveType = evoMove ? typeById[moveByName[evoMove]?.typeId] : null

  const cardContent = (
    <>
      {target && (
        <img
          src={`${SPRITE_BASE}/${target.id}.png`}
          alt={evolution.into}
          width={72}
          height={72}
          className={styles.evolutionSprite}
        />
      )}
      <div className={styles.evolutionCardBody}>
        <div className={styles.evolutionCardInfo}>
          {paddedId && <span className={styles.evolutionCardId}>#{paddedId}</span>}
          {target && <span className={styles.evolutionCardName}>{target.name}</span>}
          {evoMove && (
            <span className={styles.evolutionLearnedRow}>
              <span className={styles.evolutionLearnedLabel}>Learns:</span>
              <span
                className={styles.evolutionLearnedMove}
                style={evoMoveType ? { backgroundColor: evoMoveType.color, color: evoMoveType.textColor, borderColor: evoMoveType.color } : undefined}
              >{evoMove}</span>
            </span>
          )}
        </div>
        <span className={styles.evolutionTrigger}>
          {itemSpriteUrl && (
            <img
              src={itemSpriteUrl}
              alt=""
              width={20}
              height={20}
              className={styles.evolutionItemSprite}
            />
          )}
          {trigger}
        </span>
      </div>
    </>
  )

  return target
    ? <Link to={`/pokemon/${target.id}`} className={styles.evolutionCard}>{cardContent}</Link>
    : <div className={styles.evolutionCard}>{cardContent}</div>
}

function EvolutionInfo({ evolution }) {
  if (!evolution) {
    return <p className={styles.noEvolution}>Does not evolve</p>
  }

  return (
    <div className={styles.evolutionList}>
      {evolution.map((evo, i) => <EvolutionCard key={i} evolution={evo} />)}
    </div>
  )
}

export default function PokemonDetail({ pokemon, apiData, apiLoading, onBack, prevPokemon, nextPokemon }) {
  const paddedId = String(pokemon.id).padStart(3, '0')
  const eggMoves = eggMovesBySpecies[pokemon.name] || []
  const evolutionMove = evolutionMovesData[pokemon.name] ?? null

  const prevFormEntry = pokemonData.reduce((found, p) => {
    if (found) return found
    const evo = p.evolution?.find(e => e.into === pokemon.name)
    return evo ? { pokemon: p, evo } : null
  }, null)

  const artwork = apiData?.sprites?.other?.['official-artwork']?.front_default
  const height = apiData ? `${(apiData.height / 10).toFixed(1)} m` : null
  const weight = apiData ? `${(apiData.weight / 10).toFixed(1)} kg` : null

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageNav}>
        <button className={styles.navBtn} onClick={onBack}>← Back</button>
        <div className={styles.prevNextBtns}>
          {prevPokemon && (
            <Link to={`/pokemon/${prevPokemon.id}`} className={styles.navBtn}>
              ‹ {prevPokemon.name}
            </Link>
          )}
          {nextPokemon && (
            <Link to={`/pokemon/${nextPokemon.id}`} className={styles.navBtn}>
              {nextPokemon.name} ›
            </Link>
          )}
        </div>
      </div>

      <div className={styles.columns}>
        {/* Left column: artwork + info + evolution */}
        <div className={styles.leftCol}>
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

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Evolution Info</h3>

            <div className={styles.evolutionGroup}>
              <p className={styles.evolutionGroupLabel}>Evolves into</p>
              {pokemon.evolution ? (
                <div className={styles.evolutionList}>
                  {pokemon.evolution.map((evo, i) => <EvolutionCard key={i} evolution={evo} />)}
                </div>
              ) : (
                <div className={styles.noEvolutionCard}>Does not evolve</div>
              )}
            </div>

            <div className={`${styles.evolutionGroup} ${styles.evolutionGroupFrom}`}>
              <p className={styles.evolutionGroupLabel}>Evolves from</p>
              {prevFormEntry ? (
                <EvolutionCard evolution={prevFormEntry.evo} pokemon={prevFormEntry.pokemon} showEvoMove={false} />
              ) : (
                <div className={styles.noEvolutionCard}>Base form</div>
              )}
            </div>
          </section>
        </div>

        {/* Right column: moves tables */}
        <div className={styles.rightCol}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Level-Up Moves</h3>
            <div className={styles.movesTable}>
              <div className={styles.movesHeader}>
                <span>Level</span>
                <span>Move</span>
                <span>Type</span>
              </div>
              {pokemon.moves.map((entry, i) => {
                const moveRecord = moveByName[entry.move]
                const type = moveRecord ? typeById[moveRecord.typeId] : null
                const RowTag = moveRecord ? Link : 'div'
                const rowProps = moveRecord ? { to: `/moves/${moveRecord.id}` } : {}
                return (
                  <RowTag key={i} className={styles.moveRow} {...rowProps}>
                    <span className={styles.moveLevel}>{entry.level}</span>
                    <span className={styles.moveName}>{entry.move}</span>
                    {type
                      ? <span className={styles.typeBadge} style={{ backgroundColor: type.color, color: type.textColor }}>{type.name}</span>
                      : <span />
                    }
                  </RowTag>
                )
              })}
            </div>
          </section>

          {evolutionMove && (() => {
            const moveRecord = moveByName[evolutionMove]
            const type = moveRecord ? typeById[moveRecord.typeId] : null
            const RowTag = moveRecord ? Link : 'div'
            const rowProps = moveRecord ? { to: `/moves/${moveRecord.id}` } : {}
            return (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Evolution Move</h3>
                <div className={styles.movesTable}>
                  <div className={styles.eggMovesHeader}>
                    <span>Move</span>
                    <span>Type</span>
                  </div>
                  <RowTag className={styles.eggMoveRow} {...rowProps}>
                    <span className={styles.moveName}>{evolutionMove}</span>
                    {type
                      ? <span className={styles.typeBadge} style={{ backgroundColor: type.color, color: type.textColor }}>{type.name}</span>
                      : <span />
                    }
                  </RowTag>
                </div>
              </section>
            )
          })()}

          {eggMoves.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Egg Moves</h3>
              <div className={styles.movesTable}>
                <div className={styles.eggMovesHeader}>
                  <span>Move</span>
                  <span>Type</span>
                </div>
                {eggMoves.map((moveName, i) => {
                  const moveRecord = moveByName[moveName]
                  const type = moveRecord ? typeById[moveRecord.typeId] : null
                  const RowTag = moveRecord ? Link : 'div'
                  const rowProps = moveRecord ? { to: `/moves/${moveRecord.id}` } : {}
                  return (
                    <RowTag key={i} className={styles.eggMoveRow} {...rowProps}>
                      <span className={styles.moveName}>{moveName}</span>
                      {type
                        ? <span className={styles.typeBadge} style={{ backgroundColor: type.color, color: type.textColor }}>{type.name}</span>
                        : <span />
                      }
                    </RowTag>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
