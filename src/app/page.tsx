import { CheckInTerminal } from "@/components/terminal/CheckInTerminal"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-hidden bg-grid-slate">
      {/* Decorative gradient orbs for a professional look */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full -mr-96 -mt-96 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full -ml-48 -mb-48 blur-[100px] pointer-events-none" />
      
      <header className="p-6 flex justify-between items-center z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-xl leading-none text-primary">NEULibraryGuard</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-1">Institutional Access Terminal</span>
          </div>
        </div>
        <Link 
          href="/admin/login" 
          className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm hover:shadow-md active:scale-95"
        >
          Admin Portal
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <CheckInTerminal />
      </div>

      <footer className="p-8 text-center z-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-[1px] w-12 bg-border" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">New Era University Library</span>
          <div className="h-[1px] w-12 bg-border" />
        </div>
        <p className="text-[10px] text-muted-foreground/60">
          © {new Date().getFullYear()} Library Services & Information Technology Office • Terminal v1.1.0
        </p>
      </footer>
    </main>
  )
}