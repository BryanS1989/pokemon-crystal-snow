import MovesSection from './components/MovesSection'
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
            <a className={`${styles.navLink} ${styles.navLinkActive}`}>Movimientos</a>
            <a className={styles.navLink} title="Próximamente">Pokémon</a>
            <a className={styles.navLink} title="Próximamente">Items</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Movimientos</h2>
          <p className={styles.pageDesc}>
            Referencia completa de los <strong>242 movimientos</strong> del juego. Busca, filtra y ordena por tipo, poder, precisión y más.
          </p>
        </div>
        <MovesSection />
      </main>

      <footer className={styles.footer}>
        <p>Pokémon Crystal Snow · Fan-made Reference Guide</p>
      </footer>
    </div>
  )
}
