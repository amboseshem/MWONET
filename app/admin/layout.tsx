import "./admin.css";
export const metadata={title:"MWONET Admin",robots:{index:false,follow:false}};
export default function AdminRootLayout({children}:{children:React.ReactNode}){return <div className="admin-root">{children}</div>}
