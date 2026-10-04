import {getPublicCmsPage,getPublicCmsMetadata} from "../_lib/public-cms";
import CmsPageRenderer from "../components/CmsPageRenderer";
import Link from "next/link";import PageHero from "../components/PageHero";import {images} from "../data/site";
const ways=[["volunteer","Volunteer","Give your time, skills and energy."],["partner","Partner","Collaborate on programs and projects."],["support","Support","Strengthen community and environmental action."],["donate","Donate","Contribute to approved initiatives and restoration work."]];
function Involved(){return <><PageHero eyebrow="Get involved" title="There is a place for you in the work." text="Choose how you would like to connect with MWONET and help create practical, lasting impact." image={images.community}/><section className="section"><div className="container card-grid two">{ways.map(([slug,title,text],i)=><Link className="involve-card" href={`/get-involved/${slug}`} key={slug}><small>0{i+1}</small><h3>{title}</h3><p>{text}</p><span>Explore →</span></Link>)}</div></section></>}


export default async function CmsAwareInvolved(){
 const cms=await getPublicCmsPage("get-involved");
 if(cms)return <CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>;
 return <Involved/>;
}

export async function generateMetadata(){return getPublicCmsMetadata("get-involved","Get Involved with MWONET")}
