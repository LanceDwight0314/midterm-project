"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Lock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === "123") {
      sessionStorage.setItem("admin_authenticated", "true")
      toast({
        title: "Access Granted",
        description: "Welcome to the Library Management System.",
      })
      router.push("/admin/dashboard")
    } else {
      setError(true)
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden bg-grid-slate">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="mb-10 flex flex-col items-center gap-3 relative z-10">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-headline font-bold text-foreground">Guard Admin</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Authorized Personnel Only</p>
        </div>
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-xl ring-1 ring-border/50 relative z-10">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-headline">Management Login</CardTitle>
          <CardDescription>Enter security credential to access dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Security Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError(false)
                  }}
                  className={`h-12 pr-10 bg-secondary/30 border-none focus-visible:ring-1 ${error ? "ring-1 ring-destructive" : ""}`}
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {error && (
                <p className="text-xs text-destructive flex items-center gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Invalid management password
                </p>
              )}
            </div>
            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-md font-bold shadow-lg shadow-primary/20">
              Unlock Dashboard
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 py-5">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            Return to Public Terminal
          </Link>
        </CardFooter>
      </Card>
      
      <div className="mt-12 text-center relative z-10">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
          Restricted Security Zone
        </p>
        <p className="text-[9px] text-muted-foreground/60 mt-2 italic">
          Unauthorized access attempts are monitored and logged to system server.
        </p>
      </div>
    </div>
  )
}