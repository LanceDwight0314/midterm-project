"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShieldCheck, Mail, Lock, User, ShieldAlert } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { findVisitor } from "@/app/lib/db"

interface UnifiedLoginProps {
  onLoginSuccess: (role: "student" | "admin", email: string) => void
}

export function UnifiedLogin({ onLoginSuccess }: UnifiedLoginProps) {
  const [role, setRole] = useState<"student" | "admin">("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your institutional email.",
      })
      setLoading(false)
      return
    }

    if (role === "student") {
      const visitor = findVisitor(email)
      if (!visitor) {
        toast({
          variant: "destructive",
          title: "Account Not Found",
          description: "This email is not registered. Please register first.",
        })
        setLoading(false)
        return
      }
      if (visitor.isBlocked) {
        toast({
          variant: "destructive",
          title: "Access Restricted",
          description: "Your account has been blocked. Contact the librarian.",
        })
        setLoading(false)
        return
      }
      onLoginSuccess("student", email)
    } else {
      // Admin Logic
      if (password === "123") {
        onLoginSuccess("admin", email)
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Credentials",
          description: "Incorrect admin security password.",
        })
      }
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-xl ring-1 ring-border/50">
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-2 shadow-lg shadow-primary/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <CardTitle className="text-2xl font-headline font-bold">Institutional Access</CardTitle>
        <CardDescription>Select your role and enter credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <RadioGroup 
            value={role} 
            onValueChange={(v) => setRole(v as "student" | "admin")}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="student" id="student" className="peer sr-only" />
              <Label
                htmlFor="student"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <User className="mb-2 h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-tight">Student</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
              <Label
                htmlFor="admin"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <ShieldAlert className="mb-2 h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-tight">Admin</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Institutional Email</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@neu.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-secondary/30 border-none"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {role === "admin" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="password">Security Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-secondary/30 border-none"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? "Verifying..." : `Login as ${role === 'student' ? 'Student' : 'Administrator'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
