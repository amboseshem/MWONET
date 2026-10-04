import type {CSSProperties} from "react";
import type {Metadata} from "next";
import "./globals.css";
import "./constitution.css";
import "./member-auth.css";
import "./cms-public.css";
import "./theme-presets.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import {db} from "./admin/_lib/db";

export const metadata: Metadata = {
  metadataBase: new URL("https://mwonet.org"),
  title: {default:"MWONET | Maanisha Western Organization Network",template:"%s | MWONET"},
  description:"Official website of Maanisha Western Organization Network (MWONET), headquartered in Kapkatenyi, Kopsiro Sub-County, Bungoma County, Kenya. Environmental conservation, youth and women empowerment, agribusiness, food security and financial self-reliance.",
  keywords:["MWONET","Maanisha Western Organization Network","Bungoma","Kopsiro","Mount Elgon","environmental conservation","tree nursery","youth empowerment","women empowerment","agribusiness","coffee seedlings","micro-credit"],
  openGraph:{title:"MWONET | Maanisha Western Organization Network",description:"Conservation, enterprise and self-reliance rooted in Bungoma County and the Mount Elgon landscape.",url:"https://mwonet.org",siteName:"MWONET",type:"website"},
  robots:{index:true,follow:true}
};

type ThemeVars=CSSProperties&{"--mw-primary"?:string;"--mw-dark"?:string;"--mw-accent"?:string;"--mw-pale"?:string;"--mw-text"?:string};
export default async function RootLayout({children}:{children:React.ReactNode}){
 let key="mwonet-forest",settings:Record<string,string>={primary:"#0a7748",dark:"#0d3428",accent:"#9de2b8",pale:"#f2f7f4",text:"#16372c"};
 try{const theme=await db.theme.findFirst({where:{active:true}});if(theme){key=theme.key;const raw=theme.settings;if(raw&&typeof raw==="object"&&!Array.isArray(raw))settings={...settings,...raw as Record<string,string>}}}catch{}
 const style:ThemeVars={"--mw-primary":settings.primary,"--mw-dark":settings.dark,"--mw-accent":settings.accent,"--mw-pale":settings.pale,"--mw-text":settings.text};
 return <html lang="en"><body className={"theme-"+key} style={style}><SiteHeader/><main>{children}</main><SiteFooter/></body></html>
}
