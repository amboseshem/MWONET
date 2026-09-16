import Link from "next/link";

type Block={type:string;position:number;data:unknown};
const asObj=(v:unknown)=>(v&&typeof v==="object"&&!Array.isArray(v)?v as Record<string,unknown>:{});
const str=(v:unknown)=>typeof v==="string"?v:"";
const arr=(v:unknown)=>Array.isArray(v)?v.map(String):[];

export default function CmsPageRenderer({title,description,blocks}:{title:string;description?:string|null;blocks:Block[]}){
 const by=(type:string)=>asObj(blocks.find(b=>b.type===type)?.data);
 const hero=by("hero"),rich=by("rich-text"),image=by("image"),cta=by("cta"),gallery=by("gallery"),stats=by("stats"),video=by("video"),downloads=by("downloads"),form=by("form");
 const galleryImages=arr(gallery.images),statItems=arr(stats.items),downloadItems=arr(downloads.items);
 return <>
  <section className="page-hero-pro" style={str(hero.image)?{backgroundImage:`linear-gradient(0deg,rgba(7,45,31,.78),rgba(7,45,31,.35)),url(${str(hero.image)})`}:undefined}><div className="container"><p className="eyebrow">{str(hero.eyebrow)||"MWONET"}</p><h1>{str(hero.heading)||title}</h1><p className="page-lead">{str(hero.text)||description}</p>{str(hero.buttonLabel)&&str(hero.buttonHref)&&<div className="hero-actions"><Link className="button primary" href={str(hero.buttonHref)}>{str(hero.buttonLabel)}</Link></div>}</div></section>
  {(str(rich.heading)||str(rich.body))&&<section className="section"><div className="container intro-grid"><div><p className="eyebrow">MWONET</p><h2>{str(rich.heading)||title}</h2></div><div className="big-copy cms-prose">{str(rich.body).split(/\n\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div></div></section>}
  {str(image.url)&&<section className="section tint"><div className="container"><figure className="cms-feature"><img src={str(image.url)} alt={str(image.alt)||title}/>{str(image.caption)&&<figcaption>{str(image.caption)}</figcaption>}</figure></div></section>}
  {galleryImages.length>0&&<section className="section"><div className="container"><div className="section-head"><div><p className="eyebrow">MEDIA</p><h2>{str(gallery.heading)||"From the field"}</h2></div></div><div className="cms-gallery">{galleryImages.map((url,i)=><img key={url+i} src={url} alt={`${title} gallery image ${i+1}`}/>)}</div></div></section>}
  {statItems.length>0&&<section className="section dark"><div className="container"><div className="section-head"><div><p className="eyebrow light">IMPACT</p><h2>{str(stats.heading)||"Our impact"}</h2></div></div><div className="cms-stats">{statItems.map((item,i)=>{const [number,...rest]=item.split("|");return <article key={i}><strong>{number.trim()}</strong><span>{rest.join("|").trim()}</span></article>})}</div></div></section>}
  {str(video.url)&&<section className="section tint"><div className="container"><h2>{str(video.heading)||"Watch"}</h2><div className="cms-video"><a href={str(video.url)} target="_blank" rel="noreferrer">Open video ↗</a><p>{str(video.caption)}</p></div></div></section>}
  {downloadItems.length>0&&<section className="section"><div className="container"><h2>{str(downloads.heading)||"Downloads"}</h2><div className="cms-downloads">{downloadItems.map((item,i)=>{const [label,url]=item.split("|").map(s=>s.trim());return url?<a key={i} href={url} target="_blank" rel="noreferrer">{label||"Download"} ↗</a>:null})}</div></div></section>}
  {str(form.formKey)&&<section className="section tint"><div className="container cta-box"><div><p className="eyebrow">CONNECT</p><h2>{str(form.heading)||"Send your details"}</h2><p>{str(form.text)}</p></div><Link className="button primary" href="/contact">Open form</Link></div></section>}
  {(str(cta.heading)||str(cta.label))&&<section className="section dark"><div className="container cta-grid"><div><p className="eyebrow light">NEXT STEP</p><h2>{str(cta.heading)||"Get involved with MWONET"}</h2><p>{str(cta.text)}</p></div>{str(cta.label)&&str(cta.href)&&<Link className="button light-button" href={str(cta.href)}>{str(cta.label)}</Link>}</div></section>}
 </>
}
