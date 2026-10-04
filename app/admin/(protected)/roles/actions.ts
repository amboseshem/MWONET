"use server";
import {revalidatePath} from "next/cache";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";
import {getUserAccess} from "../../_lib/access";
import {ensureSystemCatalog} from "../../_lib/cms";

function v(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
async function superGuard(){
 const s=await getAdminSession();if(!s)throw new Error("Not signed in");
 const a=await getUserAccess(s.email);if(!a.isSuperAdmin)throw new Error("Only Super Admin can change permission sets.");
 return a;
}
export async function toggleRolePermissionAction(fd:FormData){
 const a=await superGuard();await ensureSystemCatalog();
 const roleId=v(fd,"roleId"),permissionId=v(fd,"permissionId"),enabled=v(fd,"enabled")==="1";if(!roleId||!permissionId)return;
 const role=await db.role.findUnique({where:{id:roleId}});if(!role||role.name==="Super Admin")return;
 if(enabled)await db.rolePermission.upsert({where:{roleId_permissionId:{roleId,permissionId}},update:{},create:{roleId,permissionId}});
 else await db.rolePermission.deleteMany({where:{roleId,permissionId}});
 await db.auditLog.create({data:{actorId:a.user!.id,action:"role.permission.update",resource:"Role",resourceId:roleId,after:{permissionId,enabled}}});
 revalidatePath("/admin/roles");
}
export async function createCustomRoleAction(fd:FormData){
 const a=await superGuard();const name=v(fd,"name"),description=v(fd,"description");if(!name||name==="Super Admin")return;
 const role=await db.role.upsert({where:{name},update:{description:description||null},create:{name,description:description||null}});
 await db.auditLog.create({data:{actorId:a.user!.id,action:"role.create",resource:"Role",resourceId:role.id,after:{name,description}}});
 revalidatePath("/admin/roles");
}
