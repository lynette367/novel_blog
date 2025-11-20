export function SiteFooter() {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; 2025 Cross The Line. All translations published with respect for original authors.</p>
        <p style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "1rem" }}>
          Content Warning: Stories may contain mature themes. Reader discretion advised.
        </p>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Translation Policy</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
