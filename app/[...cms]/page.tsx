import {notFound} from "next/navigation";
import type {Metadata} from "next";
import CmsPageRenderer from "../components/CmsPageRenderer";
import {db} from "../admin/_lib/db";

export const dynamic="force-dynamic";

function slug(parts:string[]){return parts.join("--")}
async function load(parts:string[]){return db.page.findUnique({where:{slug:slug(parts)},include:{blocks:{orderBy:{position:"asc"}}}})}
function settings(blocks:{type:string;data:unknown}[]){const row=blocks.find(b=>b.type==="settings");return row&&row.data&&typeof row.data==="object"&&!Array.isArray(row.data)?row.data as Record<string,unknown>:{}}

export async function generateMetadata({params}:{params:Promise<{cms:string[]}>}):Promise<Metadata>{const {cms}=await params;const page=await load(cms);if(!page)return {};const s=settings(page.blocks);return {title:page.seoTitle||page.title,description:page.description||undefined,alternates:{canonical:typeof s.canonical==="string"&&s.canonical?s.canonical:undefined},robots:s.noIndex===true?{index:false,follow:true}:undefined,openGraph:page.socialImage?{images:[page.socialImage]}:undefined}}

export default async function CmsPublicPage({params}:{params:Promise<{cms:string[]}>}){const {cms}=await params;const page=await load(cms);if(!page)return notFound();const s=settings(page.blocks);const now=new Date();const publishable=page.status==="PUBLISHED"||(page.status==="SCHEDULED"&&page.scheduledAt&&page.scheduledAt<=now);if(!publishable||s.visibility==="private"||s.visibility==="members")return notFound();return <CmsPageRenderer title={page.title} description={page.description} blocks={page.blocks.map(b=>({type:b.type,position:b.position,data:b.data}))}/>}
