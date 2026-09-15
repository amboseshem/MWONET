import Link from "next/link";
import {getCmsPages,slugToPublicPath} from "../../_lib/cms";

export const dynamic="force-dynamic";

export default async function AdminPages(){
 const pages=await getCmsPages();
 return <main className="admin-content">
  <div className="admin-page-head"><div><span className="admin-breadcrumb">MWONET Admin / Website</span><h1>Pages</h1><p>Database-backed page management for the MWONET website. Every edit can now create a revision and audit trail.</p></div><span className="admin-badge">Database connected</span></div>
  <section className="admin-panel"><div className="admin-panel-head"><h2>Website pages</h2><span className="admin-badge">{pages.length} managed pages</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Page</th><th>URL</th><th>Status</th><th>Content</th><th>Editor</th><th>Public view</th></tr></thead><tbody>{pages.map(page=>{const path=slugToPublicPath(page.slug);return <tr key={page.id}><td><strong>{page.title}</strong><small>Updated {page.updatedAt.toLocaleDateString("en-KE")}</small></td><td><code>{path}</code></td><td><span className="admin-badge">{page.status}</span></td><td><small>{page._count.blocks} blocks · {page._count.revisions} revisions</small></td><td><Link className="admin-action-link" href={`/admin/pages/${page.slug}`}>Edit page →</Link></td><td><Link className="admin-action-link" href={path} target="_blank">View ↗</Link></td></tr>})}</tbody></table></div></section>
  <section className="admin-panel"><div className="admin-panel-head"><h2>Publishing workflow</h2></div><div className="admin-quick-grid"><span className="admin-section-note">Draft</span><span className="admin-section-note">Review</span><span className="admin-section-note">Published</span><span className="admin-section-note">Scheduled</span></div><p className="admin-section-note">Page identity, hero content, SEO metadata, revision history and audit logging are now stored in PostgreSQL. We will continue connecting individual public-page sections to these CMS records.</p></section>
 </main>
}
