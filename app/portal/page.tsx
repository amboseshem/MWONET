import Link from "next/link";
const modules=[
 ["Member profile","Identity, contact details, membership status, location and constitutional eligibility."],
 ["Subscriptions","Registration fee, monthly subscription history and payment status."],
 ["Projects","Participation in tree nurseries, coffee, poultry, goat, conservation and community activities."],
 ["Savings & revolving fund","Future savings balances, loan eligibility, guarantors, repayments and transaction history."],
 ["Meetings & voting","Attendance, AGM notices, meeting records and future digital participation tools."],
 ["Training & opportunities","Skills sessions, enterprise opportunities, climate-action activities and community outreach."],
 ["Impact record","Volunteer hours, seedlings raised/planted, projects joined and verified achievements."],
 ["Announcements","Personalized organizational notices, event reminders and member communications."],
 ["Documents","Future access to approved policies, constitution updates, reports and member resources."]
];
export default function Portal(){return <section className="section"><div className="container portal-shell"><p className="eyebrow">MWONET MEMBER PORTAL</p><h1>A future digital record of membership, participation and impact.</h1><p className="big-copy">The portal structure is being prepared to support transparent member administration and project tracking without pretending that a secure backend already exists.</p><p className="notice">Authentication, database storage, payment records and loan data are not live yet. They will only be activated after a secure database, role permissions and account-verification layer are implemented.</p><div className="portal-module-grid">{modules.map(([title,text],i)=><article className="portal-module" key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="cta-actions portal-actions"><Link className="button primary" href="/sign-in">Member sign in</Link><Link className="button primary" href="/membership">Membership requirements</Link></div></div></section>}
