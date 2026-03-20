"use client"

import { useState, useEffect } from "react"
import { CheckInTerminal } from "@/components/terminal/CheckInTerminal"
import { UnifiedLogin } from "@/components/auth/UnifiedLogin"
import { ShieldCheck, LogOut, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { findVisitor, type Visitor } from "@/app/lib/db"

export default function Home() {
  const [authState, setAuthState] = useState<{
    role: "student" | "admin" | null;
    email: string | null;
  }>({ role: null, email: null })
  const [currentVisitor, setCurrentVisitor] = useState<Visitor | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = sessionStorage.getItem("user_role") as "student" | "admin" | null
    const email = sessionStorage.getItem("user_email")
    
    if (role && email) {
      setAuthState({ role, email })
      if (role === "student") {
        setCurrentVisitor(findVisitor(email) || null)
      }
    }
  }, [])

  const handleLoginSuccess = (role: "student" | "admin", email: string) => {
    sessionStorage.setItem("user_role", role)
    sessionStorage.setItem("user_email", email)
    
    if (role === "admin") {
      sessionStorage.setItem("admin_authenticated", "true")
      router.push("/admin/dashboard")
    } else {
      setAuthState({ role, email })
      setCurrentVisitor(findVisitor(email) || null)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user_role")
    sessionStorage.removeItem("user_email")
    sessionStorage.removeItem("admin_authenticated")
    setAuthState({ role: null, email: null })
    setCurrentVisitor(null)
  }

  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-hidden bg-grid-slate">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full -mr-96 -mt-96 blur-[120px] pointer-events-none" />
      
      <header className="p-6 md:p-8 flex justify-between items-center z-20 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-headline font-extrabold text-2xl leading-none tracking-tight text-primary">
              NEU<span className="text-foreground/80">LibraryGuard</span>
            </h1>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/70 mt-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Institutional System
            </span>
          </div>
        </div>
        
        {authState.role && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{authState.role} Session</span>
                <span className="text-[10px] text-muted-foreground font-medium">{authState.email}</span>
             </div>
             <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full gap-2 border-red-100 hover:bg-red-50 hover:text-red-600 text-muted-foreground">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Switch Role</span>
             </Button>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 -mt-12">
        {!authState.role ? (
          <div className="w-full flex flex-col items-center">
            <div className="max-w-2xl w-full text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4 tracking-tight">
                Library Portal Login
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                Connect your institutional account to access research tools and entry terminal.
              </p>
            </div>
            <UnifiedLogin onLoginSuccess={handleLoginSuccess} />
            <p className="mt-8 text-sm text-muted-foreground">
              Don't have an ID registered? <Link href="/register" className="text-primary font-bold hover:underline">Register now</Link>
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-500">
             <div className="text-center mb-8">
               <h2 className="text-3xl font-headline font-bold text-foreground">Welcome to NEU Library</h2>
               <p className="text-muted-foreground mt-2">Active session: <span className="font-bold text-primary">{currentVisitor?.name || authState.email}</span></p>
             </div>
             <CheckInTerminal preAuthenticatedVisitor={currentVisitor} onSessionReset={handleLogout} />
          </div>
        )}
      </div>

      <footer className="p-10 text-center z-10 border-t border-border/20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="h-[1px] flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-border" />
            <span className="text-xs uppercase tracking-[0.4em] font-bold text-muted-foreground/80">
              New Era University
            </span>
            <div className="h-[1px] flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-border" />
          </div>
          <p className="text-[11px] text-muted-foreground/60 font-medium">
            © {new Date().getFullYear()} Library Services & Information Technology Office
          </p>
        </div>
      </footer>
    </main>
  )
}
