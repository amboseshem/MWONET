"use server";
import {redirect} from "next/navigation";
import {db} from "../../admin/_lib/db";

function clean(v:FormDataEntryValue|null){return typeof v==="string"?v.trim():""}
export async function submitPublicForm(fd:FormData){
 const key=clean(fd.get("formKey"));if(!key)return;
 const form=await db.form.findUnique({where:{key}});if(!form)return;
 const schema=form.schema&&typeof form.schema==="object"&&!Array.isArray(form.schema)?form.schema as Record<string,unknown>:{};
 const fields=Array.isArray(schema.fields)?schema.fields.map(String):[];
 const data:Record<string,string>={};
 for(const field of fields){const value=clean(fd.get(field));if(value)data[field]=value}
 if(!Object.keys(data).length)redirect("/forms/"+key+"?error=empty");
 await db.formSubmission.create({data:{formId:form.id,data}});
 redirect("/forms/"+key+"?submitted=1");
}
