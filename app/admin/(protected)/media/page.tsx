import Link from "next/link";
import {db} from "../../_lib/db";
import {createMediaAction,deleteMediaAction,updateMediaAction} from "./actions";

export const dynamic="force-dynamic";

function qs(value:string|undefined){return (value||"").trim()}
function isImage(type:string){return type.toLowerCase().startsWith("image")||type.toLowerCase()==="photo"}

export default async function AdminMedia({searchParams}:{searchParams:Promise<{q?:string;type?:string;tag?:string;edit?:string}>}){
 const sp=await searchParams; const q=qs(sp.q),type=qs(sp.type),tag=qs(sp.tag),edit=qs(sp.edit);
 const where:any={};
 if(type&&type!=="all")where.type=type;
 if(tag)where.tags={has:tag};
 if(q)where.OR=[{title:{contains:q,mode:"insensitive"}},{altText:{contains:q,mode:"insensitive"}},{caption:{contains:q,mode:"insensitive"}},{url:{contains:q,mode:"insensitive"}}];
 const [items,total,images,documents,videos,editing]=await Promise.all([
  db.mediaAsset.findMany({where,orderBy:{createdAt:"desc"},take:100,include:{uploader:true}}),
  db.mediaAsset.count(),
  db.mediaAsset.count({where:{OR:[{type:"image"},{type:"photo"}]}}),
  db.mediaAsset.count({where:{type:"document"}}),
  db.mediaAsset.count({where:{type:"video"}}),
  edit?db.mediaAsset.findUnique({where:{id:edit}}):Promise.resolve(null)
 ]);
 const allTags=[...new Set((await db.mediaAsset.findMany({select:{tags:true}})).flatMap(x=>x.tags))].sort();
 return <main className="admin-content">
  <div className="admin-page-head"><div><span className="admin-breadcrumb">MWONET Admin / Website</span><h1>Media Library</h1><p>Centralize approved photos, videos, documents and reusable visual assets. Metadata, accessibility text and audit history stay in one place.</p></div><span className="admin-badge">{total} assets</span></div>
  <section className="admin-stat-grid"><article className="admin-stat"><small>TOTAL ASSETS</small><strong>{total}</strong><span>Managed media records</span></article><article className="admin-stat"><small>IMAGES</small><strong>{images}</strong><span>Photos and graphics</span></article><article className="admin-stat"><small>VIDEOS</small><strong>{videos}</strong><span>Linked video assets</span></article><article className="admin-stat"><small>DOCUMENTS</small><strong>{documents}</strong><span>Reports and downloadable files</span></article></section>
  <div className="admin-grid"><div>
   <section className="admin-panel"><div className="admin-panel-head"><h2>Library</h2><span className="admin-badge">{items.length} shown</span></div>
    <form className="admin-form admin-form-grid" method="get"><label>Search<input name="q" defaultValue={q} placeholder="Title, caption, alt text or URL"/></label><label>Type<select name="type" defaultValue={type||"all"}><option value="all">All media</option><option value="image">Images</option><option value="video">Videos</option><option value="document">Documents</option><option value="audio">Audio</option></select></label><label>Tag<select name="tag" defaultValue={tag}><option value="">All tags</option>{allTags.map(t=><option key={t}>{t}</option>)}</select></label><div style={{display:"flex",alignItems:"end",gap:8}}><button className="admin-primary" type="submit">Filter</button><Link className="admin-secondary" href="/admin/media">Reset</Link></div></form>
    {items.length===0?<div className="admin-empty"><strong>No media found</strong>Add an approved asset using the form on the right or adjust your filters.</div>:<div className="admin-media-grid">{items.map(item=><article className="admin-media-card" key={item.id}>{isImage(item.type)?<div className="admin-media-preview" style={{backgroundImage:`url(${item.url})`}}/>:<div className="admin-media-preview admin-media-file"><span>{item.type.toUpperCase()}</span></div>}<div className="admin-media-body"><span className="admin-badge gray">{item.type}</span><h3>{item.title||"Untitled asset"}</h3><p>{item.caption||item.altText||"No caption added."}</p><small>{item.tags.length?item.tags.join(" · "):"No tags"}</small><small>Added {item.createdAt.toLocaleDateString("en-KE")} {item.uploader?.email?`by ${item.uploader.email}`:""}</small><div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}><Link className="admin-secondary" href={`/admin/media?edit=${item.id}`}>Edit</Link><a className="admin-secondary" href={item.url} target="_blank" rel="noreferrer">Open ↗</a><form action={deleteMediaAction}><input type="hidden" name="id" value={item.id}/><button className="admin-danger" type="submit">Delete</button></form></div></div></article>)}</div>}
   </section>
  </div><aside className="admin-side-stack">
   <section className="admin-editor-section"><h3>{editing?"Edit asset":"Add media asset"}</h3><p className="admin-section-note">Use a stable public URL from your approved storage/provider. The MWONET database stores the library record, metadata, tags and ownership trail.</p><form className="admin-form" action={editing?updateMediaAction:createMediaAction}>{editing&&<input type="hidden" name="id" value={editing.id}/>}<label>Asset type<select name="type" defaultValue={editing?.type||"image"}><option value="image">Image</option><option value="video">Video</option><option value="document">Document</option><option value="audio">Audio</option></select></label><label>Public asset URL<input name="url" defaultValue={editing?.url||""} placeholder="https://..." required/></label><label>Title<input name="title" defaultValue={editing?.title||""} placeholder="Mount Elgon restoration activity"/></label><label>Alternative text<input name="altText" defaultValue={editing?.altText||""} placeholder="Describe the image clearly"/></label><label>Caption<textarea name="caption" rows={3} defaultValue={editing?.caption||""}/></label><label>Tags<input name="tags" defaultValue={editing?.tags.join(", ")||""} placeholder="mount-elgon, nursery, youth"/></label><label>Provider ID (optional)<input name="providerId" defaultValue={editing?.providerId||""} placeholder="Cloudinary / storage asset ID"/></label><button className="admin-primary" type="submit">{editing?"Save asset":"Add to library"}</button>{editing&&<Link className="admin-secondary" href="/admin/media">Cancel edit</Link>}</form></section>
   <section className="admin-editor-section"><h3>Media standards</h3><div className="admin-config-list"><span className="admin-section-note">Use authentic, high-resolution Kenyan/African community imagery wherever possible.</span><span className="admin-section-note">Always provide meaningful alternative text for accessibility and SEO.</span><span className="admin-section-note">Do not upload copyrighted material without permission or a valid license.</span><span className="admin-section-note">Use descriptive tags such as Mount Elgon, tree nursery, youth, coffee, livestock, leadership and events.</span><span className="admin-section-note">For documents, use clear file titles and stable URLs so published downloads do not break.</span></div></section>
   <section className="admin-editor-section"><h3>Storage connection</h3><p className="admin-section-note">The media manager is complete at application level. Direct binary file upload requires a persistent object-storage provider because Vercel deployments have a read-only runtime filesystem. Until one is connected, add media by stable public URL; no fake local upload is exposed.</p></section>
  </aside></div>
 </main>
}
