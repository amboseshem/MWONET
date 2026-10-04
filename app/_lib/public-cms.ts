import type {Metadata} from "next";
import {db} from "../admin/_lib/db";

function settings(blocks:{type:string;data:unknown}[]){const row=blocks.find(b=>b.type==="settings");return row&&row.data&&typeof row.data==="object"&&!Array.isArray(row.data)?row.data as Record<string,unknown>:{} }
function publishable(page:{status:string;scheduledAt:Date|null}){return page.status==="PUBLISHED"||(page.status==="SCHEDULED"&&Boolean(page.scheduledAt&&page.scheduledAt<=new Date()))}

export async function getPublicCmsPage(slug:string){
 const page=await db.page.findUnique({where:{slug},include:{blocks:{orderBy:{position:"asc"}}}});
 if(!page||!publishable(page)||page.blocks.length===0)return null;
 const s=settings(page.blocks);if(s.visibility==="private"||s.visibility==="members")return null;
 return page;
}
export async function getPublicCmsMetadata(slug:string,fallbackTitle:string):Promise<Metadata>{
 try{
  const page=await db.page.findUnique({where:{slug},include:{blocks:true}});
  if(!page)return {title:fallbackTitle};
  const s=settings(page.blocks);
  return {title:page.seoTitle||fallbackTitle,description:page.description||undefined,alternates:{canonical:typeof s.canonical==="string"&&s.canonical?s.canonical:undefined},robots:s.noIndex===true?{index:false,follow:true}:undefined,openGraph:page.socialImage?{images:[page.socialImage]}:undefined};
 }catch{return {title:fallbackTitle}}
}
