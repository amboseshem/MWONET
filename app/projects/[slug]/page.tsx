import {notFound} from "next/navigation";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import {images} from "../../data/site";
import {db} from "../../admin/_lib/db";

export const dynamic="force-dynamic";
export default async function ProjectDetail({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const p=await db.project.findUnique({where:{slug},include:{program:true}});if(!p||!["ACTIVE","COMPLETED"].includes(p.status))return notFound();
 const body=p.content&&typeof p.content==="object"&&!Array.isArray(p.content)?String((p.content as Record<string,unknown>).body||""):"";
 return <><PageHero eyebrow={p.program?.title||"MWONET Project"} title={p.title} text={p.summary||"Official MWONET project."} image={images.seedlings}/><section className="section"><div className="container intro-grid"><div><p className="eyebrow">PROJECT DETAILS</p><h2>{p.status}</h2><p>{p.location||"Bungoma County"}</p>{p.startDate&&<p>Started: {p.startDate.toLocaleDateString("en-KE")}</p>}{p.endDate&&<p>End / completion: {p.endDate.toLocaleDateString("en-KE")}</p>}</div><div className="big-copy">{body?body.split(/\n\n+/).map((x,i)=><p key={i}>{x}</p>):<p>{p.summary}</p>}<Link className="text-link" href="/projects">← All projects</Link></div></div></section></>
}
