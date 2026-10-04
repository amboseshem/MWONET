export type AdminModule={slug:string;label:string;description:string;icon:string;group:string;status?:string};
export const adminModules:AdminModule[]=[
 {slug:"pages",label:"Pages",description:"Edit public pages, content blocks, SEO, visibility, revisions and publishing workflow.",icon:"▤",group:"Website"},
 {slug:"media",label:"Media Library",description:"Manage approved photos, videos, documents, captions, alt text, tags and reusable URLs.",icon:"▧",group:"Website"},
 {slug:"navigation",label:"Menus & Navigation",description:"Control database-managed header, footer and portal links and their display order.",icon:"☰",group:"Website"},
 {slug:"themes",label:"Themes",description:"Activate safe MWONET visual presets or create controlled colour-based themes.",icon:"◐",group:"Website"},
 {slug:"plugins",label:"Plugins",description:"Enable or disable approved MWONET feature modules without running unsafe external PHP code.",icon:"⌘",group:"Website"},
 {slug:"seo",label:"SEO & Discoverability",description:"Manage metadata, social previews, sitemap, robots, canonical URLs and search visibility.",icon:"⌕",group:"Website"},
 {slug:"posts",label:"News & Posts",description:"Draft, review, publish, edit and archive official news, stories and field updates.",icon:"✎",group:"Content"},
 {slug:"events",label:"Events",description:"Create public events, receive registrations, record attendance and manage schedules.",icon:"◫",group:"Content"},
 {slug:"programs",label:"Programs",description:"Manage constitutional program areas and connect them to active MWONET projects.",icon:"◎",group:"Programs"},
 {slug:"projects",label:"Projects",description:"Track field projects, status, dates, locations, program links and implementation notes.",icon:"◇",group:"Programs"},
 {slug:"partners",label:"Partners",description:"Maintain verified partner, collaborator, donor and institutional profiles shown publicly.",icon:"∞",group:"Programs"},
 {slug:"leadership",label:"Leadership",description:"Maintain verified official profiles, roles, biographies, contacts, order and public visibility.",icon:"♙",group:"People"},
 {slug:"members",label:"Members",description:"Review applications, approve membership, issue member numbers and control membership status.",icon:"◉",group:"People"},
 {slug:"users",label:"Users",description:"Manage accounts, sign-in status, role assignment, leadership promotion and assisted password reset.",icon:"♙",group:"People"},
 {slug:"roles",label:"Roles & Permissions",description:"Control exactly which administrative capabilities each officer or staff role receives.",icon:"⌾",group:"Security"},
 {slug:"forms",label:"Forms",description:"Build public forms, review submissions and route contact, volunteer, partner and support information.",icon:"▣",group:"Operations"},
 {slug:"email",label:"Email & Communications",description:"Document official addresses, incoming routing, portal communication and outbound-mail readiness.",icon:"✉",group:"Operations"},
 {slug:"finance",label:"Finance & Revolving Fund",description:"Record controlled financial entries with pending, approved or rejected status and audit history.",icon:"KSh",group:"Operations"},
 {slug:"reports",label:"Reports & Impact",description:"Summarize membership, programs, projects, content, forms and approved finance records, with CSV export.",icon:"↗",group:"Operations"},
 {slug:"notifications",label:"Notifications",description:"Create targeted announcements for all members, active members or leadership inside the member portal.",icon:"●",group:"Operations"},
 {slug:"audit-logs",label:"Audit Logs",description:"See administrative actions, actors, resources and timestamps for accountability.",icon:"◴",group:"Security"},
 {slug:"settings",label:"Site Settings",description:"Manage verified organization contact details, location, map and official social links.",icon:"⚙",group:"System"},
 {slug:"system",label:"System Health",description:"Check database connectivity, environment readiness, content counts and operational health.",icon:"◌",group:"System"}
];

export const publicPages=[["Home","/"],["About MWONET","/about"],["Focus Areas","/focus-areas"],["Mount Elgon","/mount-elgon"],["Tree Nursery & Restoration","/tree-restoration"],["Youth & Community","/youth-community"],["Membership","/membership"],["Governance","/governance"],["Financial Model","/financial-model"],["Leadership","/leadership"],["Media","/media"],["News","/news"],["Events","/events"],["Partners","/partners"],["Get Involved","/get-involved"],["Contact","/contact"],["Constitution","/constitution"]] as const;

export const permissionGroups=[
 {name:"Website",permissions:["edit_pages","publish_pages","manage_media","manage_navigation","manage_themes","manage_plugins","manage_seo","manage_posts"]},
 {name:"People",permissions:["view_members","manage_members","approve_members","manage_users","manage_roles","manage_leadership"]},
 {name:"Programs",permissions:["manage_programs","manage_projects","manage_events","manage_forms","manage_partners"]},
 {name:"Finance",permissions:["view_finance","manage_finance","approve_transactions","manage_revolving_fund"]},
 {name:"Communications",permissions:["manage_email","manage_notifications","publish_announcements"]},
 {name:"System",permissions:["manage_settings","view_audit_logs","manage_system","view_reports"]}
];
