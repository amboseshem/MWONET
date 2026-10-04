"use server";
import {revalidatePath} from "next/cache";
import {db} from "../../_lib/db";
import {getAdminSession} from "../../_lib/auth";
import {requirePermission} from "../../_lib/access";

function v(fd:FormData,key:string){return String(fd.get(key)||"").trim()}
async function guard(permission:string){const s=await getAdminSession();if(!s)throw new Error("Not signed in");return requirePermission(s.email,permission)}
export async function createFinanceTransaction(fd:FormData){
 const access=await guard("manage_finance");
 const memberId=v(fd,"memberId")||null,type=v(fd,"type"),reference=v(fd,"reference")||null,note=v(fd,"note")||null,amount=Number(v(fd,"amount")),occurred=v(fd,"occurredAt");
 if(!type||!Number.isFinite(amount)||amount<=0)return;
 const row=await db.financeTransaction.create({data:{memberId,type,amount,status:"PENDING",reference,note,occurredAt:occurred?new Date(occurred):new Date()}});
 await db.auditLog.create({data:{actorId:access.user!.id,action:"finance.create",resource:"FinanceTransaction",resourceId:row.id,after:{type,amount,memberId,reference}}});
 revalidatePath("/admin/finance");revalidatePath("/admin/reports");
}
export async function approveFinanceTransaction(fd:FormData){
 const access=await guard("approve_transactions");const id=v(fd,"id");if(!id)return;
 const before=await db.financeTransaction.findUnique({where:{id}});if(!before)return;
 const row=await db.financeTransaction.update({where:{id},data:{status:"APPROVED",approvedBy:access.user!.id}});
 await db.auditLog.create({data:{actorId:access.user!.id,action:"finance.approve",resource:"FinanceTransaction",resourceId:id,before:{status:before.status},after:{status:row.status}}});
 revalidatePath("/admin/finance");revalidatePath("/admin/reports");
}
export async function rejectFinanceTransaction(fd:FormData){
 const access=await guard("approve_transactions");const id=v(fd,"id");if(!id)return;
 const before=await db.financeTransaction.findUnique({where:{id}});if(!before)return;
 const row=await db.financeTransaction.update({where:{id},data:{status:"REJECTED",approvedBy:access.user!.id}});
 await db.auditLog.create({data:{actorId:access.user!.id,action:"finance.reject",resource:"FinanceTransaction",resourceId:id,before:{status:before.status},after:{status:row.status}}});
 revalidatePath("/admin/finance");revalidatePath("/admin/reports");
}
