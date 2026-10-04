import Link from "next/link";
import PageHero from "../components/PageHero";
import CmsPageRenderer from "../components/CmsPageRenderer";
import {images} from "../data/site";
import {getPublicCmsPage,getPublicCmsMetadata} from "../_lib/public-cms";
import {db} from "../admin/_lib/db";

const items=[["photos","Photo Gallery","Authentic images from landscapes, projects and communities.",images.forest],["videos","Videos","Field stories, interviews and environmental features.",images.community],["projects","Projects","Visual documentation of MWONET initiatives and results.",images.seedlings],["events","Events","Campaigns, trainings, meetings and community activities.",images.farming]];
export const dynamic="force-dynamic";
export default async function Media(){
 const [cms,assets]=await Promise.all([getPublicCmsPage("media"),db.mediaAsset.findMany({orderBy:{createdAt:"desc"},take:24})]);
 return <>{cms?<CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>:<PageHero eyebrow="Media centre" title="Stories from the field." text="A professional home for MWONET photos, videos, projects, events and visual evidence of impact." image={images.forest}/>}
 <section className="section"><div className="container media-category-grid">{items.map(([slug,title,text,img])=><Link className="media-category" key={slug} href={"/media/"+slug} style={{backgroundImage:`linear-gradient(0deg,rgba(5,31,22,.82),rgba(5,31,22,.12)),url(${img})`}}><small>MEDIA</small><strong>{title}</strong><span>{text}</span></Link>)}</div></section>
 {assets.length>0&&<section className="section tint"><div className="container"><div className="section-head"><div><p className="eyebrow">RECENT MEDIA</p><h2>Approved library assets.</h2></div></div><div className="cms-gallery">{assets.filter(a=>a.type==="image"||a.type==="photo").slice(0,12).map(a=><figure key={a.id}><img src={a.url} alt={a.altText||a.title||"MWONET media"}/>{(a.title||a.caption)&&<figcaption><strong>{a.title}</strong>{a.caption&&<span>{a.caption}</span>}</figcaption>}</figure>)}</div></div></section>}</>
}

export async function generateMetadata(){return getPublicCmsMetadata("media","MWONET Media")}
