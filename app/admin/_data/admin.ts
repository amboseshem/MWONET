export type AdminModule={slug:string;label:string;description:string;icon:string;group:string;status?:string};
export const adminModules:AdminModule[]=[
 {slug:"pages",label:"Pages",description:"Edit website pages, sections, SEO copy and publishing status.",icon:"▤",group:"Website"},
 {slug:"media",label:"Media Library",description:"Manage photos, videos, documents, captions and alt text.",icon:"▧",group:"Website"},
 {slug:"navigation",label:"Menus & Navigation",description:"Control header, footer and menu ordering.",icon:"☰",group:"Website"},
 {slug:"themes",label:"Themes",description:"Preview and manage MWONET-compatible visual themes.",icon:"◐",group:"Website"},
 {slug:"plugins",label:"Plugins",description:"Enable controlled MWONET modules and integrations.",icon:"⌘",group:"Website"},
 {slug:"posts",label:"News & Posts",description:"Draft, review and publish news and stories.",icon:"✎",group:"Content"},
 {slug:"events",label:"Events",description:"Create events, registrations and attendance records.",icon:"◫",group:"Content"},
 {slug:"programs",label:"Programs",description:"Manage focus areas, activities, targets and results.",icon:"◎",group:"Programs"},
 {slug:"projects",label:"Projects",description:"Track field projects, milestones, evidence and updates.",icon:"◇",group:"Programs"},
 {slug:"leadership",label:"Leadership",description:"Maintain official profiles, roles and biographies.",icon:"♙",group:"People"},
 {slug:"members",label:"Members",description:"Membership records, status, participation and subscriptions.",icon:"◉",group:"People"},
 {slug:"users",label:"Users",description:"Accounts, sign-ins, status and access assignments.",icon:"♙",group:"People"},
 {slug:"roles",label:"Roles & Permissions",description:"Fine-grained access control for every admin capability.",icon:"⌾",group:"Security"},
 {slug:"forms",label:"Forms",description:"Manage public forms, submissions and routing.",icon:"▣",group:"Operations"},
 {slug:"email",label:"Email",description:"Official addresses, routing status and communication settings.",icon:"✉",group:"Operations"},
 {slug:"seo",label:"SEO",description:"Metadata, social previews, sitemap and indexing controls.",icon:"⌕",group:"Website"},
 {slug:"audit-logs",label:"Audit Logs",description:"See who changed what, when and from which admin area.",icon:"◴",group:"Security"},
 {slug:"settings",label:"Site Settings",description:"Organization identity, contacts and global website settings.",icon:"⚙",group:"System"},
 {slug:"system",label:"System Health",description:"Deployment, database readiness and integration status.",icon:"◌",group:"System"}
];

export const publicPages=[
 ["Home","/"],["About MWONET","/about"],["Focus Areas","/focus-areas"],["Mount Elgon","/mount-elgon"],["Tree Nursery & Restoration","/tree-restoration"],["Youth & Community","/youth-community"],["Membership","/membership"],["Governance","/governance"],["Financial Model","/financial-model"],["Leadership","/leadership"],["Media","/media"],["News","/news"],["Events","/events"],["Partners","/partners"],["Get Involved","/get-involved"],["Contact","/contact"],["Constitution","/constitution"]
] as const;

export const permissionGroups=[
 {name:"Website",permissions:["edit_pages","publish_pages","manage_media","manage_navigation","manage_themes","manage_plugins","manage_seo"]},
 {name:"People",permissions:["view_members","manage_members","approve_members","manage_users","manage_roles"]},
 {name:"Programs",permissions:["manage_programs","manage_projects","manage_events","manage_forms"]},
 {name:"Finance",permissions:["view_finance","manage_finance","approve_transactions"]},
 {name:"System",permissions:["manage_settings","view_audit_logs","manage_system"]}
];
