import {db} from "../admin/_lib/db";

export async function getPublicCmsPage(slug:string){
 const page=await db.page.findUnique({where:{slug},include:{blocks:{orderBy:{position:"asc"}}}});
 if(!page||page.status!=="PUBLISHED"||page.blocks.length===0)return null;
 return page;
}
