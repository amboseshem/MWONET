import Link from "next/link";
import PageHero from "../components/PageHero";
import CmsPageRenderer from "../components/CmsPageRenderer";
import {images} from "../data/site";
import {getPublicCmsPage,getPublicCmsMetadata} from "../_lib/public-cms";
import {db} from "../admin/_lib/db";

export const dynamic="force-dynamic";
export default async function Partners(){
 const [cms,partners]=await Promise.all([getPublicCmsPage("partners"),db.partner.findMany({where:{active:true},orderBy:{name:"asc"}})]);
 return <>{cms?<CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>:<PageHero eyebrow="Partners & collaborators" title="Impact grows through partnership." text="A dedicated space for institutions, communities, donors, technical partners and collaborators working alongside MWONET." image={images.community}/>}
 <section className="section"><div className="container"><div className="section-head"><div><p className="eyebrow">COLLABORATORS</p><h2>Organizations working with MWONET.</h2></div></div>{partners.length?<div className="partner-logo-grid">{partners.map(p=><article key={p.id} className="partner-card">{p.logoUrl?<img src={p.logoUrl} alt={p.name+" logo"}/>:<div className="partner-mark">{p.name.slice(0,2).toUpperCase()}</div>}<h3>{p.name}</h3><small>{p.category||"Partner"}</small><p>{p.description||""}</p>{p.website&&<a href={p.website} target="_blank" rel="noreferrer">Visit website ↗</a>}</article>)}</div>:<div className="notice">Partner profiles will appear here after an authorized administrator adds and verifies them.</div>}</div></section><section className="section tint"><div className="container cta-box"><div><p className="eyebrow">WORK WITH US</p><h2>Bring expertise, resources and local knowledge together.</h2></div><Link className="button primary" href="/get-involved/partner">Become a partner</Link></div></section></>
}

export async function generateMetadata(){return getPublicCmsMetadata("partners","MWONET Partners")}
