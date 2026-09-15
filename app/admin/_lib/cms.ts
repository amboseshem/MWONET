import {db} from "./db";
import {publicPages} from "../_data/admin";

function pathToSlug(path:string){return path==="/"?"home":path.replace(/^\//,"").replaceAll("/","--")}
export function slugToPublicPath(slug:string){return slug==="home"?"/":"/"+slug.replaceAll("--","/")}

export async function ensureCorePages(){
  await Promise.all(publicPages.map(([title,path])=>db.page.upsert({
    where:{slug:pathToSlug(path)},
    update:{},
    create:{slug:pathToSlug(path),title,status:"PUBLISHED",seoTitle:`${title} | MWONET`,description:`Official MWONET ${title} page.`}
  })));
}

export async function getCmsPages(){
  await ensureCorePages();
  return db.page.findMany({orderBy:{title:"asc"},include:{_count:{select:{revisions:true,blocks:true}}}});
}

export async function getCmsPage(slug:string){
  await ensureCorePages();
  return db.page.findUnique({where:{slug},include:{blocks:{orderBy:{position:"asc"}},revisions:{orderBy:{createdAt:"desc"},take:10,include:{author:true}}}});
}

export async function ensureAdminUser(email:string){
  if(!email)return null;
  const user=await db.user.upsert({where:{email},update:{status:"ACTIVE",lastLoginAt:new Date()},create:{email,name:"MWONET Super Admin",status:"ACTIVE",lastLoginAt:new Date()}});
  const role=await db.role.upsert({where:{name:"Super Admin"},update:{description:"Full MWONET administrative access."},create:{name:"Super Admin",description:"Full MWONET administrative access."}});
  await db.userRole.upsert({where:{userId_roleId:{userId:user.id,roleId:role.id}},update:{},create:{userId:user.id,roleId:role.id}});
  return user;
}

export async function databaseHealth(){
  const started=Date.now();
  try{
    await db.$queryRaw`SELECT 1`;
    return {ok:true,latency:Date.now()-started};
  }catch(error){
    return {ok:false,latency:Date.now()-started,error:error instanceof Error?error.message:"Database unavailable"};
  }
}
