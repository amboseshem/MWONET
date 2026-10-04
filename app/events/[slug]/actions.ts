"use server";
import {redirect} from "next/navigation";
import {db} from "../../admin/_lib/db";

function v(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
export async function registerForEvent(fd:FormData){
 const eventId=v(fd,"eventId"),slug=v(fd,"slug"),name=v(fd,"name"),email=v(fd,"email").toLowerCase(),phone=v(fd,"phone");
 if(!eventId||!slug||!name||!email)redirect(`/events/${slug}?error=required`);
 const event=await db.event.findUnique({where:{id:eventId}});if(!event||event.status!=="PUBLISHED")redirect(`/events/${slug}?error=closed`);
 await db.eventRegistration.upsert({where:{eventId_email:{eventId,email}},update:{name,phone:phone||null,status:"REGISTERED"},create:{eventId,name,email,phone:phone||null,status:"REGISTERED"}});
 redirect(`/events/${slug}?registered=1`);
}
