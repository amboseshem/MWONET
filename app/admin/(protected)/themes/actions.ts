"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "../../../admin/_lib/db";
import {getAdminSession} from "../../../admin/_lib/auth";
import {ensureAdminUser} from "../../../admin/_lib/cms";

export async function activateThemeAction(formData:FormData){
 const session=await getAdminSession();if(!session)redirect("/admin/login");
 const key=String(formData.get("key")||"");if(!key)return;
 const actor=await ensureAdminUser(session.email);
 await db.$transaction(async tx=>{
  await tx.theme.updateMany({data:{active:false}});
  const theme=await tx.theme.update({where:{key},data:{active:true}});
  await tx.auditLog.create({data:{actorId:actor?.id,action:"theme.activate",resource:"Theme",resourceId:theme.id,after:{key:theme.key,name:theme.name}}});
 });
 revalidatePath("/admin/themes");
 revalidatePath("/");
}
