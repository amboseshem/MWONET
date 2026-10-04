import Link from "next/link";
import {requireAdmin} from "../_lib/auth";
import {adminModules} from "../_data/admin";
import {adminLogout} from "../login/actions";
import {canAccess,getUserAccess,modulePermission} from "../_lib/access";

const sidebarOrder=["pages","media","posts","events","programs","projects","members","users","leadership","forms","finance","reports","notifications","email","partners","themes","plugins","navigation","seo","roles","audit-logs","settings","system"];

export default async function ProtectedAdminLayout({children}:{children:React.ReactNode}){
 const session=await requireAdmin();
 const access=await getUserAccess(session.email);
 const modules=sidebarOrder.map(slug=>adminModules.find(m=>m.slug===slug)).filter(Boolean).filter(m=>canAccess(access.permissions,access.isSuperAdmin,modulePermission[m!.slug])) as typeof adminModules;
 const roleLabel=access.roles.includes("Super Admin")?"Super Admin":(session.role||access.roles[0]||"Admin user");
 return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><img src="/mwonet-logo.svg" alt="MWONET"/><span><strong>MWONET</strong><small>Admin control centre</small></span></Link><nav className="admin-sidebar-nav"><div className="admin-nav-section">Dashboard</div><Link href="/admin"><span>⌂</span>Overview</Link><div className="admin-nav-section">Management</div>{modules.map(m=><Link key={m.slug} href={"/admin/"+m.slug}><span>{m.icon}</span>{m.label}</Link>)}</nav></aside><section className="admin-main"><div className="admin-mobile-nav"><Link href="/admin">Dashboard</Link>{modules.slice(0,5).map(m=><Link key={m.slug} href={"/admin/"+m.slug}>{m.label}</Link>)}</div><header className="admin-topbar"><div className="admin-search"><input aria-label="Search admin" placeholder="Search pages, members, projects..."/></div><div className="admin-topbar-actions"><Link className="admin-pill" href="/" target="_blank">View website ↗</Link><span className="admin-pill">{roleLabel}</span><span className="admin-avatar">{session.email.slice(0,1).toUpperCase()}</span><form action={adminLogout}><button className="admin-secondary" type="submit">Sign out</button></form></div></header>{children}</section></div>
}