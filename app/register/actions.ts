"use server";

import {redirect} from "next/navigation";
import {db} from "../admin/_lib/db";
import {ageFromDob,hashPassword,normalizeEmail,normalizePhone,passwordProblem,startMemberSession} from "../_lib/member-auth";

function text(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
function fail(message:string){redirect(`/register?error=${encodeURIComponent(message)}`)}

export async function registerMemberAction(formData:FormData){
 const name=text(formData,"name");
 const email=normalizeEmail(text(formData,"email"));
 const phone=normalizePhone(text(formData,"phone"));
 const dobRaw=text(formData,"dateOfBirth");
 const county=text(formData,"county");
 const password=text(formData,"password");
 const confirm=text(formData,"confirmPassword");
 const constitutionAccepted=formData.get("constitutionAccepted")==="on";
 const areaConfirmed=formData.get("areaConfirmed")==="on";
 if(name.length<2)fail("Enter your full name.");
 if(!/^\S+@\S+\.\S+$/.test(email))fail("Enter a valid email address.");
 if(phone.length<9)fail("Enter a valid phone number.");
 const dob=new Date(dobRaw);if(!dobRaw||Number.isNaN(dob.getTime()))fail("Enter your date of birth.");
 const age=ageFromDob(dob);if(age<18||age>35)fail("MWONET membership is currently for people aged 18–35 years as stated in the constitution.");
 if(county!=="Bungoma County"||!areaConfirmed)fail("Confirm that you live or operate within Bungoma County/Region.");
 const passwordError=passwordProblem(password);if(passwordError)fail(passwordError);
 if(password!==confirm)fail("The passwords do not match.");
 if(!constitutionAccepted)fail("You must confirm that you will abide by the MWONET constitution.");
 const existing=await db.user.findUnique({where:{email}});if(existing)fail("An account already exists for this email. Please sign in or contact MWONET if you need help.");
 const passwordHash=hashPassword(password);
 const user=await db.$transaction(async tx=>{
  const created=await tx.user.create({data:{name,email,passwordHash,status:"ACTIVE"}});
  const member=await tx.memberProfile.create({data:{userId:created.id,phone,county,dateOfBirth:dob,status:"PENDING",registrationFee:1000,monthlyFee:200}});
  await tx.auditLog.create({data:{actorId:created.id,action:"member.register",resource:"MemberProfile",resourceId:member.id,after:{name,email,phone,county,dateOfBirth:dob.toISOString(),status:"PENDING"},metadata:{source:"public-registration"}}});
  return created;
 });
 await startMemberSession(user.id,user.email);
 redirect("/portal?welcome=1");
}
