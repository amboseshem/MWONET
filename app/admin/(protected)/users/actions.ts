"use server";
import {revalidatePath} from "next/cache";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";
import {requirePermission} from "../../_lib/access";
import {ensureSystemCatalog} from "../../_lib/cms";

function v(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
async function guard(){const s=await getAdminSession();if(!s)throw new Error("Not signed in");return requirePermission(s.email,"manage_users")}
async function actorId(email:string){return (await db.user.findUnique({where:{email}}))?.id}

export async function assignRoleAction(fd:FormData){
 const access=await guard();await ensureSystemCatalog();
 const userId=v(fd,"userId"),roleName=v(fd,"roleName");if(!userId||!roleName||roleName==="Super Admin")return;
 const [user,role]=await Promise.all([db.user.findUnique({where:{id:userId}}),db.role.findUnique({where:{name:roleName}})]);if(!user||!role)return;
 await db.userRole.upsert({where:{userId_roleId:{userId,roleId:role.id} as never},update:{},create:{userId,roleId:role.id}});
 await db.auditLog.create({data:{actorId:await actorId(access.user!.email),action:"user.role.assign",resource:"User",resourceId:userId,after:{role:roleName}}});
 revalidatePath("/admin/users");revalidatePath("/admin/roles");
}
export async function removeRoleAction(fd:FormData){
 const access=await guard();const userId=v(fd,"userId"),roleId=v(fd,"roleId");if(!userId||!roleId)return;
 const role=await db.role.findUnique({where:{id:roleId}});if(!role||role.name==="Super Admin")return;
 await db.userRole.delete({where:{userId_roleId:{userId,roleId}}});
 await db.auditLog.create({data:{actorId:await actorId(access.user!.email),action:"user.role.remove",resource:"User",resourceId:userId,before:{role:role.name}}});
 revalidatePath("/admin/users");revalidatePath("/admin/roles");
}
export async function updateUserStatusAction(fd:FormData){
 const access=await guard();const userId=v(fd,"userId"),status=v(fd,"status") as "ACTIVE"|"INVITED"|"SUSPENDED"|"DISABLED";if(!userId||!status)return;
 const target=await db.user.findUnique({where:{id:userId},include:{roles:{include:{role:true}}}});if(!target||target.roles.some(r=>r.role.name==="Super Admin"))return;
 await db.user.update({where:{id:userId},data:{status}});
 await db.auditLog.create({data:{actorId:await actorId(access.user!.email),action:"user.status",resource:"User",resourceId:userId,after:{status}}});
 revalidatePath("/admin/users");
}
export async function promoteLeadershipAction(fd:FormData){
 const access=await guard();await ensureSystemCatalog();
 const userId=v(fd,"userId"),title=v(fd,"title"),bio=v(fd,"bio"),roleName=v(fd,"roleName");if(!userId||!title)return;
 const user=await db.user.findUnique({where:{id:userId}});if(!user)return;
 if(roleName&&roleName!=="Super Admin"){const role=await db.role.findUnique({where:{name:roleName}});if(role)await db.userRole.upsert({where:{userId_roleId:{userId,roleId:role.id}},update:{},create:{userId,roleId:role.id}})}
 const existing=await db.leadershipProfile.findFirst({where:{email:user.email}});
 if(existing)await db.leadershipProfile.update({where:{id:existing.id},data:{name:user.name||user.email,role:title,bio:bio||existing.bio,active:true}});
 else await db.leadershipProfile.create({data:{name:user.name||user.email,role:title,bio:bio||null,email:user.email,active:true}});
 await db.auditLog.create({data:{actorId:await actorId(access.user!.email),action:"user.promote.leadership",resource:"User",resourceId:userId,after:{title,roleName}}});
 revalidatePath("/admin/users");revalidatePath("/admin/leadership");revalidatePath("/leadership");
}
