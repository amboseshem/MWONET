import Link from "next/link";
import PageHero from "../components/PageHero";
import CmsPageRenderer from "../components/CmsPageRenderer";
import {images} from "../data/site";
import {getPublicCmsPage,getPublicCmsMetadata} from "../_lib/public-cms";
import {db} from "../admin/_lib/db";

export const dynamic="force-dynamic";
export default async function News(){
 const [cms,posts]=await Promise.all([getPublicCmsPage("news"),db.post.findMany({where:{status:"PUBLISHED"},orderBy:{publishedAt:"desc"},take:30})]);
 return <>{cms?<CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>:<PageHero eyebrow="News & updates" title="What is happening at MWONET." text="Announcements, field stories, project milestones, opportunities and community updates." image={images.forest}/>}
 <section className="section"><div className="container"><div className="section-head"><div><p className="eyebrow">LATEST STORIES</p><h2>Verified MWONET updates.</h2></div></div>{posts.length?<div className="news-grid">{posts.map((p,i)=>{const body=(p.content&&typeof p.content==="object"&&!Array.isArray(p.content)?(p.content as Record<string,unknown>).body:"");return <article className="news-card" key={p.id}><div className="news-image" style={{backgroundImage:`url(${i%3===1?images.community:i%3===2?images.seedlings:images.forest})`}}/><div><small>{p.publishedAt?.toLocaleDateString("en-KE")||"NEWS"}</small><h3>{p.title}</h3><p>{p.excerpt||String(body||"").slice(0,180)}</p><Link href={"/news/"+p.slug}>Read story →</Link></div></article>})}</div>:<div className="notice">No public news has been published yet. Draft stories remain private until an authorized editor publishes them.</div>}</div></section></>
}

export async function generateMetadata(){return getPublicCmsMetadata("news","MWONET News")}
