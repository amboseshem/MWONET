"use server";
import {revalidatePath} from "next/cache";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";
import {requirePermission} from "../../_lib/access";

function v(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
async function guard(){const s=await getAdminSession();if(!s)throw new Error("Not signed in");return requirePermission(s.email,"manage_notifications")}
export async function createNotification(fd:FormData){
 const a=await guard();const title=v(fd,"title"),message=v(fd,"message"),audience=v(fd,"audience")||"ALL_MEMBERS",status=v(fd,"status")||"DRAFT";if(!title||!message)return;
 const row=await db.notification.create({data:{title,message,audience,status,createdBy:a.user!.id,publishedAt:status==="PUBLISHED"?new Date():null}});
 await db.auditLog.create({data:{actorId:a.user!.id,action:"notification.create",resource:"Notification",resourceId:row.id,after:{title,audience,status}}});
 revalidatePath("/admin/notifications");revalidatePath("/portal");
}
export async function updateNotificationStatus(fd:FormData){
 const a=await guard();const id=v(fd,"id"),status=v(fd,"status");if(!id||!status)return;
 const before=await db.notification.findUnique({where:{id}});if(!before)return;
 const row=await db.notification.update({where:{id},data:{status,publishedAt:status==="PUBLISHED"?(before.publishedAt||new Date()):null}});
 await db.auditLog.create({data:{actorId:a.user!.id,action:"notification.status",resource:"Notification",resourceId:id,before:{status:before.status},after:{status:row.status}}});
 revalidatePath("/admin/notifications");revalidatePath("/portal");
}
