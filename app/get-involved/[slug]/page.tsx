import {notFound} from "next/navigation";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import {images} from "../../data/site";

const ways:{[k:string]:{title:string;text:string;form?:string;button?:string;note:string}}={
 volunteer:{title:"Volunteer with MWONET",text:"Contribute your time, skills and energy to community and environmental initiatives.",form:"volunteer",button:"Open volunteer form",note:"Your interest is stored securely for authorized MWONET officers to review."},
 partner:{title:"Partner with MWONET",text:"Explore institutional, technical, funding and implementation partnerships.",form:"partner",button:"Open partnership form",note:"Organizations and institutions can submit a structured partnership enquiry."},
 support:{title:"Support the work",text:"Help strengthen specific programs, campaigns and community initiatives.",form:"support",button:"Open support form",note:"Tell MWONET what kind of support, expertise or collaboration you would like to offer."},
 donate:{title:"Support through giving",text:"Financial support should only use an official MWONET payment or banking channel approved by the organization.",note:"No donation account or payment number is published until MWONET formally verifies and approves it. This protects supporters and the organization from incorrect payment details."}
};
export function generateStaticParams(){return Object.keys(ways).map(slug=>({slug}))}
export default async function Way({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const d=ways[slug];if(!d)return notFound();return <><PageHero eyebrow="Get involved" title={d.title} text={d.text} image={images.community}/><section className="section"><div className="container form-layout"><div><p className="eyebrow">NEXT STEP</p><h2>{d.form?"Send your information directly to MWONET.":"Use only verified giving information."}</h2><p>{d.note}</p></div><div className="interest-form">{d.form?<><h3>Structured online application</h3><p>The form works from any phone or computer and saves the submission inside the MWONET administration system.</p><Link className="button primary" href={"/forms/"+d.form}>{d.button}</Link></>:<><h3>Donation details</h3><p>Contact MWONET for the current officially approved channel before sending money.</p><Link className="button primary" href="/contact">Contact MWONET</Link></>}<a className="button" href="mailto:info@mwonet.org">Email info@mwonet.org</a></div></div></section></>}
