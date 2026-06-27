import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import MovesSection from './components/move/MovesSection'
import MoveDetailPage from './components/move/MoveDetailPage'
import PokemonSection from './components/pokemon/PokemonSection'
import PokemonDetailPage from './components/pokemon/PokemonDetailPage'
import TMsSection from './components/tm/TMsSection'
import TMDetailPage from './components/tm/TMDetailPage'
import FavoritesPage from './components/favorites/FavoritesPage'
import styles from './App.module.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const NAV_LINKS = [
  { to: '/', label: 'Pokémon', end: true },
  { to: '/moves', label: 'Moves' },
  { to: '/tms', label: 'TMs' },
  { to: '/favorites', label: 'Favorites' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

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
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </header>

      <div
        className={`${styles.drawerBackdrop} ${menuOpen ? styles.drawerBackdropOpen : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
        aria-label="Navegación"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerLogo}>❄️ Crystal Snow</span>
          <button
            className={styles.drawerClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.drawerNavLink} ${isActive ? styles.drawerNavLinkActive : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <main className={styles.main}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PokemonSection />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="/moves" element={<MovesSection />} />
          <Route path="/moves/:id" element={<MoveDetailPage />} />
          <Route path="/tms" element={<TMsSection />} />
          <Route path="/tms/:id" element={<TMDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        <p>Pokémon Crystal Snow · Fan-made Reference Guide</p>
      </footer>
    </div>
  )
}
