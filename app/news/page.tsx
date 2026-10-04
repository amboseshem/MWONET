import {getPublicCmsPage} from "../_lib/public-cms";
import CmsPageRenderer from "../components/CmsPageRenderer";
import Link from "next/link";import PageHero from "../components/PageHero";import {images} from "../data/site";
function News(){return <><PageHero eyebrow="News & updates" title="What is happening at MWONET." text="Announcements, field stories, project milestones, opportunities and community updates." image={images.forest}/><section className="section"><div className="container news-grid">{["Environmental stories and field updates","Youth and community milestones","Partnership and organization news"].map((x,i)=><article className="news-card" key={x}><div className="news-image" style={{backgroundImage:`url(${i===1?images.community:i===2?images.seedlings:images.forest})`}}/><div><small>NEWS • COMING SOON</small><h3>{x}</h3><p>Official article content will be published after verification and approval.</p><Link href="/contact">Contact MWONET →</Link></div></article>)}</div></section></>}


export default async function CmsAwareNews(){
 const cms=await getPublicCmsPage("news");
 if(cms)return <CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>;
 return <News/>;
}
