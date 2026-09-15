"use server";
import {redirect} from "next/navigation";
import {authenticateAdmin,clearAdminSession} from "../_lib/auth";

export async function adminLogin(formData:FormData){const email=String(formData.get("email")||"");const password=String(formData.get("password")||"");const result=await authenticateAdmin(email,password);if(!result.ok)redirect(`/admin/login?error=${encodeURIComponent(result.error)}`);redirect("/admin")}
export async function adminLogout(){await clearAdminSession();redirect("/admin/login")}
