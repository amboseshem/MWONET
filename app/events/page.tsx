import PageHero from "../components/PageHero";
import CmsPageRenderer from "../components/CmsPageRenderer";
import {images} from "../data/site";
import {getPublicCmsPage,getPublicCmsMetadata} from "../_lib/public-cms";
import {db} from "../admin/_lib/db";

export const dynamic="force-dynamic";
export default async function Events(){
 const now=new Date();
 const [cms,upcoming,past]=await Promise.all([
  getPublicCmsPage("events"),
  db.event.findMany({where:{status:"PUBLISHED",startsAt:{gte:now}},orderBy:{startsAt:"asc"},take:30}),
  db.event.findMany({where:{status:"PUBLISHED",startsAt:{lt:now}},orderBy:{startsAt:"desc"},take:12})
 ]);
 return <>{cms?<CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>:<PageHero eyebrow="Events" title="Meet. Learn. Act together." text="Upcoming campaigns, trainings, community activities and archived MWONET events." image={images.community}/>}
 <section className="section"><div className="container"><div className="section-head"><div><p className="eyebrow">UPCOMING</p><h2>Confirmed MWONET events.</h2></div></div>{upcoming.length?<div className="portal-list">{upcoming.map(e=><article key={e.id}><div><small>{e.startsAt.toLocaleString("en-KE")}</small><h3>{e.title}</h3><p>{e.description||"Official MWONET activity."}</p><p><strong>{e.venue||"Venue to be communicated"}</strong></p></div><span>{e.status}</span></article>)}</div>:<div className="notice">There are currently no published upcoming events. Administrators can add and publish events from the Events module.</div>}</div></section>
 {past.length>0&&<section className="section tint"><div className="container"><div className="section-head"><div><p className="eyebrow">ARCHIVE</p><h2>Past activities.</h2></div></div><div className="event-layout"><div>{past.map((e,i)=><article className="event-row" key={e.id}><b>{String(i+1).padStart(2,"0")}</b><div><small>{e.startsAt.toLocaleDateString("en-KE")}</small><h3>{e.title}</h3><p>{e.venue||e.description||"MWONET event"}</p></div></article>)}</div></div></div></section>}</>
}

export async function generateMetadata(){return getPublicCmsMetadata("events","MWONET Events")}
