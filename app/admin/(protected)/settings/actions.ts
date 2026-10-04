"use server";
import {revalidatePath} from "next/cache";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";
import {requirePermission} from "../../_lib/access";

const keys=["organization.phone","organization.email","organization.secondaryEmail","organization.address","organization.mapUrl","social.facebook","social.instagram","social.youtube","social.linkedin"];
export async function savePublicSettings(fd:FormData){
 const s=await getAdminSession();if(!s)throw new Error("Not signed in");const a=await requirePermission(s.email,"manage_settings");
 for(const key of keys){const value=String(fd.get(key)||"").trim();await db.siteSetting.upsert({where:{key},update:{value:{value}},create:{key,value:{value}}})}
 await db.auditLog.create({data:{actorId:a.user!.id,action:"settings.public.update",resource:"SiteSetting",metadata:{keys}}});
 revalidatePath("/admin/settings");revalidatePath("/");revalidatePath("/contact");
}
