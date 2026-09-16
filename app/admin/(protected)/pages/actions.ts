"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";
import {ensureAdminUser,slugToPublicPath} from "../../_lib/cms";

function text(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
async function admin(){const session=await getAdminSession();if(!session)redirect("/admin/login");return ensureAdminUser(session.email)}

export async function createPageAction(fd:FormData){
 const actor=await admin();const title=text(fd,"title");if(!title)return;
 let slug=slugify(text(fd,"slug")||title);if(!slug)slug=`page-${Date.now()}`;
 const exists=await db.page.findUnique({where:{slug}});if(exists)redirect(`/admin/pages?error=slug`);
 const status=(text(fd,"status")||"DRAFT") as "DRAFT"|"REVIEW"|"PUBLISHED"|"SCHEDULED"|"ARCHIVED";
 const page=await db.page.create({data:{title,slug,status,seoTitle:`${title} | MWONET`,description:text(fd,"description")||null,publishedAt:status==="PUBLISHED"?new Date():null}});
 await db.contentBlock.createMany({data:[
  {pageId:page.id,position:0,type:"hero",data:{eyebrow:"MWONET",heading:title,text:text(fd,"description"),image:""}},
  {pageId:page.id,position:1,type:"rich-text",data:{heading:title,body:""}},
  {pageId:page.id,position:3,type:"cta",data:{heading:"Get involved with MWONET",text:"",label:"Get involved",href:"/get-involved"}}
 ]});
 await db.auditLog.create({data:{actorId:actor?.id,action:"page.create",resource:"Page",resourceId:page.id,after:{title,slug,status}}});
 revalidatePath("/admin/pages");redirect(`/admin/pages/${slug}?created=1`);
}

export async function duplicatePageAction(fd:FormData){
 const actor=await admin();const id=text(fd,"id");const source=await db.page.findUnique({where:{id},include:{blocks:true}});if(!source)return;
 let base=`${source.slug}-copy`,slug=base,n=2;while(await db.page.findUnique({where:{slug}})){slug=`${base}-${n++}`}
 const copy=await db.page.create({data:{title:`${source.title} Copy`,slug,status:"DRAFT",seoTitle:source.seoTitle,description:source.description,socialImage:source.socialImage}});
 if(source.blocks.length)await db.contentBlock.createMany({data:source.blocks.map(b=>({pageId:copy.id,type:b.type,position:b.position,data:b.data as never}))});
 await db.auditLog.create({data:{actorId:actor?.id,action:"page.duplicate",resource:"Page",resourceId:copy.id,after:{sourceId:source.id,slug}}});
 revalidatePath("/admin/pages");redirect(`/admin/pages/${slug}?created=1`);
}

export async function archivePageAction(fd:FormData){
 const actor=await admin();const id=text(fd,"id");const page=await db.page.update({where:{id},data:{status:"ARCHIVED"}});
 await db.auditLog.create({data:{actorId:actor?.id,action:"page.archive",resource:"Page",resourceId:id,after:{status:"ARCHIVED"}}});
 revalidatePath("/admin/pages");revalidatePath(slugToPublicPath(page.slug));
}

export async function deletePageAction(fd:FormData){
 const actor=await admin();const id=text(fd,"id");const page=await db.page.findUnique({where:{id}});if(!page)return;
 const protectedSlugs=new Set(["home","about","contact","membership","governance","constitution","focus-areas","get-involved","leadership","media","events","mount-elgon","financial-model"]);
 if(protectedSlugs.has(page.slug))return;
 await db.page.delete({where:{id}});await db.auditLog.create({data:{actorId:actor?.id,action:"page.delete",resource:"Page",resourceId:id,before:{title:page.title,slug:page.slug}}});
 revalidatePath("/admin/pages");redirect("/admin/pages?deleted=1");
}
