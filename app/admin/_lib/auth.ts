import {createHmac,timingSafeEqual} from "crypto";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "./db";
import {verifyPassword} from "../../_lib/member-auth";

const COOKIE_NAME="mwonet_admin_session";
const SESSION_HOURS=8;

type AdminSession={email:string;role:string;exp:number};

function secret(){return process.env.MWONET_ADMIN_SESSION_SECRET||""}
function credentials(){return {email:(process.env.MWONET_ADMIN_EMAIL||"").trim().toLowerCase(),password:process.env.MWONET_ADMIN_PASSWORD||""}}
export function isAdminConfigured(){const c=credentials();return Boolean(c.email&&c.password&&secret().length>=24)}
function sign(value:string){return createHmac("sha256",secret()).update(value).digest("base64url")}
function encode(session:AdminSession){const payload=Buffer.from(JSON.stringify(session)).toString("base64url");return `${payload}.${sign(payload)}`}
function decode(token?:string):AdminSession|null{if(!token||!secret())return null;const [payload,sig]=token.split(".");if(!payload||!sig)return null;const expected=sign(payload);try{const a=Buffer.from(sig);const b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))return null;const value=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")) as AdminSession;if(!value.email||value.exp<Date.now())return null;return value}catch{return null}}
function safeEqual(a:string,b:string){const aa=Buffer.from(a);const bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb)}

async function persistAdminLogin(email:string,roleName:string,method:string){
 try{
  const user=await db.user.update({where:{email},data:{status:"ACTIVE",lastLoginAt:new Date()}});
  await db.auditLog.create({data:{actorId:user.id,action:"admin.login",resource:"Session",metadata:{method,role:roleName}}});
 }catch{}
}

async function environmentLogin(email:string,password:string){
 const c=credentials();
 if(!isAdminConfigured()||!safeEqual(email,c.email)||!safeEqual(password,c.password))return null;
 const user=await db.user.upsert({where:{email:c.email},update:{status:"ACTIVE"},create:{email:c.email,name:"MWONET Super Admin",status:"ACTIVE"}});
 const role=await db.role.upsert({where:{name:"Super Admin"},update:{description:"Full MWONET administrative access."},create:{name:"Super Admin",description:"Full MWONET administrative access."}});
 await db.userRole.upsert({where:{userId_roleId:{userId:user.id,roleId:role.id}},update:{},create:{userId:user.id,roleId:role.id}});
 return {email:c.email,role:"Super Admin",method:"environment-credential"};
}

async function databaseLogin(email:string,password:string){
 const user=await db.user.findUnique({where:{email},include:{roles:{include:{role:true}}}});
 if(!user||user.status!=="ACTIVE"||!user.passwordHash||user.roles.length===0)return null;
 if(!verifyPassword(password,user.passwordHash))return null;
 const allowed=user.roles.filter(r=>r.role.name!=="Member");
 if(!allowed.length)return null;
 const priority=["Super Admin","Administrator","Chairperson","Secretary","Treasurer","Project Manager","Membership Officer","Editor","Media Manager","Auditor"];
 const role=priority.find(name=>allowed.some(r=>r.role.name===name))||allowed[0].role.name;
 return {email:user.email,role,method:"database-role"};
}

export async function authenticateAdmin(emailInput:string,password:string){
 if(!secret()||secret().length<24)return {ok:false,error:"Admin session security is not configured."};
 const email=emailInput.trim().toLowerCase();
 let login=await environmentLogin(email,password);
 if(!login)login=await databaseLogin(email,password);
 if(!login)return {ok:false,error:"Invalid credentials or this account has no admin role."};
 const session:AdminSession={email:login.email,role:login.role,exp:Date.now()+SESSION_HOURS*60*60*1000};
 const jar=await cookies();jar.set(COOKIE_NAME,encode(session),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:SESSION_HOURS*60*60});
 await persistAdminLogin(login.email,login.role,login.method);
 return {ok:true as const};
}
export async function getAdminSession(){const jar=await cookies();return decode(jar.get(COOKIE_NAME)?.value)}
export async function requireAdmin(){const session=await getAdminSession();if(!session)redirect("/admin/login");return session}
export async function clearAdminSession(){const session=await getAdminSession();if(session){try{const user=await db.user.findUnique({where:{email:session.email}});if(user)await db.auditLog.create({data:{actorId:user.id,action:"admin.logout",resource:"Session"}})}catch{}}const jar=await cookies();jar.delete(COOKIE_NAME)}
