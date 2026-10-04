import {getAdminSession} from "../../../_lib/auth";
import {requirePermission} from "../../../_lib/access";
import {notFound} from "next/navigation";
import Link from "next/link";
import {db} from "../../../_lib/db";

export const dynamic="force-dynamic";
export default async function FormSubmissions({params}:{params:Promise<{id:string}>}){const session=await getAdminSession();if(!session)throw new Error("Not signed in");await requirePermission(session.email,"manage_forms");
 const {id}=await params;const form=await db.form.findUnique({where:{id},include:{submissions:{orderBy:{createdAt:"desc"},take:500}}});if(!form)return notFound();
 return <main className="admin-content"><div className="admin-page-head"><div><span className="admin-breadcrumb">MWONET Admin / Forms / Submissions</span><h1>{form.name}</h1><p>Review information submitted through the public form. Treat personal information as confidential and share it only with authorized officers.</p></div><Link className="admin-secondary" href="/admin/forms">← Back to forms</Link></div><section className="admin-panel"><div className="admin-panel-head"><h2>Submissions</h2><span className="admin-badge">{form.submissions.length}</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Date</th><th>Submitted information</th></tr></thead><tbody>{form.submissions.length?form.submissions.map(s=><tr key={s.id}><td>{s.createdAt.toLocaleString("en-KE")}</td><td><div className="admin-config-list">{Object.entries((s.data&&typeof s.data==="object"&&!Array.isArray(s.data)?s.data:{} ) as Record<string,unknown>).map(([k,v])=><div key={k}><strong>{k.replaceAll("_"," ")}</strong><span>{String(v)}</span></div>)}</div></td></tr>):<tr><td colSpan={2}>No submissions yet.</td></tr>}</tbody></table></div></section></main>
}
