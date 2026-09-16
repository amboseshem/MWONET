import type { Metadata } from "next";
import "./globals.css";
import "./constitution.css";
import "./member-auth.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://mwonet.org"),
  title: {default:"MWONET | Maanisha Western Organization Network",template:"%s | MWONET"},
  description:"Official website of Maanisha Western Organization Network (MWONET), headquartered in Kapkatenyi, Kopsiro Sub-County, Bungoma County, Kenya. Environmental conservation, youth and women empowerment, agribusiness, food security and financial self-reliance.",
  keywords:["MWONET","Maanisha Western Organization Network","Bungoma","Kopsiro","Mount Elgon","environmental conservation","tree nursery","youth empowerment","women empowerment","agribusiness","coffee seedlings","micro-credit"],
  openGraph:{title:"MWONET | Maanisha Western Organization Network",description:"Conservation, enterprise and self-reliance rooted in Bungoma County and the Mount Elgon landscape.",url:"https://mwonet.org",siteName:"MWONET",type:"website"},
  robots:{index:true,follow:true}
};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body><SiteHeader/><main>{children}</main><SiteFooter/></body></html>
}
