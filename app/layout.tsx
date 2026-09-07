import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://mwonet.org"),
  title: {default:"MWONET | People, Nature & Lasting Impact",template:"%s | MWONET"},
  description:"Maanisha Western Organization Network (MWONET) is an NGO advancing environmental conservation, youth empowerment, sustainable agriculture and community development.",
  openGraph:{title:"MWONET",description:"People, Nature & Lasting Impact",url:"https://mwonet.org",siteName:"MWONET",type:"website"},
  robots:{index:true,follow:true}
};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body><SiteHeader/><main>{children}</main><SiteFooter/></body></html>
}
