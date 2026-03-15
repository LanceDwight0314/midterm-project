"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, ArrowLeft, GraduationCap, IdCard, ShieldCheck } from "lucide-react"
import { addVisitor } from "@/app/lib/db"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const COLLEGES = [
  "College of Computing",
  "College of Nursing",
  "College of Engineering",
  "College of Arts and Sciences",
  "College of Business Administration",
  "College of Education",
  "Faculty of Arts",
  "College of Information and Computer Studies",
  "Graduate School",
  "Business Office/Staff"
]

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    college: ""
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.id || !formData.name || !formData.college) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill out all fields to register."
      })
      return
    }

    setLoading(true)
    try {
      addVisitor({
        id: formData.id,
        name: formData.name,
        college: formData.college,
        isBlocked: false
      })
      
      toast({
        title: "Registration Successful",
        description: "You can now check in using your ID at the terminal.",
      })
      
      router.push("/")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred during registration."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden bg-grid-slate">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-[100px] pointer-events-none" />
      
      <div className="mb-8 flex flex-col items-center text-center gap-2">
        <Link href="/" className="mb-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </Link>
        <h1 className="text-3xl font-headline font-bold text-foreground">Visitor Registration</h1>
        <p className="text-muted-foreground max-w-xs">Link your student or faculty ID to the digital library tracking system</p>
      </div>

      <Card className="w-full max-w-lg border-none shadow-2xl bg-white/90 backdrop-blur-xl ring-1 ring-border/50">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Institutional Enrollment</CardTitle>
          <CardDescription>Use your officially issued school credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="id">Institutional ID / Email</Label>
              <div className="relative">
                <Input 
                  id="id" 
                  placeholder="e.g. 2023-0001 or juan.dc@neu.edu.ph"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="pl-10 h-11 bg-secondary/30 border-none focus-visible:ring-1"
                />
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name (Legal)</Label>
              <Input 
                id="name" 
                placeholder="Juan S. Dela Cruz"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 bg-secondary/30 border-none focus-visible:ring-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">Department / College</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, college: value })}>
                <SelectTrigger className="w-full h-11 bg-secondary/30 border-none focus-visible:ring-1">
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent>
                  {COLLEGES.map((college) => (
                    <SelectItem key={college} value={college}>
                      {college}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-md font-bold mt-6 shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? "Processing..." : "Register Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 py-5">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return to Terminal
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
