import {db} from "../admin/_lib/db";

const defaults:Record<string,string>={
 "organization.phone":"",
 "organization.email":"info@mwonet.org",
 "organization.secondaryEmail":"chesebe@mwonet.org",
 "organization.address":"Kapkatenyi, Kopsiro Sub-County, Bungoma County, Kenya",
 "organization.mapUrl":"",
 "social.facebook":"",
 "social.instagram":"",
 "social.youtube":"",
 "social.linkedin":""
};
export async function getSiteConfig(){
 try{
  const rows=await db.siteSetting.findMany({where:{key:{in:Object.keys(defaults)}}});
  const out={...defaults};
  for(const row of rows){const v=row.value&&typeof row.value==="object"&&!Array.isArray(row.value)?String((row.value as Record<string,unknown>).value||""):"";if(v)out[row.key]=v}
  return out;
 }catch{return {...defaults}}
}
