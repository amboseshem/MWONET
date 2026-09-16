"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "../../../_lib/db";
import {getAdminSession} from "../../../_lib/auth";
import {ensureAdminUser,slugToPublicPath} from "../../../_lib/cms";

function value(fd:FormData,key:string){return String(fd.get(key)||"").trim()}

export async function savePageAction(formData:FormData){
  const session=await getAdminSession();
  if(!session)redirect("/admin/login");
  const slug=value(formData,"slug");
  if(!slug)throw new Error("Page slug is required.");
  const existing=await db.page.findUnique({where:{slug},include:{blocks:true}});
  if(!existing)throw new Error("Page not found.");
  const actor=await ensureAdminUser(session.email);
  const status=value(formData,"status").toUpperCase() as "DRAFT"|"REVIEW"|"PUBLISHED"|"SCHEDULED"|"ARCHIVED";
  const title=value(formData,"title")||existing.title;
  const description=value(formData,"description");
  const seoTitle=value(formData,"seoTitle");
  const socialImage=value(formData,"socialImage");
  const heroData={eyebrow:value(formData,"heroEyebrow"),heading:value(formData,"heroHeading"),text:value(formData,"heroText"),image:value(formData,"heroImage")};
  const richData={heading:value(formData,"richHeading"),body:value(formData,"richBody")};
  const imageData={url:value(formData,"featureImage"),alt:value(formData,"featureAlt"),caption:value(formData,"featureCaption")};
  const ctaData={heading:value(formData,"ctaHeading"),text:value(formData,"ctaText"),label:value(formData,"ctaLabel"),href:value(formData,"ctaHref")};
  const before={title:existing.title,status:existing.status,seoTitle:existing.seoTitle,description:existing.description,socialImage:existing.socialImage,blocks:existing.blocks};
  await db.$transaction(async tx=>{
    await tx.pageRevision.create({data:{pageId:existing.id,authorId:actor?.id,snapshot:before,note:"Automatic revision before admin edit"}});
    await tx.page.update({where:{id:existing.id},data:{title,status,seoTitle:seoTitle||null,description:description||null,socialImage:socialImage||null,publishedAt:status==="PUBLISHED"?(existing.publishedAt||new Date()):existing.publishedAt}});
    const blocks=[{position:0,type:"hero",data:heroData},{position:1,type:"rich-text",data:richData},{position:2,type:"image",data:imageData},{position:3,type:"cta",data:ctaData}];
    for(const block of blocks)await tx.contentBlock.upsert({where:{pageId_position:{pageId:existing.id,position:block.position}},update:{type:block.type,data:block.data},create:{pageId:existing.id,type:block.type,position:block.position,data:block.data}});
    await tx.auditLog.create({data:{actorId:actor?.id,action:"page.update",resource:"Page",resourceId:existing.id,before,after:{title,status,seoTitle,description,socialImage,blocks},metadata:{slug,publicPath:slugToPublicPath(slug)}}});
  });
  revalidatePath("/admin/pages");revalidatePath(`/admin/pages/${slug}`);revalidatePath(slugToPublicPath(slug));redirect(`/admin/pages/${slug}?saved=1`);
}
