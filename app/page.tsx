const programs = [
  { title: "Community Development", text: "Supporting practical initiatives that strengthen communities and create sustainable opportunities." },
  { title: "Youth Empowerment", text: "Equipping young people with skills, opportunities and platforms to participate in positive change." },
  { title: "Partnerships", text: "Working with communities, institutions and development partners to expand meaningful impact." },
];

export default function Home() {
  return (
    <main>
      <header className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#home"><span className="brand-mark">M</span><span>MWONET</span></a>
          <nav>
            <a href="#about">About</a>
            <a href="#programs">Programs</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section id="home" className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">MAANISHA ORGANIZATION NETWORK</p>
            <h1>Creating opportunity. Building stronger communities.</h1>
            <p className="lead">MWONET is committed to community-focused action, empowerment and partnerships that help people and communities move forward.</p>
            <div className="actions">
              <a className="button primary" href="#programs">Explore our work</a>
              <a className="button secondary" href="#contact">Get in touch</a>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-icon">✦</div>
            <p>Community</p><strong>Impact</strong>
            <span>People • Partnership • Progress</span>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container two-col">
          <div><p className="eyebrow">ABOUT MWONET</p><h2>A platform for meaningful local impact.</h2></div>
          <div><p>MWONET is an NGO focused on initiatives that respond to community needs and create pathways for sustainable development.</p><p>Our work is built around collaboration, inclusion and practical solutions that can make a lasting difference.</p></div>
        </div>
      </section>

      <section id="programs" className="section soft">
        <div className="container"><p className="eyebrow">WHAT WE DO</p><h2>Our focus areas</h2><div className="cards">{programs.map((p) => <article className="card" key={p.title}><div className="card-number">0{programs.indexOf(p)+1}</div><h3>{p.title}</h3><p>{p.text}</p></article>)}</div></div>
      </section>

      <section className="cta"><div className="container cta-inner"><div><p className="eyebrow">PARTNER WITH US</p><h2>Let's create impact together.</h2></div><a className="button light" href="#contact">Contact MWONET</a></div></section>

      <section id="contact" className="section"><div className="container contact-grid"><div><p className="eyebrow">CONTACT</p><h2>Connect with MWONET</h2><p>For partnerships, programs and general enquiries, contact the organization through its official channels.</p></div><div className="contact-card"><p><span>Email</span><a href="mailto:info@mwonet.org">info@mwonet.org</a></p><p><span>Website</span><strong>www.mwonet.org</strong></p></div></div></section>

      <footer><div className="container footer-inner"><span>© {new Date().getFullYear()} MWONET. All rights reserved.</span><span>Professional NGO Website</span></div></footer>
    </main>
  );
}
