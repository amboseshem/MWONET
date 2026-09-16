import {createHash,createHmac,randomBytes,scryptSync,timingSafeEqual} from "node:crypto";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "../admin/_lib/db";

const COOKIE_NAME="mwonet_member_session";
const SESSION_SECONDS=60*60*24*7;

type MemberSession={userId:string;email:string;exp:number};

function secret(){
 const value=process.env.MWONET_ADMIN_SESSION_SECRET;
 if(!value||value.length<24)throw new Error("MWONET session secret is not configured.");
 return value;
}
function sign(payload:string){return createHmac("sha256",secret()).update(`member.${payload}`).digest("base64url")}
function encode(session:MemberSession){const payload=Buffer.from(JSON.stringify(session)).toString("base64url");return `${payload}.${sign(payload)}`}
function decode(token?:string):MemberSession|null{
 if(!token)return null;const [payload,sig]=token.split(".");if(!payload||!sig)return null;
 try{const expected=sign(payload);const a=Buffer.from(sig);const b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))return null;const value=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")) as MemberSession;if(!value.userId||!value.email||value.exp<Math.floor(Date.now()/1000))return null;return value}catch{return null}
}

export function normalizeEmail(value:string){return value.trim().toLowerCase()}
export function normalizePhone(value:string){return value.replace(/\s+/g,"").trim()}

export function hashPassword(password:string){const salt=randomBytes(16).toString("hex");const hash=scryptSync(password,salt,64).toString("hex");return `scrypt$${salt}$${hash}`}
export function verifyPassword(password:string,stored?:string|null){if(!stored)return false;const parts=stored.split("$");if(parts.length!==3||parts[0]!=="scrypt")return false;const [,salt,hash]=parts;try{const actual=scryptSync(password,salt,64);const expected=Buffer.from(hash,"hex");return actual.length===expected.length&&timingSafeEqual(actual,expected)}catch{return false}}
export function passwordProblem(password:string){if(password.length<10)return "Use at least 10 characters.";if(!/[A-Z]/.test(password))return "Add at least one uppercase letter.";if(!/[a-z]/.test(password))return "Add at least one lowercase letter.";if(!/\d/.test(password))return "Add at least one number.";return null}

export function ageFromDob(date:Date){const now=new Date();let age=now.getFullYear()-date.getFullYear();const month=now.getMonth()-date.getMonth();if(month<0||(month===0&&now.getDate()<date.getDate()))age--;return age}
export function accountRef(email:string){return createHash("sha256").update(email).digest("hex").slice(0,10).toUpperCase()}

export async function startMemberSession(userId:string,email:string){const jar=await cookies();const exp=Math.floor(Date.now()/1000)+SESSION_SECONDS;jar.set(COOKIE_NAME,encode({userId,email,exp}),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:SESSION_SECONDS})}
export async function getMemberSession(){const jar=await cookies();return decode(jar.get(COOKIE_NAME)?.value)}
export async function clearMemberSession(){const jar=await cookies();jar.delete(COOKIE_NAME)}

export async function getCurrentMember(){const session=await getMemberSession();if(!session)return null;const user=await db.user.findUnique({where:{id:session.userId},include:{member:true,roles:{include:{role:true}}}});if(!user||user.email!==session.email||user.status!=="ACTIVE")return null;return user}
export async function requireMember(){const user=await getCurrentMember();if(!user)redirect("/sign-in?next=%2Fportal");return user}
