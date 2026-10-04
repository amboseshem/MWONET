import {db} from "./db";
import {publicPages,permissionGroups} from "../_data/admin";
import {programs} from "../../data/site";

function pathToSlug(path:string){return path==="/"?"home":path.replace(/^\//,"").replaceAll("/","--")}
export function slugToPublicPath(slug:string){return slug==="home"?"/":"/"+slug.replaceAll("--","/")}

const themeCatalog=[
 {key:"mwonet-forest",name:"MWONET Forest",version:"1.0.0",active:true,manifest:{description:"Deep green NGO identity with nature-led imagery and soft cards.",palette:["#0d3127","#0b7449","#edf6f1"]}},
 {key:"mount-elgon",name:"Mount Elgon",version:"1.0.0",active:false,manifest:{description:"Cinematic mountain imagery, earth tones and conservation storytelling."}},
 {key:"community-green",name:"Community Green",version:"1.0.0",active:false,manifest:{description:"Human-centered layouts focused on youth, women and community action."}},
 {key:"corporate-ngo",name:"Corporate NGO",version:"1.0.0",active:false,manifest:{description:"Clean institutional layout for partners, grants and formal reporting."}},
 {key:"youth-impact",name:"Youth Impact",version:"1.0.0",active:false,manifest:{description:"Bolder cards and energetic layouts for youth programs and campaigns."}}
];

const pluginCatalog=[
 {key:"media-manager",name:"Media Manager",permissions:["manage_media"],status:"ENABLED" as const,manifest:{description:"Central library for photos, videos, documents and captions."}},
 {key:"events-manager",name:"Events Manager",permissions:["manage_events"],status:"ENABLED" as const,manifest:{description:"Events, registrations, attendance and public schedules."}},
 {key:"member-registry",name:"Member Registry",permissions:["manage_members"],status:"ENABLED" as const,manifest:{description:"Profiles, membership status, subscriptions and participation records."}},
 {key:"project-tracker",name:"Project Tracker",permissions:["manage_projects"],status:"ENABLED" as const,manifest:{description:"Projects, milestones, updates, evidence and implementation status."}},
 {key:"forms-submissions",name:"Forms & Submissions",permissions:["manage_forms"],status:"ENABLED" as const,manifest:{description:"Public forms, applications and structured submissions."}},
 {key:"email-notifications",name:"Email & Notifications",permissions:["manage_email"],status:"INSTALLED" as const,manifest:{description:"Official routing status, announcements and notification integrations."}},
 {key:"finance-revolving-fund",name:"Finance / Revolving Fund",permissions:["manage_finance"],status:"INSTALLED" as const,manifest:{description:"Controlled financial records aligned with MWONET governance rules."}},
 {key:"seo-toolkit",name:"SEO Toolkit",permissions:["manage_seo"],status:"ENABLED" as const,manifest:{description:"Metadata, sitemap, social previews and indexing controls."}},
 {key:"analytics",name:"Analytics",permissions:["view_reports"],status:"INSTALLED" as const,manifest:{description:"Traffic, content performance and engagement reporting."}}
];

const defaultRoles=[
 {name:"Super Admin",description:"Owner-level platform control. Can manage every module, role, theme, plugin, setting and destructive action."},
 {name:"Administrator",description:"Senior day-to-day administration. Can edit and publish operational content, manage people and programs, but cannot control themes/plugins/system ownership."},
 {name:"Chairperson",description:"Leadership oversight, reports, programs, projects, events, members and official communications without destructive system control."},
 {name:"Secretary",description:"Leadership records, membership administration, minutes/events, forms, communications and reports."},
 {name:"Treasurer",description:"Finance, membership contribution visibility, reports and audit-oriented financial administration."},
 {name:"Editor",description:"Pages, news, events, media and SEO publishing workflows."},
 {name:"Project Manager",description:"Programs, projects, events, evidence and field implementation records."},
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

export async function ensureCorePages(){await Promise.all(publicPages.map(([title,path])=>db.page.upsert({where:{slug:pathToSlug(path)},update:{},create:{slug:pathToSlug(path),title,status:"PUBLISHED",seoTitle:`${title} | MWONET`,description:`Official MWONET ${title} page.`}})))}

export async function ensureSystemCatalog(){
 await Promise.all(programs.map(p=>db.program.upsert({where:{slug:p.slug},update:{title:p.title,summary:p.summary},create:{slug:p.slug,title:p.title,summary:p.summary}})));
 await Promise.all(themeCatalog.map(t=>db.theme.upsert({where:{key:t.key},update:{name:t.name,version:t.version,manifest:t.manifest},create:{key:t.key,name:t.name,version:t.version,active:t.active,manifest:t.manifest}})));
 await Promise.all(pluginCatalog.map(p=>db.plugin.upsert({where:{key:p.key},update:{name:p.name,version:"1.0.0",permissions:p.permissions,manifest:p.manifest},create:{key:p.key,name:p.name,version:"1.0.0",status:p.status,permissions:p.permissions,manifest:p.manifest}})));
 const permissionKeys=permissionGroups.flatMap(g=>g.permissions);
 const permissions=await Promise.all(permissionKeys.map(key=>db.permission.upsert({where:{key},update:{},create:{key,description:key.replaceAll("_"," ")}})));
 const roles=await Promise.all(defaultRoles.map(r=>db.role.upsert({where:{name:r.name},update:{description:r.description},create:r})));
 const permissionMap=new Map(permissions.map(p=>[p.key,p]));
 for(const role of roles){
  const keys=role.name==="Super Admin"?permissionKeys:(rolePermissions[role.name]||[]);
  await Promise.all(keys.map(key=>{const p=permissionMap.get(key);return p?db.rolePermission.upsert({where:{roleId_permissionId:{roleId:role.id,permissionId:p.id}},update:{},create:{roleId:role.id,permissionId:p.id}}):Promise.resolve(null)}));
 }
}

export async function getCmsPages(){await ensureCorePages();return db.page.findMany({orderBy:{title:"asc"},include:{_count:{select:{revisions:true,blocks:true}}}})}
export async function getCmsPage(slug:string){await ensureCorePages();return db.page.findUnique({where:{slug},include:{blocks:{orderBy:{position:"asc"}},revisions:{orderBy:{createdAt:"desc"},take:10,include:{author:true}}}})}

export async function ensureAdminUser(email:string){if(!email)return null;await ensureSystemCatalog();const user=await db.user.upsert({where:{email},update:{status:"ACTIVE",lastLoginAt:new Date()},create:{email,name:"MWONET Super Admin",status:"ACTIVE",lastLoginAt:new Date()}});const role=await db.role.upsert({where:{name:"Super Admin"},update:{description:"Full MWONET administrative access."},create:{name:"Super Admin",description:"Full MWONET administrative access."}});await db.userRole.upsert({where:{userId_roleId:{userId:user.id,roleId:role.id}},update:{},create:{userId:user.id,roleId:role.id}});return user}

export async function databaseHealth(){const started=Date.now();try{await db.$queryRaw`SELECT 1`;return {ok:true,latency:Date.now()-started}}catch(error){return {ok:false,latency:Date.now()-started,error:error instanceof Error?error.message:"Database unavailable"}}}
