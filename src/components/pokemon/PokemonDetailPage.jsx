import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import pokemonData from '../../data/pokemon.json'
import PokemonDetail from './PokemonDetail'

export default function PokemonDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const idx = pokemonData.findIndex(p => p.id === Number(id))
  const pokemon = idx !== -1 ? pokemonData[idx] : null
  const prevPokemon = idx > 0 ? pokemonData[idx - 1] : null
  const nextPokemon = idx < pokemonData.length - 1 ? pokemonData[idx + 1] : null

  const [apiData, setApiData] = useState(null)
  const [apiLoading, setApiLoading] = useState(true)

  useEffect(() => {
    setApiData(null)
    setApiLoading(true)
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
      .then(data => { setApiData(data); setApiLoading(false) })
      .catch(() => setApiLoading(false))
  }, [id])

  if (!pokemon) {
    return <p style={{ color: 'var(--text-muted)', padding: '32px' }}>Pokémon not found.</p>
  }

  return (
    <PokemonDetail
      pokemon={pokemon}
      apiData={apiData}
      apiLoading={apiLoading}
      onBack={() => navigate('/')}
      prevPokemon={prevPokemon}
      nextPokemon={nextPokemon}
    />
  )
}
