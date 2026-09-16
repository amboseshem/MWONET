export type AdminModule={slug:string;label:string;description:string;icon:string;group:string;status?:string};
export const adminModules:AdminModule[]=[
 {slug:"pages",label:"Pages",description:"Edit website pages, sections, SEO copy and publishing status.",icon:"▤",group:"Website"},
 {slug:"media",label:"Media Library",description:"Manage photos, videos, documents, captions, alt text and reusable assets.",icon:"▧",group:"Website"},
 {slug:"navigation",label:"Menus & Navigation",description:"Control header, footer, portal links and menu ordering.",icon:"☰",group:"Website"},
 {slug:"themes",label:"Themes",description:"Preview and manage MWONET-compatible visual themes.",icon:"◐",group:"Website"},
 {slug:"plugins",label:"Plugins",description:"Enable controlled MWONET modules and integrations.",icon:"⌘",group:"Website"},
 {slug:"seo",label:"SEO & Discoverability",description:"Metadata, social previews, sitemap, robots and search visibility.",icon:"⌕",group:"Website"},
 {slug:"posts",label:"News & Posts",description:"Draft, review and publish news, stories and field updates.",icon:"✎",group:"Content"},
 {slug:"events",label:"Events",description:"Create events, registrations, attendance records and schedules.",icon:"◫",group:"Content"},
 {slug:"programs",label:"Programs",description:"Manage focus areas, activities, targets, results and constitutional programs.",icon:"◎",group:"Programs"},
 {slug:"projects",label:"Projects",description:"Track field projects, milestones, evidence, locations and implementation status.",icon:"◇",group:"Programs"},
 {slug:"partners",label:"Partners",description:"Maintain partner, collaborator, donor and institutional relationship records.",icon:"∞",group:"Programs"},
 {slug:"leadership",label:"Leadership",description:"Maintain official leadership profiles, roles, biographies and contacts.",icon:"♙",group:"People"},
 {slug:"members",label:"Members",description:"Membership records, status, participation, subscriptions and approvals.",icon:"◉",group:"People"},
 {slug:"users",label:"Users",description:"Accounts, sign-ins, status, portal access and role assignments.",icon:"♙",group:"People"},
 {slug:"roles",label:"Roles & Permissions",description:"Fine-grained access control for every admin capability.",icon:"⌾",group:"Security"},
 {slug:"forms",label:"Forms",description:"Manage public forms, applications, submissions and routing.",icon:"▣",group:"Operations"},
 {slug:"email",label:"Email & Communications",description:"Official addresses, routing status, communication templates and channel readiness.",icon:"✉",group:"Operations"},
 {slug:"finance",label:"Finance & Revolving Fund",description:"Prepare controlled financial records, contributions, savings, loans and approvals.",icon:"KSh",group:"Operations"},
 {slug:"reports",label:"Reports & Impact",description:"Operational, membership, project, finance and impact reporting centre.",icon:"↗",group:"Operations"},
 {slug:"notifications",label:"Notifications",description:"Prepare announcements, reminders and future email/SMS/push communication workflows.",icon:"●",group:"Operations"},
 {slug:"audit-logs",label:"Audit Logs",description:"See who changed what, when and from which admin area.",icon:"◴",group:"Security"},
 {slug:"settings",label:"Site Settings",description:"Organization identity, contacts, defaults and global website settings.",icon:"⚙",group:"System"},
 {slug:"system",label:"System Health",description:"Deployment, database readiness, integrations and operational health.",icon:"◌",group:"System"}
];

export const publicPages=[
 ["Home","/"],["About MWONET","/about"],["Focus Areas","/focus-areas"],["Mount Elgon","/mount-elgon"],["Tree Nursery & Restoration","/tree-restoration"],["Youth & Community","/youth-community"],["Membership","/membership"],["Governance","/governance"],["Financial Model","/financial-model"],["Leadership","/leadership"],["Media","/media"],["News","/news"],["Events","/events"],["Partners","/partners"],["Get Involved","/get-involved"],["Contact","/contact"],["Constitution","/constitution"]
] as const;

export const permissionGroups=[
 {name:"Website",permissions:["edit_pages","publish_pages","manage_media","manage_navigation","manage_themes","manage_plugins","manage_seo"]},
 {name:"People",permissions:["view_members","manage_members","approve_members","manage_users","manage_roles","manage_leadership"]},
 {name:"Programs",permissions:["manage_programs","manage_projects","manage_events","manage_forms","manage_partners"]},
 {name:"Finance",permissions:["view_finance","manage_finance","approve_transactions","manage_revolving_fund"]},
 {name:"Communications",permissions:["manage_email","manage_notifications","publish_announcements"]},
 {name:"System",permissions:["manage_settings","view_audit_logs","manage_system","view_reports"]}
];
