import {db} from "./db";
import {publicPages,permissionGroups} from "../_data/admin";
import {programs} from "../../data/site";

function pathToSlug(path:string){return path==="/"?"home":path.replace(/^\//,"").replaceAll("/","--")}
export function slugToPublicPath(slug:string){return slug==="home"?"/":"/"+slug.replaceAll("--","/")}

const themeCatalog=[
 {key:"mwonet-forest",name:"MWONET Forest",version:"1.1.0",active:true,manifest:{description:"Deep green NGO identity with nature-led imagery and soft cards."},settings:{primary:"#0a7748",dark:"#0d3428",accent:"#9de2b8",pale:"#f2f7f4",text:"#16372c"}},
 {key:"mount-elgon",name:"Mount Elgon",version:"1.1.0",active:false,manifest:{description:"Cinematic mountain identity with earth and forest tones."},settings:{primary:"#657447",dark:"#29392d",accent:"#d7c691",pale:"#f6f2e7",text:"#303c2f"}},
 {key:"community-green",name:"Community Green",version:"1.1.0",active:false,manifest:{description:"Human-centered layouts focused on youth, women and community action."},settings:{primary:"#0f8055",dark:"#123b30",accent:"#f2bd5a",pale:"#f2faf5",text:"#173b31"}},
 {key:"corporate-ngo",name:"Corporate NGO",version:"1.1.0",active:false,manifest:{description:"Clean institutional identity for partners, grants and formal reporting."},settings:{primary:"#245b73",dark:"#1e3341",accent:"#8bb7c9",pale:"#f3f6f8",text:"#263d48"}},
 {key:"youth-impact",name:"Youth Impact",version:"1.1.0",active:false,manifest:{description:"Bolder energetic identity for youth programs and campaigns."},settings:{primary:"#0f765c",dark:"#17382f",accent:"#f3b54b",pale:"#fff7e8",text:"#173b31"}}
];
const pluginCatalog=[
 {key:"media-manager",name:"Media Manager",permissions:["manage_media"],status:"ENABLED" as const,manifest:{description:"Central library for photos, videos, documents and captions."}},
 {key:"events-manager",name:"Events Manager",permissions:["manage_events"],status:"ENABLED" as const,manifest:{description:"Events, registrations, attendance and public schedules."}},
 {key:"member-registry",name:"Member Registry",permissions:["manage_members"],status:"ENABLED" as const,manifest:{description:"Profiles, membership status, subscriptions and participation records."}},
 {key:"project-tracker",name:"Project Tracker",permissions:["manage_projects"],status:"ENABLED" as const,manifest:{description:"Projects, status, dates, locations and implementation records."}},
 {key:"forms-submissions",name:"Forms & Submissions",permissions:["manage_forms"],status:"ENABLED" as const,manifest:{description:"Public forms, applications and structured submissions."}},
 {key:"email-notifications",name:"Email & Notifications",permissions:["manage_email"],status:"ENABLED" as const,manifest:{description:"Official routing status and built-in portal announcements."}},
 {key:"finance-revolving-fund",name:"Finance / Revolving Fund",permissions:["manage_finance"],status:"ENABLED" as const,manifest:{description:"Controlled financial records aligned with MWONET governance rules."}},
 {key:"seo-toolkit",name:"SEO Toolkit",permissions:["manage_seo"],status:"ENABLED" as const,manifest:{description:"Metadata, sitemap, social previews and indexing controls."}},
 {key:"analytics",name:"Reports & Analytics",permissions:["view_reports"],status:"ENABLED" as const,manifest:{description:"Membership, project, finance, content and engagement reporting from MWONET-owned records."}}
];
const defaultForms=[
 {key:"contact",name:"General Contact",schema:{fields:["name","email","phone","subject","message"]}},
 {key:"volunteer",name:"Volunteer Interest",schema:{fields:["name","email","phone","location","skills","availability","message"]}},
 {key:"partner",name:"Partnership Enquiry",schema:{fields:["organization","contactName","email","phone","partnershipType","message"]}},
 {key:"support",name:"Support / Collaboration",schema:{fields:["name","email","phone","supportType","message"]}}
];
const defaultRoles=[
 {name:"Super Admin",description:"Owner-level platform control. Can manage every module, role, theme, plugin, setting and destructive action."},
 {name:"Administrator",description:"Senior day-to-day administration. Can edit and publish operational content, manage people and programs, but cannot control themes/plugins/system ownership or permanent deletion."},
 {name:"Chairperson",description:"Leadership oversight, reports, programs, projects, events, members and official communications without destructive system control."},
 {name:"Secretary",description:"Leadership records, membership administration, events, forms, communications and reports."},
 {name:"Treasurer",description:"Finance, membership contribution visibility, reports and audit-oriented financial administration."},
 {name:"Editor",description:"Pages, news, events, media and SEO publishing workflows."},
 {name:"Project Manager",description:"Programs, projects, events and field implementation records."},
 {name:"Membership Officer",description:"Member review, approvals, status and participation records."},
 {name:"Media Manager",description:"Media library, galleries and approved communications assets."},
 {name:"Auditor",description:"Read-only oversight for reports, finance and audit records."}
];
const rolePermissions:Record<string,string[]>={
 Administrator:["edit_pages","publish_pages","manage_media","manage_navigation","manage_seo","manage_posts","view_members","manage_members","approve_members","manage_users","manage_leadership","manage_programs","manage_projects","manage_events","manage_forms","manage_partners","manage_email","manage_notifications","publish_announcements","manage_settings","view_audit_logs","view_reports"],
 Chairperson:["view_members","manage_leadership","manage_programs","manage_projects","manage_events","manage_partners","manage_email","manage_notifications","publish_announcements","view_audit_logs","view_reports","view_finance"],
 Secretary:["edit_pages","manage_posts","manage_events","manage_forms","view_members","manage_members","approve_members","manage_leadership","manage_email","manage_notifications","publish_announcements","view_reports"],
 Treasurer:["view_members","view_finance","manage_finance","approve_transactions","manage_revolving_fund","view_reports","view_audit_logs"],
 Editor:["edit_pages","publish_pages","manage_media","manage_seo","manage_posts","manage_events"],
 "Project Manager":["manage_programs","manage_projects","manage_events","manage_forms","manage_partners","view_reports"],
 "Membership Officer":["view_members","manage_members","approve_members","manage_forms","view_reports"],
 "Media Manager":["manage_media","edit_pages","manage_posts","manage_seo"],
 Auditor:["view_finance","view_audit_logs","view_reports","view_members"]
};
const defaultHeader=[{label:"About",href:"/about",location:"header",order:10},{label:"Programs",href:"/focus-areas",location:"header",order:20},{label:"Projects",href:"/projects",location:"header",order:30},{label:"Mount Elgon",href:"/mount-elgon",location:"header",order:40},{label:"Membership",href:"/membership",location:"header",order:50},{label:"Media",href:"/media",location:"header",order:60},{label:"Contact",href:"/contact",location:"header",order:70}];
const defaultFooter=[{label:"About",href:"/about",location:"footer",order:10},{label:"Constitution",href:"/constitution",location:"footer",order:20},{label:"Governance",href:"/governance",location:"footer",order:30},{label:"Leadership",href:"/leadership",location:"footer",order:40},{label:"Membership",href:"/membership",location:"footer",order:50},{label:"Projects",href:"/projects",location:"footer",order:60}];

export async function ensureCorePages(){await Promise.all(publicPages.map(([title,path])=>db.page.upsert({where:{slug:pathToSlug(path)},update:{},create:{slug:pathToSlug(path),title,status:"PUBLISHED",seoTitle:`${title} | MWONET`,description:`Official MWONET ${title} page.`}})))}

export async function ensureSystemCatalog(){
 await Promise.all(programs.map(p=>db.program.upsert({where:{slug:p.slug},update:{},create:{slug:p.slug,title:p.title,summary:p.summary}})));
 await Promise.all(themeCatalog.map(t=>db.theme.upsert({where:{key:t.key},update:{name:t.name,version:t.version,manifest:t.manifest,settings:t.settings},create:{key:t.key,name:t.name,version:t.version,active:t.active,manifest:t.manifest,settings:t.settings}})));
 await Promise.all(pluginCatalog.map(p=>db.plugin.upsert({where:{key:p.key},update:{name:p.name,version:"1.1.0",permissions:p.permissions,manifest:p.manifest},create:{key:p.key,name:p.name,version:"1.1.0",status:p.status,permissions:p.permissions,manifest:p.manifest}})));
 await Promise.all(defaultForms.map(f=>db.form.upsert({where:{key:f.key},update:{name:f.name},create:f})));
 const navigationSeeded=await db.siteSetting.findUnique({where:{key:"system.navigationSeeded"}});if(!navigationSeeded){await db.navigationItem.createMany({data:[...defaultHeader,...defaultFooter]});await db.siteSetting.create({data:{key:"system.navigationSeeded",value:{value:"true"}}})}
 const permissionKeys=permissionGroups.flatMap(g=>g.permissions);const permissions=await Promise.all(permissionKeys.map(key=>db.permission.upsert({where:{key},update:{},create:{key,description:key.replaceAll("_"," ")}})));const roles=await Promise.all(defaultRoles.map(r=>db.role.upsert({where:{name:r.name},update:{description:r.description},create:r})));const permissionMap=new Map(permissions.map(p=>[p.key,p]));
 const superAdmin=roles.find(r=>r.name==="Super Admin");if(superAdmin)await Promise.all(permissionKeys.map(key=>{const p=permissionMap.get(key);return p?db.rolePermission.upsert({where:{roleId_permissionId:{roleId:superAdmin.id,permissionId:p.id}},update:{},create:{roleId:superAdmin.id,permissionId:p.id}}):Promise.resolve(null)}));
 const roleSeeded=await db.siteSetting.findUnique({where:{key:"system.rolePermissionsSeeded"}});if(!roleSeeded){for(const role of roles.filter(r=>r.name!=="Super Admin")){const keys=rolePermissions[role.name]||[];await Promise.all(keys.map(key=>{const p=permissionMap.get(key);return p?db.rolePermission.upsert({where:{roleId_permissionId:{roleId:role.id,permissionId:p.id}},update:{},create:{roleId:role.id,permissionId:p.id}}):Promise.resolve(null)}))}await db.siteSetting.create({data:{key:"system.rolePermissionsSeeded",value:{value:"true"}}})}
}

export async function getCmsPages(){await ensureCorePages();return db.page.findMany({orderBy:{title:"asc"},include:{_count:{select:{revisions:true,blocks:true}}}})}
export async function getCmsPage(slug:string){await ensureCorePages();return db.page.findUnique({where:{slug},include:{blocks:{orderBy:{position:"asc"}},revisions:{orderBy:{createdAt:"desc"},take:10,include:{author:true}}}})}
export async function ensureAdminUser(email:string){if(!email)return null;await ensureSystemCatalog();const normalized=email.trim().toLowerCase();const ownerEmail=(process.env.MWONET_ADMIN_EMAIL||"").trim().toLowerCase();const user=await db.user.upsert({where:{email:normalized},update:{status:"ACTIVE"},create:{email:normalized,name:normalized===ownerEmail?"MWONET Super Admin":"MWONET Administrator",status:"ACTIVE"}});if(ownerEmail&&normalized===ownerEmail){const role=await db.role.upsert({where:{name:"Super Admin"},update:{description:"Full MWONET administrative access."},create:{name:"Super Admin",description:"Full MWONET administrative access."}});await db.userRole.upsert({where:{userId_roleId:{userId:user.id,roleId:role.id}},update:{},create:{userId:user.id,roleId:role.id}})}return user}
export async function databaseHealth(){const started=Date.now();try{await db.$queryRaw`SELECT 1`;return {ok:true,latency:Date.now()-started}}catch(error){return {ok:false,latency:Date.now()-started,error:error instanceof Error?error.message:"Database unavailable"}}}
