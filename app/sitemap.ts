import type {MetadataRoute} from "next";
import {programs,elgonTopics} from "./data/site";
import {db} from "./admin/_lib/db";

export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base="https://mwonet.org";
 const staticRoutes=["","/about","/about/history","/about/vision","/about/mission","/about/objectives","/about/core-values","/constitution","/membership","/governance","/financial-model","/focus-areas","/mount-elgon","/tree-restoration","/youth-community","/media","/media/photos","/media/videos","/media/projects","/media/events","/leadership","/news","/events","/partners","/get-involved","/get-involved/volunteer","/get-involved/partner","/get-involved/support","/get-involved/donate","/contact","/register"];
 let posts:{slug:string;updatedAt:Date}[]=[],projects:{slug:string}[]=[];
 try{[posts,projects]=await Promise.all([db.post.findMany({where:{status:"PUBLISHED"},select:{slug:true,updatedAt:true}}),db.project.findMany({where:{status:{in:["ACTIVE","COMPLETED"]}},select:{slug:true}})])}catch{}
 return [
  ...staticRoutes.map(url=>({url:base+url,lastModified:new Date(),changeFrequency:"weekly" as const,priority:url===""?1:.7})),
  ...programs.map(p=>({url:base+"/focus-areas/"+p.slug,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.6})),
  ...elgonTopics.map(t=>({url:base+"/mount-elgon/"+t.slug,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.6})),
  ...posts.map(p=>({url:base+"/news/"+p.slug,lastModified:p.updatedAt,changeFrequency:"monthly" as const,priority:.6})),
  ...projects.map(p=>({url:base+"/projects/"+p.slug,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.6}))
 ];
}
