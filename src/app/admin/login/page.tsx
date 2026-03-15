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
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-primary">NEULibraryGuard</h1>
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-headline">Admin Access</CardTitle>
          <CardDescription>Enter the management password to proceed</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Management Password</Label>
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
                  className={error ? "border-destructive ring-destructive" : ""}
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {error && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> Invalid credentials
                </p>
              )}
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">
              Sign In to Dashboard
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to Terminal
          </Link>
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-xs text-muted-foreground">
        Restricted area. Unauthorized access is logged.
      </p>
    </div>
  )
}
