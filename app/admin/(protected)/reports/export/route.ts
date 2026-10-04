import {NextResponse} from "next/server";
import {db} from "../../../_lib/db";
import {getAdminSession} from "../../../_lib/auth";
import {requirePermission} from "../../../_lib/access";

function csv(value:unknown){const s=String(value??"").replaceAll('"','""');return '"'+s+'"'}
export async function GET(){
 const session=await getAdminSession();if(!session)return new NextResponse("Unauthorized",{status:401});
 await requirePermission(session.email,"view_reports");
 const [members,projects,finance]=await Promise.all([
  db.memberProfile.findMany({include:{user:true}}),
  db.project.findMany({include:{program:true}}),
  db.financeTransaction.findMany({include:{member:{include:{user:true}}}})
 ]);
 const lines=["SECTION,NAME,STATUS,DETAIL,AMOUNT"];
 for(const m of members)lines.push(["MEMBER",m.user.name||m.user.email,m.status,m.memberNumber||"",m.monthlyFee?.toString()||""].map(csv).join(","));
 for(const p of projects)lines.push(["PROJECT",p.title,p.status,p.program?.title||p.location||"",""].map(csv).join(","));
 for(const f of finance)lines.push(["FINANCE",f.member?.user.name||f.type,f.status,f.reference||f.note||"",f.amount.toString()].map(csv).join(","));
 return new NextResponse(lines.join("\n"),{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":"attachment; filename=mwonet-report.csv"}});
}
