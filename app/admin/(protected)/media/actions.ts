"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";

function text(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
function tags(value:string){return value.split(",").map(v=>v.trim()).filter(Boolean).slice(0,20)}
async function actor(){const session=await getAdminSession();if(!session)redirect("/admin/login");return db.user.findUnique({where:{email:session.email}})}
async function audit(action:string,id:string,before:unknown,after:unknown){const user=await actor();await db.auditLog.create({data:{actorId:user?.id,action,resource:"MediaAsset",resourceId:id,before:before as never,after:after as never}})}
function refresh(){revalidatePath("/admin/media");revalidatePath("/admin");}

export async function createMediaAction(fd:FormData){
 const url=text(fd,"url"); if(!url)return;
 const type=text(fd,"type")||"image";
 const user=await actor();
 const row=await db.mediaAsset.create({data:{url,type,title:text(fd,"title")||null,altText:text(fd,"altText")||null,caption:text(fd,"caption")||null,tags:tags(text(fd,"tags")),providerId:text(fd,"providerId")||null,uploadedBy:user?.id}});
 await db.auditLog.create({data:{actorId:user?.id,action:"media.create",resource:"MediaAsset",resourceId:row.id,after:{url,type,title:row.title,tags:row.tags}}});
 refresh();
}

export async function updateMediaAction(fd:FormData){
 const id=text(fd,"id"); if(!id)return;
 const before=await db.mediaAsset.findUnique({where:{id}}); if(!before)return;
 const data={url:text(fd,"url")||before.url,type:text(fd,"type")||before.type,title:text(fd,"title")||null,altText:text(fd,"altText")||null,caption:text(fd,"caption")||null,tags:tags(text(fd,"tags")),providerId:text(fd,"providerId")||null};
 const row=await db.mediaAsset.update({where:{id},data});
 await audit("media.update",id,before,row); refresh();
}

export async function deleteMediaAction(fd:FormData){
 const id=text(fd,"id"); if(!id)return;
 const before=await db.mediaAsset.findUnique({where:{id}}); if(!before)return;
 await db.mediaAsset.delete({where:{id}}); await audit("media.delete",id,before,null); refresh();
}
