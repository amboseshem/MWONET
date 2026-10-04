import Link from "next/link";
import PageHero from "../components/PageHero";
import CmsPageRenderer from "../components/CmsPageRenderer";
import {images,programs as programSeed} from "../data/site";
import {constitution} from "../data/constitution";
import {db} from "../admin/_lib/db";
import {getPublicCmsPage,getPublicCmsMetadata} from "../_lib/public-cms";

export const dynamic="force-dynamic";
export default async function FocusAreas(){
 const [cms,records]=await Promise.all([getPublicCmsPage("focus-areas"),db.program.findMany({orderBy:{title:"asc"},include:{_count:{select:{projects:true}}}})]);
 const rows=records.length?records:programSeed.map(p=>({...p,id:p.slug,_count:{projects:0}}));
 return <>{cms?<CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>:<PageHero eyebrow="Our work" title="Programs designed around the constitution and local realities." text="MWONET’s official objectives combine environmental restoration, agribusiness, cash crops and member finance with youth, women and food-security outcomes." image={images.seedlings}/>}<section className="section"><div className="container card-grid three">{rows.map((p,i)=>{const seed=programSeed.find(x=>x.slug===p.slug);return <article className="program-card" key={p.slug}><span className="icon">{seed?.icon||"◉"}</span><small>{String(i+1).padStart(2,"0")} · {p._count.projects} projects</small><h3>{p.title}</h3><p>{p.summary||"MWONET program."}</p><Link href={`/focus-areas/${p.slug}`}>View program →</Link></article>})}</div></section><section className="section tint"><div className="container"><div className="section-head"><div><p className="eyebrow">OFFICIAL OBJECTIVES</p><h2>Four constitutional pillars.</h2></div></div><div className="objective-grid">{constitution.objectives.map((o,i)=><article className="objective-card" key={o.title}><span>{o.icon}</span><small>ARTICLE 2 · {String(i+1).padStart(2,"0")}</small><h3>{o.title}</h3><p>{o.text}</p></article>)}</div></div></section><section className="feature-split reverse"><div className="feature-copy"><p className="eyebrow light">INTEGRATED DEVELOPMENT</p><h2>Environment, enterprise and finance belong in the same conversation.</h2><p>Tree and coffee nurseries can generate environmental and economic value. Livestock projects can strengthen household income. Member savings and responsible lending can help enterprises grow. MWONET’s program model is built around those links.</p><Link className="button light-button" href="/financial-model">Explore the financial model</Link></div><div className="feature-image" style={{backgroundImage:`url(${images.farming})`}}/></section></>
}
export async function generateMetadata(){return getPublicCmsMetadata("focus-areas","MWONET Programs & Focus Areas")}
