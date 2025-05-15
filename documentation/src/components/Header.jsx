import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <Link to="/" className="logo-link">
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="logo-icon"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
              <span className="logo-text">DOTA</span>
              <span className="logo-badge">DOCS</span>
            </Link>
          </div>
        </div>

        <div className="header-center">
          <SearchBar />
        </div>

        <div className="header-right">
          <div className="header-links-container">
            <nav className="nav">
              <ul className="nav-list">
                <li className="nav-item nav-link-item">
                  <Link to="/documentation/introduction" className="nav-link">
                    Documentation
                  </Link>
                </li>
                <li className="nav-item nav-link-item">
                  <Link to="/documentation/contribution" className="nav-link">
                    Contribute
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-icons">
            <a
              href="https://github.com/dream-sports-labs/dota"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="github-icon"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
