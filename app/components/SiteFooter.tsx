import Link from "next/link";

export default function SiteFooter(){
  return <footer className="site-footer"><div className="container footer-grid">
    <div><Link href="/" className="logo footer-logo"><span className="logo-symbol"><i>▲</i><b>⌁</b></span><span><strong>MWONET</strong><small>People • Nature • Lasting Impact</small></span></Link><p>Community-led environmental action, youth empowerment and sustainable development around Mount Elgon and beyond.</p></div>
    <div><h4>Explore</h4><Link href="/about">About</Link><Link href="/focus-areas">Programs</Link><Link href="/mount-elgon">Mount Elgon</Link><Link href="/media">Media</Link></div>
    <div><h4>Connect</h4><Link href="/get-involved/volunteer">Volunteer</Link><Link href="/get-involved/partner">Partner</Link><Link href="/events">Events</Link><Link href="/contact">Contact</Link></div>
    <div><h4>Official contact</h4><a href="mailto:info@mwonet.org">info@mwonet.org</a><a href="mailto:chesebe@mwonet.org">chesebe@mwonet.org</a><Link href="/sign-in">Member sign in</Link></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} MWONET. All rights reserved.</span><span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></span></div></footer>
}
