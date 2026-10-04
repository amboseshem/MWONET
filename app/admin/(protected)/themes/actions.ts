"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "../../../admin/_lib/db";
import {getAdminSession} from "../../../admin/_lib/auth";
import {ensureAdminUser} from "../../../admin/_lib/cms";
import {requirePermission} from "../../../admin/_lib/access";

async function guardPermission(){const s=await getAdminSession();if(!s)throw new Error("Not signed in");await requirePermission(s.email,"manage_themes");return s}
function v(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}

export async function activateThemeAction(formData:FormData){await guardPermission();
 const session=await getAdminSession();if(!session)redirect("/admin/login");
 const key=v(formData,"key");if(!key)return;
 const actor=await ensureAdminUser(session.email);
 await db.$transaction(async tx=>{await tx.theme.updateMany({data:{active:false}});const theme=await tx.theme.update({where:{key},data:{active:true}});await tx.auditLog.create({data:{actorId:actor?.id,action:"theme.activate",resource:"Theme",resourceId:theme.id,after:{key:theme.key,name:theme.name}}})});
 revalidatePath("/admin/themes");revalidatePath("/", "layout");
}

export async function createThemePresetAction(formData:FormData){await guardPermission();
 const session=await getAdminSession();if(!session)redirect("/admin/login");
 const name=v(formData,"name"),key=slugify(v(formData,"key")||name);if(!name||!key)return;
 const settings={primary:v(formData,"primary")||"#0a7748",dark:v(formData,"dark")||"#0d3428",accent:v(formData,"accent")||"#9de2b8",pale:v(formData,"pale")||"#f2f7f4",text:v(formData,"text")||"#16372c"};
 const actor=await ensureAdminUser(session.email);
 const theme=await db.theme.upsert({where:{key},update:{name,version:"1.0.0",manifest:{description:v(formData,"description")||"Custom MWONET design preset."},settings},create:{key,name,version:"1.0.0",active:false,manifest:{description:v(formData,"description")||"Custom MWONET design preset."},settings}});
 await db.auditLog.create({data:{actorId:actor?.id,action:"theme.create_or_update",resource:"Theme",resourceId:theme.id,after:{key,name,settings}}});
 revalidatePath("/admin/themes");
}
