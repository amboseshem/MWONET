import type {MetadataRoute} from "next";
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:"*",allow:"/",disallow:["/admin","/portal","/forms"]},sitemap:"https://mwonet.org/sitemap.xml"}}
