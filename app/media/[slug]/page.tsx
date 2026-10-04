import {notFound} from "next/navigation";
import PageHero from "../../components/PageHero";
import {images} from "../../data/site";
import {db} from "../../admin/_lib/db";

const data:{[key:string]:[string,string,string]}={photos:["Photo Gallery","Approved MWONET field photography from landscapes, projects and communities.",images.forest],videos:["Videos","Approved interviews, field documentaries and project clips.",images.community],projects:["Projects","Visual evidence linked to MWONET projects and implementation.",images.seedlings],events:["Events Media","Photos and videos from trainings, campaigns, meetings and community events.",images.farming]};
export const dynamic="force-dynamic";
export function generateStaticParams(){return Object.keys(data).map(slug=>({slug}))}

export default async function MediaDetail({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const d=data[slug];if(!d)return notFound();
 const where=slug==="photos"?{OR:[{type:"image"},{type:"photo"}]}:slug==="videos"?{type:"video"}:slug==="projects"?{OR:[{tags:{has:"project"}},{tags:{has:"projects"}}]}:{OR:[{tags:{has:"event"}},{tags:{has:"events"}}]};
 const assets=await db.mediaAsset.findMany({where,orderBy:{createdAt:"desc"},take:100});
 return <><PageHero eyebrow="Media" title={d[0]} text={d[1]} image={d[2]}/><section className="section"><div className="container"><div className="section-head"><div><p className="eyebrow">MWONET MEDIA LIBRARY</p><h2>{assets.length?"Approved media records.":"No approved media in this category yet."}</h2></div></div>{assets.length?<div className="cms-gallery">{assets.map(a=><figure key={a.id}>{(a.type==="image"||a.type==="photo")?<img src={a.url} alt={a.altText||a.title||"MWONET media"}/>:<a className="media-file-card" href={a.url} target="_blank" rel="noreferrer"><strong>{a.title||a.type.toUpperCase()}</strong><span>Open {a.type} ↗</span></a>}{(a.title||a.caption)&&<figcaption><strong>{a.title}</strong>{a.caption&&<span>{a.caption}</span>}</figcaption>}</figure>)}</div>:<div className="notice">Authorized staff can add approved photos, videos and visual evidence from Admin → Media Library. This page updates automatically from those records.</div>}</div></section></>
}
