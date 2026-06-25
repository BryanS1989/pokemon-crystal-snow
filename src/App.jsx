import { Routes, Route, NavLink } from 'react-router-dom'
import MovesSection from './components/move/MovesSection'
import MoveDetailPage from './components/move/MoveDetailPage'
import PokemonSection from './components/pokemon/PokemonSection'
import PokemonDetailPage from './components/pokemon/PokemonDetailPage'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>❄️</span>
            <div>
              <h1 className={styles.logoTitle}>Pokémon Crystal Snow</h1>
              <p className={styles.logoSub}>Adventure Guide</p>
            </div>
          </div>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              Moves
            </NavLink>
            <NavLink
              to="/pokemon"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              Pokémon
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<MovesSection />} />
          <Route path="/moves/:id" element={<MoveDetailPage />} />
          <Route path="/pokemon" element={<PokemonSection />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        <p>Pokémon Crystal Snow · Fan-made Reference Guide</p>
      </footer>
    </div>
  )
}
