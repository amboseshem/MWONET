import Link from "next/link";
import {requireAdmin} from "../../_lib/auth";
import {canAccess,getUserAccess} from "../../_lib/access";
import {db} from "../../_lib/db";

export const dynamic="force-dynamic";
export default async function AdminSearch({searchParams}:{searchParams:Promise<{q?:string}>}){
 const session=await requireAdmin();const access=await getUserAccess(session.email);const {q=""}=await searchParams;const term=q.trim();
 if(!term)return <main className="admin-content"><div className="admin-page-head"><div><h1>Search</h1><p>Type a page, person, project, event or news title in the search box above.</p></div></div></main>;
 const contains={contains:term,mode:"insensitive" as const};
 const [pages,users,projects,posts,events,media]=await Promise.all([
  canAccess(access.permissions,access.isSuperAdmin,"edit_pages")?db.page.findMany({where:{OR:[{title:contains},{slug:contains}]},take:20}):[],
  canAccess(access.permissions,access.isSuperAdmin,"manage_users")?db.user.findMany({where:{OR:[{name:contains},{email:contains}]},take:20,include:{member:true}}):[],
  canAccess(access.permissions,access.isSuperAdmin,"manage_projects")?db.project.findMany({where:{OR:[{title:contains},{slug:contains},{location:contains}]},take:20}):[],
  canAccess(access.permissions,access.isSuperAdmin,"manage_posts")?db.post.findMany({where:{OR:[{title:contains},{slug:contains}]},take:20}):[],
  canAccess(access.permissions,access.isSuperAdmin,"manage_events")?db.event.findMany({where:{OR:[{title:contains},{slug:contains},{venue:contains}]},take:20}):[],
  canAccess(access.permissions,access.isSuperAdmin,"manage_media")?db.mediaAsset.findMany({where:{OR:[{title:contains},{altText:contains},{caption:contains}]},take:20}):[]
 ]);
 const total=pages.length+users.length+projects.length+posts.length+events.length+media.length;
 const Group=({title,children}:{title:string;children:React.ReactNode})=><section className="admin-panel"><div className="admin-panel-head"><h2>{title}</h2></div>{children}</section>;
 return <main className="admin-content"><div className="admin-page-head"><div><span className="admin-breadcrumb">MWONET Admin / Search</span><h1>Results for “{term}”</h1><p>{total} result{total===1?"":"s"} found in the areas your role is allowed to access.</p></div></div>{pages.length>0&&<Group title="Pages"><div className="admin-config-list">{pages.map(x=><Link key={x.id} href={`/admin/pages/${x.slug}`}><strong>{x.title}</strong> · /{x.slug}</Link>)}</div></Group>}{users.length>0&&<Group title="Users"><div className="admin-config-list">{users.map(x=><Link key={x.id} href="/admin/users"><strong>{x.name||x.email}</strong> · {x.email} {x.member?.memberNumber?`· ${x.member.memberNumber}`:""}</Link>)}</div></Group>}{projects.length>0&&<Group title="Projects"><div className="admin-config-list">{projects.map(x=><Link key={x.id} href={`/admin/edit/project/${x.id}`}><strong>{x.title}</strong> · {x.status}</Link>)}</div></Group>}{posts.length>0&&<Group title="News"><div className="admin-config-list">{posts.map(x=><Link key={x.id} href={`/admin/edit/post/${x.id}`}><strong>{x.title}</strong> · {x.status}</Link>)}</div></Group>}{events.length>0&&<Group title="Events"><div className="admin-config-list">{events.map(x=><Link key={x.id} href={`/admin/edit/event/${x.id}`}><strong>{x.title}</strong> · {x.startsAt.toLocaleDateString("en-KE")}</Link>)}</div></Group>}{media.length>0&&<Group title="Media"><div className="admin-config-list">{media.map(x=><Link key={x.id} href={`/admin/media?edit=${x.id}`}><strong>{x.title||"Untitled asset"}</strong> · {x.type}</Link>)}</div></Group>}{total===0&&<div className="admin-empty"><strong>No matching records</strong>Try another word or check whether your role has access to the relevant module.</div>}</main>
}
