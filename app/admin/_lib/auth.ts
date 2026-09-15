import {createHmac,timingSafeEqual} from "crypto";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "./db";

const COOKIE_NAME="mwonet_admin_session";
const SESSION_HOURS=8;

type AdminSession={email:string;role:"super_admin";exp:number};

function secret(){return process.env.MWONET_ADMIN_SESSION_SECRET||""}
function credentials(){return {email:(process.env.MWONET_ADMIN_EMAIL||"").trim().toLowerCase(),password:process.env.MWONET_ADMIN_PASSWORD||""}}
export function isAdminConfigured(){const c=credentials();return Boolean(c.email&&c.password&&secret().length>=24)}
function sign(value:string){return createHmac("sha256",secret()).update(value).digest("base64url")}
function encode(session:AdminSession){const payload=Buffer.from(JSON.stringify(session)).toString("base64url");return `${payload}.${sign(payload)}`}
function decode(token?:string):AdminSession|null{if(!token||!secret())return null;const [payload,sig]=token.split(".");if(!payload||!sig)return null;const expected=sign(payload);try{const a=Buffer.from(sig);const b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))return null;const value=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")) as AdminSession;if(!value.email||value.exp<Date.now())return null;return value}catch{return null}}
function safeEqual(a:string,b:string){const aa=Buffer.from(a);const bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb)}

async function persistAdminLogin(email:string){
 try{
  const user=await db.user.upsert({where:{email},update:{status:"ACTIVE",lastLoginAt:new Date()},create:{email,name:"MWONET Super Admin",status:"ACTIVE",lastLoginAt:new Date()}});
  const role=await db.role.upsert({where:{name:"Super Admin"},update:{description:"Full MWONET administrative access."},create:{name:"Super Admin",description:"Full MWONET administrative access."}});
  await db.userRole.upsert({where:{userId_roleId:{userId:user.id,roleId:role.id}},update:{},create:{userId:user.id,roleId:role.id}});
  await db.auditLog.create({data:{actorId:user.id,action:"admin.login",resource:"Session",metadata:{method:"environment-credential"}}});
 }catch{ /* Authentication must not expose database failures. System Health will surface them. */ }
}

export async function authenticateAdmin(email:string,password:string){if(!isAdminConfigured())return {ok:false,error:"Admin access is not configured yet."};const c=credentials();if(!safeEqual(email.trim().toLowerCase(),c.email)||!safeEqual(password,c.password))return {ok:false,error:"Invalid admin email or password."};const session:AdminSession={email:c.email,role:"super_admin",exp:Date.now()+SESSION_HOURS*60*60*1000};const jar=await cookies();jar.set(COOKIE_NAME,encode(session),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:SESSION_HOURS*60*60});await persistAdminLogin(c.email);return {ok:true as const}}
export async function getAdminSession(){const jar=await cookies();return decode(jar.get(COOKIE_NAME)?.value)}
export async function requireAdmin(){const session=await getAdminSession();if(!session)redirect("/admin/login");return session}
export async function clearAdminSession(){const session=await getAdminSession();if(session){try{const user=await db.user.findUnique({where:{email:session.email}});if(user)await db.auditLog.create({data:{actorId:user.id,action:"admin.logout",resource:"Session"}})}catch{}}const jar=await cookies();jar.delete(COOKIE_NAME)}
