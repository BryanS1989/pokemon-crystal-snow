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
            <a className={`${styles.navLink} ${styles.navLinkActive}`}>Moves</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Moves</h2>
          <p className={styles.pageDesc}>
            Complete reference of all <strong>242 moves</strong> in the game. Search, filter and sort by type, power, accuracy and more.
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
