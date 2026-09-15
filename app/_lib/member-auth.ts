import {randomBytes,scryptSync,timingSafeEqual,createHmac} from "crypto";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "../admin/_lib/db";

const COOKIE_NAME="mwonet_member_session";
const SESSION_DAYS=7;

type MemberSession={userId:string;email:string;exp:number};

function secret(){return process.env.MWONET_ADMIN_SESSION_SECRET||""}
function sign(value:string){return createHmac("sha256",secret()).update(value).digest("base64url")}
function encode(session:MemberSession){const payload=Buffer.from(JSON.stringify(session)).toString("base64url");return `${payload}.${sign(payload)}`}
function decode(token?:string):MemberSession|null{if(!token||!secret())return null;const [payload,sig]=token.split(".");if(!payload||!sig)return null;const expected=sign(payload);try{const a=Buffer.from(sig);const b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))return null;const value=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")) as MemberSession;if(!value.userId||value.exp<Date.now())return null;return value}catch{return null}}

export function hashPassword(password:string){const salt=randomBytes(16).toString("hex");const hash=scryptSync(password,salt,64).toString("hex");return `${salt}:${hash}`}
export function verifyPassword(password:string,stored?:string|null){if(!stored)return false;const [salt,hash]=stored.split(":");if(!salt||!hash)return false;const actual=scryptSync(password,salt,64);const expected=Buffer.from(hash,"hex");return actual.length===expected.length&&timingSafeEqual(actual,expected)}

export async function startMemberSession(userId:string,email:string){const jar=await cookies();jar.set(COOKIE_NAME,encode({userId,email,exp:Date.now()+SESSION_DAYS*86400000}),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:SESSION_DAYS*86400})}
export async function getMemberSession(){const jar=await cookies();return decode(jar.get(COOKIE_NAME)?.value)}
export async function requireMember(){const session=await getMemberSession();if(!session)redirect("/sign-in");const user=await db.user.findUnique({where:{id:session.userId},include:{member:true,roles:{include:{role:true}}}});if(!user||user.status!=="ACTIVE")redirect("/sign-in");return user}
export async function clearMemberSession(){const jar=await cookies();jar.delete(COOKIE_NAME)}
