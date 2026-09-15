import {db} from "../../_lib/db";
import {ensureSystemCatalog} from "../../_lib/cms";
import {togglePluginAction} from "./actions";

export const dynamic="force-dynamic";

const icons:Record<string,string>={"media-manager":"▧","events-manager":"◫","member-registry":"◉","project-tracker":"◇","forms-submissions":"▣","email-notifications":"✉","finance-revolving-fund":"KSh","seo-toolkit":"⌕","analytics":"↗"};

export default async function AdminPlugins(){
 await ensureSystemCatalog();
 const plugins=await db.plugin.findMany({orderBy:{name:"asc"}});
 return <main className="admin-content"><div className="admin-page-head"><div><span className="admin-breadcrumb">MWONET Admin / Website</span><h1>Plugins</h1><p>A WordPress-inspired plugin centre using controlled MWONET modules. Enable and disable approved modules without exposing the system to arbitrary PHP/plugin code.</p></div><span className="admin-badge">{plugins.filter(p=>p.status==="ENABLED").length} enabled</span></div><div className="admin-plugin-grid">{plugins.map(p=>{const manifest=p.manifest as {description?:string};const enabled=p.status==="ENABLED";return <article className="admin-plugin-card" key={p.id}><span className="admin-app-icon">{icons[p.key]||"⌘"}</span><h3>{p.name}</h3><p>{manifest.description||"MWONET compatible module."}</p><small>Version {p.version}</small><footer><span className={`admin-badge ${enabled?"":"gray"}`}>{p.status}</span><form action={togglePluginAction}><input type="hidden" name="key" value={p.key}/><input type="hidden" name="next" value={enabled?"disable":"enable"}/><button className="admin-secondary" type="submit">{enabled?"Disable":"Enable"}</button></form></footer></article>})}</div><section className="admin-panel" style={{marginTop:18}}><div className="admin-panel-head"><h2>Security model</h2></div><p className="admin-section-note">Each plugin declares its permissions in a database-backed manifest. Only allow-listed MWONET modules are enabled. Arbitrary WordPress/PHP plugins are not executed inside this Next.js application, protecting admin credentials, member records and the public website.</p></section></main>}
