export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="text-xs mb-0.5">Copyright © {new Date().getFullYear()} DOTA Documentation</p>
        <p className="text-xs text-muted-foreground mb-1">
          DOTA is provided under the{' '}
          <a
            href="https://github.com/ds-horizon/dota/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dota-600 hover:underline"
          >
            MIT License
          </a>
          .
        </p>
      </div>
      <div className="footer-links">
        <a
          href="https://github.com/ds-horizon/dota"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs"
        >
          GitHub
        </a>
        <a
          href="https://reactnative.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs"
        >
          React Native
        </a>
      </div>
    </footer>
  );
}
