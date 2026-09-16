"use server";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {db} from "../admin/_lib/db";
import {clearMemberSession,hashPassword,normalizePhone,passwordProblem,requireMember,verifyPassword} from "../_lib/member-auth";

function text(fd:FormData,key:string){return String(fd.get(key)||"").trim()}

export async function memberLogoutAction(){const user=await requireMember();await db.auditLog.create({data:{actorId:user.id,action:"member.logout",resource:"User",resourceId:user.id,metadata:{source:"member-portal"}}});await clearMemberSession();redirect("/sign-in?signedOut=1")}

export async function updateMemberProfileAction(formData:FormData){
 const user=await requireMember();if(!user.member)redirect("/portal?error=Member%20profile%20not%20found.");
 const phone=normalizePhone(text(formData,"phone"));const county=text(formData,"county");
 if(phone.length<9)redirect("/portal?error=Enter%20a%20valid%20phone%20number.");
 if(county!=="Bungoma County")redirect("/portal?error=Membership%20area%20must%20remain%20within%20Bungoma%20County%2FRegion.");
 await db.$transaction([
  db.memberProfile.update({where:{id:user.member.id},data:{phone,county}}),
  db.auditLog.create({data:{actorId:user.id,action:"member.profile.update",resource:"MemberProfile",resourceId:user.member.id,after:{phone,county},metadata:{source:"member-portal"}}})
 ]);
 revalidatePath("/portal");redirect("/portal?profileSaved=1");
}

export async function changeMemberPasswordAction(formData:FormData){
 const user=await requireMember();const current=text(formData,"currentPassword");const next=text(formData,"newPassword");const confirm=text(formData,"confirmPassword");
 if(!verifyPassword(current,user.passwordHash))redirect("/portal?error=Current%20password%20is%20incorrect.");
 const problem=passwordProblem(next);if(problem)redirect(`/portal?error=${encodeURIComponent(problem)}`);
 if(next!==confirm)redirect("/portal?error=New%20passwords%20do%20not%20match.");
 const passwordHash=hashPassword(next);
 await db.$transaction([
  db.user.update({where:{id:user.id},data:{passwordHash}}),
  db.auditLog.create({data:{actorId:user.id,action:"member.password.change",resource:"User",resourceId:user.id,metadata:{source:"member-portal"}}})
 ]);
 redirect("/portal?passwordChanged=1");
}
