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
  const heroEyebrow=value(formData,"heroEyebrow");
  const heroHeading=value(formData,"heroHeading");
  const heroText=value(formData,"heroText");
  const heroImage=value(formData,"heroImage");

  const before={title:existing.title,status:existing.status,seoTitle:existing.seoTitle,description:existing.description,socialImage:existing.socialImage,blocks:existing.blocks};
  const heroData={eyebrow:heroEyebrow,heading:heroHeading,text:heroText,image:heroImage};

  await db.$transaction(async tx=>{
    await tx.pageRevision.create({data:{pageId:existing.id,authorId:actor?.id,snapshot:before,note:"Automatic revision before admin edit"}});
    await tx.page.update({where:{id:existing.id},data:{title,status,seoTitle:seoTitle||null,description:description||null,socialImage:socialImage||null,publishedAt:status==="PUBLISHED"?(existing.publishedAt||new Date()):existing.publishedAt}});
    await tx.contentBlock.upsert({where:{pageId_position:{pageId:existing.id,position:0}},update:{type:"hero",data:heroData},create:{pageId:existing.id,type:"hero",position:0,data:heroData}});
    await tx.auditLog.create({data:{actorId:actor?.id,action:"page.update",resource:"Page",resourceId:existing.id,before,after:{title,status,seoTitle,description,socialImage,hero:heroData},metadata:{slug,publicPath:slugToPublicPath(slug)}}});
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}`);
  revalidatePath(slugToPublicPath(slug));
  redirect(`/admin/pages/${slug}?saved=1`);
}
