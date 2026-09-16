import Link from "next/link";
import {notFound} from "next/navigation";
import CmsPageRenderer from "../../../../../components/CmsPageRenderer";
import {getCmsPage} from "../../../../_lib/cms";

export const dynamic="force-dynamic";

export default async function AdminCmsPreview({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const page=await getCmsPage(slug);if(!page)return notFound();return <main><div style={{position:"sticky",top:0,zIndex:200,background:"#092f24",color:"white",padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}><span style={{fontSize:12}}>CMS PREVIEW · {page.status} · not the public page until published/connected</span><Link href={`/admin/pages/${slug}`} style={{color:"white",fontWeight:800,fontSize:12}}>← Back to editor</Link></div><CmsPageRenderer title={page.title} description={page.description} blocks={page.blocks.map(b=>({type:b.type,position:b.position,data:b.data}))}/></main>}
