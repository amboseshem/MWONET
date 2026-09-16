"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "../../../_lib/db";
import {getAdminSession} from "../../../_lib/auth";
import {ensureAdminUser,slugToPublicPath} from "../../../_lib/cms";

function value(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
function list(value:string){return value.split("\n").map(x=>x.trim()).filter(Boolean)}

export async function savePageAction(formData:FormData){
  const session=await getAdminSession();if(!session)redirect("/admin/login");
  const slug=value(formData,"slug");if(!slug)throw new Error("Page slug is required.");
  const existing=await db.page.findUnique({where:{slug},include:{blocks:true}});if(!existing)throw new Error("Page not found.");
  const actor=await ensureAdminUser(session.email);
  const status=value(formData,"status").toUpperCase() as "DRAFT"|"REVIEW"|"PUBLISHED"|"SCHEDULED"|"ARCHIVED";
  const title=value(formData,"title")||existing.title;const description=value(formData,"description");const seoTitle=value(formData,"seoTitle");const socialImage=value(formData,"socialImage");
  const scheduled=value(formData,"scheduledAt");const scheduledAt=scheduled?new Date(scheduled):null;
  const heroData={eyebrow:value(formData,"heroEyebrow"),heading:value(formData,"heroHeading"),text:value(formData,"heroText"),image:value(formData,"heroImage"),buttonLabel:value(formData,"heroButtonLabel"),buttonHref:value(formData,"heroButtonHref")};
  const richData={heading:value(formData,"richHeading"),body:value(formData,"richBody")};
  const imageData={url:value(formData,"featureImage"),alt:value(formData,"featureAlt"),caption:value(formData,"featureCaption")};
  const ctaData={heading:value(formData,"ctaHeading"),text:value(formData,"ctaText"),label:value(formData,"ctaLabel"),href:value(formData,"ctaHref")};
  const galleryData={heading:value(formData,"galleryHeading"),images:list(value(formData,"galleryImages"))};
  const statsData={heading:value(formData,"statsHeading"),items:list(value(formData,"statsItems"))};
  const videoData={heading:value(formData,"videoHeading"),url:value(formData,"videoUrl"),caption:value(formData,"videoCaption")};
  const downloadsData={heading:value(formData,"downloadsHeading"),items:list(value(formData,"downloadsItems"))};
  const formDataBlock={heading:value(formData,"formHeading"),formKey:value(formData,"formKey"),text:value(formData,"formText")};
  const settingsData={template:value(formData,"template")||"standard",visibility:value(formData,"visibility")||"public",canonical:value(formData,"canonical"),noIndex:value(formData,"noIndex")==="on"};
  const before={title:existing.title,status:existing.status,seoTitle:existing.seoTitle,description:existing.description,socialImage:existing.socialImage,scheduledAt:existing.scheduledAt,blocks:existing.blocks};
  const blocks=[{position:0,type:"hero",data:heroData},{position:1,type:"rich-text",data:richData},{position:2,type:"image",data:imageData},{position:3,type:"cta",data:ctaData},{position:4,type:"gallery",data:galleryData},{position:5,type:"stats",data:statsData},{position:6,type:"video",data:videoData},{position:7,type:"downloads",data:downloadsData},{position:8,type:"form",data:formDataBlock},{position:9,type:"settings",data:settingsData}];
  await db.$transaction(async tx=>{
    await tx.pageRevision.create({data:{pageId:existing.id,authorId:actor?.id,snapshot:before,note:"Automatic revision before admin edit"}});
    await tx.page.update({where:{id:existing.id},data:{title,status,seoTitle:seoTitle||null,description:description||null,socialImage:socialImage||null,scheduledAt:status==="SCHEDULED"?scheduledAt:null,publishedAt:status==="PUBLISHED"?(existing.publishedAt||new Date()):existing.publishedAt}});
    for(const block of blocks)await tx.contentBlock.upsert({where:{pageId_position:{pageId:existing.id,position:block.position}},update:{type:block.type,data:block.data},create:{pageId:existing.id,type:block.type,position:block.position,data:block.data}});
    await tx.auditLog.create({data:{actorId:actor?.id,action:"page.update",resource:"Page",resourceId:existing.id,before,after:{title,status,seoTitle,description,socialImage,scheduledAt,blocks},metadata:{slug,publicPath:slugToPublicPath(slug)}}});
  });
  revalidatePath("/admin/pages");revalidatePath(`/admin/pages/${slug}`);revalidatePath(slugToPublicPath(slug));redirect(`/admin/pages/${slug}?saved=1`);
}

export async function restoreRevisionAction(formData:FormData){
 const session=await getAdminSession();if(!session)redirect("/admin/login");const slug=value(formData,"slug"),revisionId=value(formData,"revisionId");if(!slug||!revisionId)return;
 const page=await db.page.findUnique({where:{slug},include:{blocks:true}});const revision=await db.pageRevision.findUnique({where:{id:revisionId}});if(!page||!revision||revision.pageId!==page.id)return;
 const actor=await ensureAdminUser(session.email);const snap=revision.snapshot as Record<string,unknown>;const oldBlocks=Array.isArray(snap.blocks)?snap.blocks as Array<{type?:string;position?:number;data?:unknown}>:[];
 await db.$transaction(async tx=>{
  await tx.pageRevision.create({data:{pageId:page.id,authorId:actor?.id,snapshot:{title:page.title,status:page.status,seoTitle:page.seoTitle,description:page.description,socialImage:page.socialImage,scheduledAt:page.scheduledAt,blocks:page.blocks},note:"Automatic backup before revision restore"}});
  await tx.page.update({where:{id:page.id},data:{title:String(snap.title||page.title),status:(snap.status||page.status) as never,seoTitle:(snap.seoTitle as string|null|undefined)??null,description:(snap.description as string|null|undefined)??null,socialImage:(snap.socialImage as string|null|undefined)??null,scheduledAt:snap.scheduledAt?new Date(String(snap.scheduledAt)):null}});
  await tx.contentBlock.deleteMany({where:{pageId:page.id}});if(oldBlocks.length)await tx.contentBlock.createMany({data:oldBlocks.map((b,i)=>({pageId:page.id,type:String(b.type||"rich-text"),position:Number.isInteger(b.position)?Number(b.position):i,data:(b.data||{}) as never}))});
  await tx.auditLog.create({data:{actorId:actor?.id,action:"page.revision.restore",resource:"Page",resourceId:page.id,after:{revisionId}}});
 });
 revalidatePath(`/admin/pages/${slug}`);revalidatePath(slugToPublicPath(slug));redirect(`/admin/pages/${slug}?restored=1`);
}
