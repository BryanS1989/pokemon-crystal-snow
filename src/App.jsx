import MovesSection from './components/move/MovesSection'
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
        <MovesSection />
      </main>

      <footer className={styles.footer}>
        <p>Pokémon Crystal Snow · Fan-made Reference Guide</p>
      </footer>
    </div>
  )
}
