import {notFound} from "next/navigation";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import {images} from "../../data/site";
import {db} from "../../admin/_lib/db";
import {registerForEvent} from "./actions";

export const dynamic="force-dynamic";
export default async function EventDetail({params,searchParams}:{params:Promise<{slug:string}>,searchParams:Promise<{registered?:string;error?:string}>}){
 const {slug}=await params;const q=await searchParams;const event=await db.event.findUnique({where:{slug},include:{_count:{select:{registrations:true}}}});if(!event||event.status!=="PUBLISHED")return notFound();
 const upcoming=event.startsAt>=new Date();
 return <><PageHero eyebrow="MWONET Event" title={event.title} text={event.description||"Official MWONET activity."} image={images.community}/><section className="section"><div className="container event-layout"><div><p className="eyebrow">EVENT DETAILS</p><h2>{event.startsAt.toLocaleString("en-KE")}</h2><p><strong>Venue:</strong> {event.venue||"To be communicated"}</p>{event.endsAt&&<p><strong>Ends:</strong> {event.endsAt.toLocaleString("en-KE")}</p>}<p>{event.description}</p><p className="notice">{event._count.registrations} registration record{event._count.registrations===1?"":"s"} received.</p><Link className="text-link" href="/events">← Back to Events</Link></div><div>{q.registered&&<div className="notice">Thank you. Your event registration has been recorded successfully.</div>}{q.error&&<div className="notice">We could not complete the registration. Check the required details or contact MWONET.</div>}{upcoming?<form action={registerForEvent} className="interest-form"><input type="hidden" name="eventId" value={event.id}/><input type="hidden" name="slug" value={event.slug}/><h3>Register your interest</h3><label>Full name<input name="name" required/></label><label>Email<input name="email" type="email" required/></label><label>Phone<input name="phone" type="tel"/></label><button className="button primary">Register for event</button><small>Your details are stored in MWONET’s event register for authorized officers to manage attendance.</small></form>:<div className="notice">This event has already taken place. See the Media section for published event documentation.</div>}</div></div></section></>
}
