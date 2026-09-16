"use server";

import {revalidatePath} from "next/cache";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";

function text(formData:FormData,key:string){return String(formData.get(key)||"").trim()}
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
async function actor(){const session=await getAdminSession();if(!session)return null;return db.user.findUnique({where:{email:session.email}})}
async function audit(action:string,resource:string,resourceId?:string,after?:unknown){const user=await actor();await db.auditLog.create({data:{actorId:user?.id,action,resource,resourceId,after:after as never}})}
function refresh(module:string){revalidatePath(`/admin/${module}`);revalidatePath("/admin")}

export async function createProgram(formData:FormData){const title=text(formData,"title");if(!title)return;const row=await db.program.create({data:{title,slug:slugify(text(formData,"slug")||title),summary:text(formData,"summary")||null}});await audit("program.create","Program",row.id,{title:row.title});refresh("programs")}

export async function createProject(formData:FormData){const title=text(formData,"title");if(!title)return;const start=text(formData,"startDate"),end=text(formData,"endDate"),programId=text(formData,"programId");const row=await db.project.create({data:{title,slug:slugify(text(formData,"slug")||title),summary:text(formData,"summary")||null,location:text(formData,"location")||null,programId:programId||null,startDate:start?new Date(start):null,endDate:end?new Date(end):null}});await audit("project.create","Project",row.id,{title:row.title});refresh("projects")}

export async function createPost(formData:FormData){const title=text(formData,"title");if(!title)return;const status=(text(formData,"status")||"DRAFT") as "DRAFT"|"REVIEW"|"PUBLISHED";const row=await db.post.create({data:{title,slug:slugify(text(formData,"slug")||title),excerpt:text(formData,"excerpt")||null,content:{body:text(formData,"content")},status,publishedAt:status==="PUBLISHED"?new Date():null}});await audit("post.create","Post",row.id,{title:row.title,status});refresh("posts")}

export async function createEvent(formData:FormData){const title=text(formData,"title"),starts=text(formData,"startsAt");if(!title||!starts)return;const ends=text(formData,"endsAt");const status=(text(formData,"status")||"DRAFT") as "DRAFT"|"REVIEW"|"PUBLISHED";const row=await db.event.create({data:{title,slug:slugify(text(formData,"slug")||title),description:text(formData,"description")||null,venue:text(formData,"venue")||null,startsAt:new Date(starts),endsAt:ends?new Date(ends):null,status}});await audit("event.create","Event",row.id,{title:row.title,status});refresh("events")}

export async function createMedia(formData:FormData){const url=text(formData,"url");if(!url)return;const tags=text(formData,"tags").split(",").map(x=>x.trim()).filter(Boolean);const user=await actor();const row=await db.mediaAsset.create({data:{url,type:text(formData,"type")||"image",title:text(formData,"title")||null,altText:text(formData,"altText")||null,caption:text(formData,"caption")||null,tags,uploadedBy:user?.id}});await audit("media.create","MediaAsset",row.id,{url:row.url});refresh("media")}

export async function createLeadership(formData:FormData){const name=text(formData,"name"),role=text(formData,"role");if(!name||!role)return;const row=await db.leadershipProfile.create({data:{name,role,bio:text(formData,"bio")||null,photoUrl:text(formData,"photoUrl")||null,email:text(formData,"email")||null,phone:text(formData,"phone")||null,order:Number(text(formData,"order")||0)}});await audit("leadership.create","LeadershipProfile",row.id,{name,role});refresh("leadership")}

export async function createNavigation(formData:FormData){const label=text(formData,"label"),href=text(formData,"href");if(!label||!href)return;const row=await db.navigationItem.create({data:{label,href,location:text(formData,"location")||"header",order:Number(text(formData,"order")||0)}});await audit("navigation.create","NavigationItem",row.id,{label,href});refresh("navigation")}

export async function createPartner(formData:FormData){const name=text(formData,"name");if(!name)return;const row=await db.partner.create({data:{name,category:text(formData,"category")||null,website:text(formData,"website")||null,logoUrl:text(formData,"logoUrl")||null,description:text(formData,"description")||null}});await audit("partner.create","Partner",row.id,{name});refresh("partners")}

export async function createFormDefinition(formData:FormData){const name=text(formData,"name");if(!name)return;const key=slugify(text(formData,"key")||name);const fields=text(formData,"fields").split(",").map(x=>x.trim()).filter(Boolean);const row=await db.form.create({data:{name,key,schema:{fields}}});await audit("form.create","Form",row.id,{name,key});refresh("forms")}

export async function saveSiteSetting(formData:FormData){const key=text(formData,"key"),value=text(formData,"value");if(!key)return;const row=await db.siteSetting.upsert({where:{key},update:{value:{value}},create:{key,value:{value}}});await audit("setting.update","SiteSetting",row.key,{value});refresh("settings")}

export async function updateMemberStatus(formData:FormData){const id=text(formData,"id"),status=text(formData,"status") as "PENDING"|"ACTIVE"|"INACTIVE"|"SUSPENDED"|"TERMINATED";if(!id||!status)return;const row=await db.memberProfile.update({where:{id},data:{status,joinedAt:status==="ACTIVE"?new Date():undefined}});await audit("member.status","MemberProfile",row.id,{status});refresh("members")}
