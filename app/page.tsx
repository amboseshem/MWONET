const focusAreas = [
  { icon: "🌿", title: "Environmental Conservation", text: "Protecting ecosystems, forests, water sources and natural resources for resilient communities." },
  { icon: "🌍", title: "Climate & Environment", text: "Promoting practical climate action, restoration and environmental awareness." },
  { icon: "🌳", title: "Tree Planting & Restoration", text: "Supporting tree nurseries, reforestation and restoration of degraded landscapes." },
  { icon: "👥", title: "Youth Empowerment", text: "Creating opportunities for young people to participate, learn and lead community action." },
  { icon: "🌾", title: "Sustainable Agriculture", text: "Encouraging farming practices that protect soil, water and long-term productivity." },
  { icon: "🤝", title: "Community Development", text: "Working with communities and partners on practical initiatives that improve livelihoods." },
];

const environmentStories = [
  ["01", "Mount Elgon", "A visual story of the mountain, its forests, ecosystems, communities and natural heritage."],
  ["02", "Soil & Slopes", "Exploring the effects of farming and erosion on slopes and the need for sustainable land management."],
  ["03", "Restoration", "Showing how tree nurseries, planting and community action can contribute to healthier landscapes."],
];

export default function Home() {
  return (
    <main>
      <header className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#home"><span className="brand-mark">M</span><span>MWONET</span></a>
          <nav>
            <a href="#about">About</a><a href="#focus">Focus Areas</a><a href="#elgon">Mount Elgon</a><a href="#media">Media</a><a href="#leadership">Leadership</a><a href="#contact">Contact</a>
          </nav>
          <a className="nav-cta" href="#get-involved">Get Involved</a>
        </div>
      </header>

      <section id="home" className="hero hero-nature">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-copy">
            <p className="eyebrow">MAANISHA WESTERN ORGANIZATION NETWORK</p>
            <h1>People. Nature.<br /><span>Lasting Impact.</span></h1>
            <p className="lead">Working with communities to protect nature, empower young people and build sustainable solutions for the future.</p>
            <div className="actions"><a className="button primary" href="#focus">Explore our work</a><a className="button glass" href="#get-involved">Get involved</a></div>
          </div>
          <div className="hero-badge"><span>EXPLORING</span><strong>Mount Elgon</strong><small>Nature • Community • Restoration</small></div>
        </div>
        <div className="scroll-cue">SCROLL TO EXPLORE ↓</div>
      </section>

      <section id="about" className="section intro">
        <div className="container two-col">
          <div><p className="eyebrow">ABOUT MWONET</p><h2>A community network committed to a healthier, more resilient future.</h2></div>
          <div><p>MWONET is an NGO working with communities, young people and partners to respond to environmental and development challenges through practical, inclusive action.</p><p className="placeholder-note">Official history, vision, mission, objectives and core values will be updated from the organization&apos;s constitution.</p></div>
        </div>
        <div className="container values-strip"><div><b>01</b><span>Community-led</span></div><div><b>02</b><span>Inclusive</span></div><div><b>03</b><span>Sustainable</span></div><div><b>04</b><span>Partnership-driven</span></div></div>
      </section>

      <section id="focus" className="section soft">
        <div className="container"><p className="eyebrow">WHAT WE DO</p><h2>Focus areas for meaningful change.</h2><p className="section-lead">A flexible program structure ready to be refined against the official MWONET constitution and focus areas.</p><div className="cards six">{focusAreas.map((p, i) => <article className="card feature-card" key={p.title}><span className="feature-icon">{p.icon}</span><span className="card-number">0{i + 1}</span><h3>{p.title}</h3><p>{p.text}</p><a href="#get-involved">Learn more →</a></article>)}</div></div>
      </section>

      <section id="elgon" className="section elgon-section">
        <div className="container"><div className="section-heading"><div><p className="eyebrow">OUR ENVIRONMENT</p><h2>Mount Elgon: a landscape worth protecting.</h2></div><p>From forests and biodiversity to farms, water sources and community livelihoods, this section will tell the environmental story through authentic MWONET photography and video.</p></div>
          <div className="story-grid">{environmentStories.map(([num, title, text]) => <article className="story-card" key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          <div className="feature-banner"><div><p className="eyebrow">COMING TO LIFE WITH YOUR MEDIA</p><h3>Nature, people and restoration — told visually.</h3><p>We will replace these placeholders with the organization&apos;s Mount Elgon photographs, videos, animations and project documentation.</p></div><a className="button primary" href="#media">View media</a></div>
        </div>
      </section>

      <section className="section nursery">
        <div className="container nursery-grid"><div className="photo-placeholder"><span>PHOTO / VIDEO</span><strong>Youth tree nursery</strong><small>Insert authentic MWONET nursery imagery</small></div><div><p className="eyebrow">TREE NURSERY & RESTORATION</p><h2>Growing seedlings. Growing responsibility.</h2><p>Highlighting boys and girls working in nurseries, preparing seedlings, planting trees and restoring degraded land.</p><div className="stats"><div><strong>01</strong><span>Nurseries</span></div><div><strong>02</strong><span>Planting</span></div><div><strong>03</strong><span>Restoration</span></div></div></div></div>
      </section>

      <section className="section youth soft"><div className="container two-col"><div><p className="eyebrow">YOUTH & COMMUNITY</p><h2>Young people at the centre of positive action.</h2></div><div><p>The website will showcase youth participation, community initiatives and measurable success stories using real photographs, project reports and testimonies supplied by MWONET.</p><a className="text-link" href="#get-involved">See how to participate →</a></div></div></section>

      <section id="media" className="section media"><div className="container"><div className="section-heading"><div><p className="eyebrow">MEDIA</p><h2>Stories from the field.</h2></div><p>Photos, videos, events and projects will become an immersive visual library as official media is provided.</p></div><div className="media-grid"><div className="media-tile large"><span>PHOTO GALLERY</span><strong>Mount Elgon & nature</strong></div><div className="media-tile"><span>VIDEO</span><strong>Community stories</strong></div><div className="media-tile"><span>PROJECTS</span><strong>Restoration in action</strong></div><div className="media-tile"><span>EVENTS</span><strong>Youth & community</strong></div></div></div></section>

      <section id="leadership" className="section soft"><div className="container"><p className="eyebrow">LEADERSHIP</p><h2>People behind the mission.</h2><p className="section-lead">Official names, positions and photographs will be added from the information supplied by MWONET.</p><div className="leaders"><div className="leader"><div className="portrait">PHOTO</div><strong>Official leadership profile</strong><span>Position to be confirmed</span></div><div className="leader"><div className="portrait">PHOTO</div><strong>Official member profile</strong><span>Position to be confirmed</span></div><div className="leader"><div className="portrait">PHOTO</div><strong>Official member profile</strong><span>Position to be confirmed</span></div></div></div></section>

      <section className="section updates"><div className="container two-col"><div><p className="eyebrow">NEWS & EVENTS</p><h2>Keep the community informed.</h2></div><div className="update-list"><article><span>NEWS</span><strong>MWONET updates will appear here.</strong><p>Stories, announcements and project milestones.</p></article><article><span>EVENT</span><strong>Upcoming community activities.</strong><p>Events, campaigns and opportunities to participate.</p></article></div></div></section>

      <section id="get-involved" className="section involvement"><div className="container"><p className="eyebrow">GET INVOLVED</p><h2>There is a place for you in the work.</h2><div className="involve-grid"><div><b>Volunteer</b><p>Offer time, skills and ideas to community initiatives.</p></div><div><b>Partner</b><p>Collaborate with MWONET on programs and impact.</p></div><div><b>Support</b><p>Help strengthen environmental and youth initiatives.</p></div><div><b>Donate</b><p>Support projects and restoration work.</p></div></div></div></section>

      <section className="section partners soft"><div className="container"><p className="eyebrow">PARTNERS & COLLABORATORS</p><h2>Building impact together.</h2><p className="section-lead">Partner logos and verified collaborator profiles will be added once supplied.</p><div className="partner-row"><span>PARTNER</span><span>PARTNER</span><span>PARTNER</span><span>PARTNER</span><span>PARTNER</span></div></div></section>

      <section id="contact" className="section contact"><div className="container contact-grid"><div><p className="eyebrow">CONTACT MWONET</p><h2>Let&apos;s work together.</h2><p>For partnerships, programs, volunteering and general enquiries, use the official MWONET channels.</p><div className="contact-actions"><a className="button primary" href="mailto:info@mwonet.org">Email MWONET</a><a className="button secondary" href="#home">Back to top ↑</a></div></div><div className="contact-card"><p><span>Official email</span><a href="mailto:info@mwonet.org">info@mwonet.org</a></p><p><span>Additional email</span><a href="mailto:chesebe@mwonet.org">chesebe@mwonet.org</a></p><p><span>Website</span><strong>www.mwonet.org</strong></p><p><span>Location</span><strong>To be confirmed</strong></p></div></div></section>

      <footer><div className="container footer-inner"><div><a className="brand" href="#home"><span className="brand-mark">M</span><span>MWONET</span></a><p>People • Nature • Lasting Impact</p></div><div><span>© {new Date().getFullYear()} MWONET. All rights reserved.</span><br /><small>Official content and organizational details subject to confirmation.</small></div></div></footer>
    </main>
  );
}
