import { CheckInTerminal } from "@/components/terminal/CheckInTerminal"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full -ml-48 -mb-48 blur-3xl" />
      
      <header className="p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-xl text-primary">NEULibraryGuard</span>
        </div>
        <Link 
          href="/admin/login" 
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-white px-4 py-2 rounded-full border shadow-sm"
        >
          Admin Login
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <CheckInTerminal />
      </div>

      <footer className="p-8 text-center text-xs text-muted-foreground z-10">
        © {new Date().getFullYear()} NEU Library Services • Advanced Terminal v1.0.4
      </footer>
    </main>
  )
}
