"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "../../../admin/_lib/db";
import {getAdminSession} from "../../../admin/_lib/auth";
import {ensureAdminUser} from "../../../admin/_lib/cms";

export async function togglePluginAction(formData:FormData){
 const session=await getAdminSession();if(!session)redirect("/admin/login");
 const key=String(formData.get("key")||"");const next=String(formData.get("next")||"");if(!key)return;
 const actor=await ensureAdminUser(session.email);
 const status=next==="enable"?"ENABLED":"DISABLED";
 const plugin=await db.plugin.update({where:{key},data:{status}});
 await db.auditLog.create({data:{actorId:actor?.id,action:`plugin.${next}`,resource:"Plugin",resourceId:plugin.id,after:{key:plugin.key,name:plugin.name,status}}});
 revalidatePath("/admin/plugins");
}
