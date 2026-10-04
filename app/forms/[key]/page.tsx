import {notFound} from "next/navigation";
import Link from "next/link";
import {db} from "../../admin/_lib/db";
import {ensureSystemCatalog} from "../../admin/_lib/cms";
import {submitPublicForm} from "./actions";

export const dynamic="force-dynamic";
const labels:Record<string,string>={name:"Full name",email:"Email address",phone:"Phone number",subject:"Subject",message:"Message",location:"Location",skills:"Skills / experience",availability:"Availability",organization:"Organization name",contactName:"Contact person",partnershipType:"Partnership interest",supportType:"Type of support"};
const longFields=new Set(["message","skills","partnershipType","supportType"]);
export default async function PublicForm({params,searchParams}:{params:Promise<{key:string}>,searchParams:Promise<{submitted?:string;error?:string}>}){
 await ensureSystemCatalog();const {key}=await params;const q=await searchParams;
 const form=await db.form.findUnique({where:{key}});if(!form)return notFound();
 const schema=form.schema&&typeof form.schema==="object"&&!Array.isArray(form.schema)?form.schema as Record<string,unknown>:{};
 const fields=Array.isArray(schema.fields)?schema.fields.map(String):[];
 return <section className="section"><div className="container"><div className="form-page-shell"><div><p className="eyebrow">MWONET FORM</p><h1>{form.name}</h1><p>Complete the form below. Your submission is stored securely in the MWONET administration system for authorized officers to review.</p>{q.submitted&&<div className="notice">Thank you. Your information has been submitted successfully.</div>}{q.error&&<div className="notice">Please complete the required information before submitting.</div>}</div><form action={submitPublicForm} className="interest-form"><input type="hidden" name="formKey" value={key}/>{fields.map(field=><label key={field}>{labels[field]||field.replaceAll("_"," ")}{longFields.has(field)?<textarea name={field} rows={field==="message"?6:4} required={["message","skills"].includes(field)}/>:<input name={field} type={field==="email"?"email":field==="phone"?"tel":"text"} required={["name","email","contactName","organization"].includes(field)}/>}</label>)}<button className="button primary" type="submit">Submit to MWONET</button></form><p><Link className="text-link" href="/">← Back to website</Link></p></div></div></section>
}
