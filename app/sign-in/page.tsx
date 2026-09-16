import Link from "next/link";
import {getCurrentMember} from "../_lib/member-auth";
import {redirect} from "next/navigation";
import {memberSignInAction} from "./actions";

export const metadata={title:"Member Sign In",description:"Secure sign in for MWONET members and applicants."};

export default async function SignIn({searchParams}:{searchParams:Promise<{error?:string;next?:string;signedOut?:string}>}){
 const current=await getCurrentMember();if(current)redirect("/portal");
 const {error,next,signedOut}=await searchParams;
 return <section className="auth-page member-auth-page"><div className="auth-visual"><div><p className="eyebrow light">MWONET COMMUNITY</p><h1>Your membership, participation and impact in one place.</h1><p>Sign in to access your profile, membership status, opportunities, announcements and secure account tools.</p><div className="auth-facts"><span><b>Secure access</b>Signed HTTP-only session</span><span><b>Member status</b>Pending, active or reviewed by administrators</span><span><b>Privacy</b>Your password is stored as a one-way cryptographic hash.</span></div></div></div><div className="auth-panel"><div className="auth-box"><p className="eyebrow">MEMBER ACCESS</p><h2>Welcome back</h2><p className="auth-note">Use the email and password you created during registration. Administrators can see your membership record but cannot see your password.</p>{signedOut&&<div className="auth-success">You have signed out successfully.</div>}{error&&<div className="auth-error">{error}</div>}<form action={memberSignInAction}><input type="hidden" name="next" value={next||"/portal"}/><label>Email<input name="email" type="email" autoComplete="email" required placeholder="name@example.com"/></label><label>Password<input name="password" type="password" autoComplete="current-password" required placeholder="Your password"/></label><button className="button primary full" type="submit">Sign in securely</button></form><div className="auth-help"><p>New to MWONET? <Link href="/register">Create a member account</Link></p><p className="auth-small">Forgot your password? Until outbound email is activated, contact <a href="mailto:info@mwonet.org">info@mwonet.org</a> for an administrator-assisted reset.</p></div></div></div></section>
}
