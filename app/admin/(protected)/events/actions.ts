"use server";
import {revalidatePath} from "next/cache";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";
import {requirePermission} from "../../_lib/access";

function v(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
async function guard(){const s=await getAdminSession();if(!s)throw new Error("Not signed in");return requirePermission(s.email,"manage_events")}
export async function createEventAdmin(fd:FormData){const a=await guard();const title=v(fd,"title"),starts=v(fd,"startsAt");if(!title||!starts)return;const ends=v(fd,"endsAt"),status=(v(fd,"status")||"DRAFT") as "DRAFT"|"REVIEW"|"PUBLISHED";const row=await db.event.create({data:{title,slug:slugify(v(fd,"slug")||title),description:v(fd,"description")||null,venue:v(fd,"venue")||null,startsAt:new Date(starts),endsAt:ends?new Date(ends):null,status}});await db.auditLog.create({data:{actorId:a.user!.id,action:"event.create",resource:"Event",resourceId:row.id,after:{title,status}}});revalidatePath("/admin/events");revalidatePath("/events")}
export async function updateRegistrationStatus(fd:FormData){const a=await guard();const id=v(fd,"id"),status=v(fd,"status");if(!id||!status)return;const before=await db.eventRegistration.findUnique({where:{id}});if(!before)return;const row=await db.eventRegistration.update({where:{id},data:{status}});await db.auditLog.create({data:{actorId:a.user!.id,action:"event.registration.status",resource:"EventRegistration",resourceId:id,before:{status:before.status},after:{status:row.status}}});revalidatePath(`/admin/events/${row.eventId}/registrations`)}
