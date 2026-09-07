import Link from "next/link";

const nav = [
  ["About", "/about"],
  ["Programs", "/focus-areas"],
  ["Mount Elgon", "/mount-elgon"],
  ["Media", "/media"],
  ["Leadership", "/leadership"],
  ["News", "/news"],
  ["Contact", "/contact"],
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="MWONET home">
          <span className="logo-symbol" aria-hidden="true"><i>▲</i><b>⌁</b></span>
          <span><strong>MWONET</strong><small>Maanisha Western Organization Network</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="signin-link" href="/sign-in">Sign in</Link>
          <Link className="nav-cta" href="/get-involved">Get involved</Link>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open menu">☰</summary>
          <div>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/sign-in">Sign in</Link><Link href="/get-involved">Get involved</Link></div>
        </details>
      </div>
    </header>
  );
}
