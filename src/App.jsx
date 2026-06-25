import { Outlet, NavLink } from 'react-router-dom';
import PersistentDisclaimer from './components/PersistentDisclaimer.jsx';

export default function App() {
  return (
    <div className="app-shell">
      {/* Rule #3: persistent disclaimer, visible on every page, not dismissible. */}
      <PersistentDisclaimer />

      <header className="site-header">
        <div className="site-header-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark">❧</span>
            <span className="brand-text">
              <strong>The Home Apothecary Archive</strong>
              <small>A historical reference, not medical advice</small>
            </span>
          </NavLink>
          <nav className="main-nav">
            <NavLink to="/" end>
              Search
            </NavLink>
            <NavLink to="/browse">Browse by source</NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>
          This archive reproduces remedies from named public-domain historical
          texts for reference and study. The historical claims shown are{' '}
          <strong>what those texts state</strong> — they are not endorsements,
          recommendations, or instructions. Many historical remedies are
          ineffective or dangerous by modern understanding.{' '}
          <strong>
            Always consult a qualified healthcare professional for any actual
            health concern.
          </strong>
        </p>
        <p className="footer-sources">
          Phase 1 sources: <em>The Complete Herbal</em> (Nicholas Culpeper,
          1653) and <em>A Book of Simples</em> (transcribed by Henry William
          Lewer, published 1908). Both public domain, via Project Gutenberg.
        </p>
      </footer>
    </div>
  );
}
