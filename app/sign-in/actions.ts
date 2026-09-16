"use server";

import {redirect} from "next/navigation";
import {db} from "../admin/_lib/db";
import {normalizeEmail,startMemberSession,verifyPassword} from "../_lib/member-auth";

function text(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
function safeNext(value:string){return value.startsWith("/")&&!value.startsWith("//")?value:"/portal"}

export async function memberSignInAction(formData:FormData){
 const email=normalizeEmail(text(formData,"email"));
 const password=text(formData,"password");
 const next=safeNext(text(formData,"next")||"/portal");
 const user=await db.user.findUnique({where:{email},include:{member:true}});
 if(!user||!verifyPassword(password,user.passwordHash))redirect(`/sign-in?error=${encodeURIComponent("Email or password is incorrect.")}&next=${encodeURIComponent(next)}`);
 if(user.status!=="ACTIVE")redirect(`/sign-in?error=${encodeURIComponent("This account is not currently active. Please contact MWONET.")}`);
 await db.$transaction([
  db.user.update({where:{id:user.id},data:{lastLoginAt:new Date()}}),
  db.auditLog.create({data:{actorId:user.id,action:"member.login",resource:"User",resourceId:user.id,metadata:{source:"public-sign-in"}}})
 ]);
 await startMemberSession(user.id,user.email);
 redirect(next);
}
