"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, ShieldAlert, FileText, ArrowLeft, ShieldCheck, LogOut } from "lucide-react"

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Visitors Log", href: "/admin/visitors", icon: Users },
  { name: "Access Control", href: "/admin/access-control", icon: ShieldAlert },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated")
    router.push("/")
  }

  return (
    <div className="w-64 border-r bg-white h-screen flex flex-col">
      <div className="p-6 border-b flex items-center gap-2">
        <ShieldCheck className="text-primary w-6 h-6" />
        <span className="font-headline font-bold text-lg text-primary">Guard Admin</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-primary")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Exit Terminal
        </Link>
      </div>
    </div>
  )
}
