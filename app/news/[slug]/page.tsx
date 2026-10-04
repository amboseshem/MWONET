import {notFound} from "next/navigation";
import Link from "next/link";
import {db} from "../../admin/_lib/db";
import PageHero from "../../components/PageHero";
import {images} from "../../data/site";

export const dynamic="force-dynamic";
export default async function NewsDetail({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const post=await db.post.findUnique({where:{slug}});
 if(!post||post.status!=="PUBLISHED")return notFound();
 const body=post.content&&typeof post.content==="object"&&!Array.isArray(post.content)?String((post.content as Record<string,unknown>).body||""):"";
 return <><PageHero eyebrow="MWONET News" title={post.title} text={post.excerpt||"Official MWONET update."} image={images.forest}/><section className="section"><div className="container cms-prose"><p className="eyebrow">{post.publishedAt?.toLocaleDateString("en-KE")||"Published update"}</p>{body.split(/\n\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}<p><Link className="text-link" href="/news">← Back to News</Link></p></div></section></>
}
