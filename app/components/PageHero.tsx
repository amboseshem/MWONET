import Link from "next/link";

export default function PageHero({eyebrow,title,text,image,children}:{eyebrow:string;title:string;text:string;image?:string;children?:React.ReactNode}){
  return <section className="page-hero-pro" style={image?{backgroundImage:`linear-gradient(90deg,rgba(7,34,24,.88),rgba(7,34,24,.45)),url(${image})`}:undefined}><div className="container"><Link href="/" className="crumb">Home</Link><span className="crumb-sep">/</span><span>{eyebrow}</span><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{text}</p>{children}</div></section>
}
