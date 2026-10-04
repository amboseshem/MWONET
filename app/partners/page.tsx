import {getPublicCmsPage} from "../_lib/public-cms";
import CmsPageRenderer from "../components/CmsPageRenderer";
import Link from "next/link";import PageHero from "../components/PageHero";import {images} from "../data/site";
function Partners(){return <><PageHero eyebrow="Partners & collaborators" title="Impact grows through partnership." text="A dedicated space for institutions, communities, donors, technical partners and collaborators working alongside MWONET." image={images.community}/><section className="section"><div className="container partner-logo-grid">{[1,2,3,4,5,6,7,8].map(i=><div key={i}>PARTNER LOGO</div>)}</div></section><section className="section tint"><div className="container cta-box"><div><p className="eyebrow">WORK WITH US</p><h2>Bring expertise, resources and local knowledge together.</h2></div><Link className="button primary" href="/get-involved/partner">Become a partner</Link></div></section></>}


export default async function CmsAwarePartners(){
 const cms=await getPublicCmsPage("partners");
 if(cms)return <CmsPageRenderer title={cms.title} description={cms.description} blocks={cms.blocks}/>;
 return <Partners/>;
}
