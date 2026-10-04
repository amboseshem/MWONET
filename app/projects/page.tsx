import Link from "next/link";
import PageHero from "../components/PageHero";
import {images} from "../data/site";
import {db} from "../admin/_lib/db";

export const dynamic="force-dynamic";
export default async function Projects(){
 const projects=await db.project.findMany({where:{status:{in:["ACTIVE","COMPLETED"]}},orderBy:{title:"asc"},include:{program:true}});
 return <><PageHero eyebrow="Projects" title="MWONET projects in action." text="Field implementation, community initiatives and project results linked to MWONET programs." image={images.seedlings}/><section className="section"><div className="container"><div className="section-head"><div><p className="eyebrow">PROJECT PORTFOLIO</p><h2>From plans to community impact.</h2></div></div>{projects.length?<div className="program-grid">{projects.map(p=><Link className="program-card" key={p.id} href={"/projects/"+p.slug}><small>{p.status}</small><h3>{p.title}</h3><p>{p.summary||"MWONET field project."}</p><span>{p.program?.title||p.location||"MWONET"} →</span></Link>)}</div>:<div className="notice">No public projects have been activated yet. Projects remain private until an authorized officer marks them Active or Completed.</div>}</div></section></>
}
