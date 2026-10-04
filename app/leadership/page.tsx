import PageHero from "../components/PageHero";
import CmsPageRenderer from "../components/CmsPageRenderer";
import {images} from "../data/site";
import {constitution} from "../data/constitution";
import {getPublicCmsPage,getPublicCmsMetadata} from "../_lib/public-cms";
import {db} from "../admin/_lib/db";

export const dynamic="force-dynamic";
export default async function Leadership(){
 const [cms,leaders]=await Promise.all([getPublicCmsPage("leadership"),db.leadershipProfile.findMany({where:{active:true},orderBy:[{order:"asc"},{name:"asc"}]})]);
 return <>{cms?<CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>:<PageHero eyebrow="Leadership" title="An elected executive structure with defined responsibilities." text="MWONET leadership combines constitutional offices with verified profiles managed through the administration system." image={images.community}/>}
 <section className="section"><div className="container"><div className="section-head"><div><p className="eyebrow">OFFICIAL LEADERSHIP</p><h2>{leaders.length?"Verified office holders.":"Constitutional leadership structure."}</h2></div></div><div className="leader-grid">{leaders.length?leaders.map((l,i)=><article className="leader-card" key={l.id}><div className="leader-photo leadership-photo" style={{backgroundImage:`linear-gradient(0deg,rgba(7,46,31,.55),rgba(7,46,31,.08)),url(${l.photoUrl||images.community})`}}>{!l.photoUrl&&<span>MWONET</span>}</div><div><small>OFFICE {String(i+1).padStart(2,"0")}</small><h3>{l.name}</h3><strong>{l.role}</strong><p>{l.bio||"Official MWONET leader."}</p><small>{[l.email,l.phone].filter(Boolean).join(" · ")}</small></div></article>):constitution.officials.map((o,i)=><article className="leader-card" key={o.role}><div className="leader-photo leadership-photo" style={{backgroundImage:`linear-gradient(0deg,rgba(7,46,31,.55),rgba(7,46,31,.08)),url(${images.community})`}}><span>OFFICE</span></div><div><small>OFFICE {String(i+1).padStart(2,"0")}</small><h3>{o.role}</h3><p>{o.duty}</p></div></article>)}</div></div></section></>
}

export async function generateMetadata(){return getPublicCmsMetadata("leadership","MWONET Leadership")}
