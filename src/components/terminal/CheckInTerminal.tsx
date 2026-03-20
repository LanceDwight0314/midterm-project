"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { findVisitor, saveLog, type Visitor } from "@/app/lib/db"
import { useToast } from "@/hooks/use-toast"
import { Scan, Mail, CheckCircle2, ArrowLeft, Lightbulb, UserPlus, LogOut, Home } from "lucide-react"
import { suggestLibraryResources, type SuggestLibraryResourcesOutput } from "@/ai/flows/suggest-library-resources"
import Link from "next/link"

const PURPOSES = [
  "reading books",
  "research for thesis",
  "use of computer",
  "doing assignments"
]

interface CheckInTerminalProps {
  preAuthenticatedVisitor?: Visitor | null;
  onSessionReset?: () => void;
}

export function CheckInTerminal({ preAuthenticatedVisitor, onSessionReset }: CheckInTerminalProps) {
  const [step, setStep] = useState<"auth" | "purpose" | "success">("auth")
  const [idInput, setIdInput] = useState("")
  const [currentVisitor, setCurrentVisitor] = useState<Visitor | null>(null)
  const [purpose, setPurpose] = useState(PURPOSES[0])
  const [aiSuggestions, setAiSuggestions] = useState<SuggestLibraryResourcesOutput | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    if (preAuthenticatedVisitor) {
      setCurrentVisitor(preAuthenticatedVisitor)
      setStep("purpose")
    }
  }, [preAuthenticatedVisitor])

  const handleAuth = (e?: React.FormEvent) => {
    e?.preventDefault()
    const visitor = findVisitor(idInput)
    
    if (!visitor) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid ID or Institutional Email. If you are new, please register first."
      })
      return
    }

    if (visitor.isBlocked) {
      toast({
        variant: "destructive",
        title: "Account Blocked",
        description: "Your access has been suspended. Please see the library administrator."
      })
      return
    }

    setCurrentVisitor(visitor)
    setStep("purpose")
  }

  const handleCheckIn = async () => {
    if (!currentVisitor) return

    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      visitorId: currentVisitor.id,
      timestamp: new Date().toISOString(),
      purpose
    }

    saveLog(newLog)
    setStep("success")
    
    setLoadingSuggestions(true)
    try {
      const suggestions = await suggestLibraryResources({ purposeOfVisit: purpose })
      setAiSuggestions(suggestions)
    } catch (error) {
      console.error("AI Error:", error)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const reset = () => {
    if (preAuthenticatedVisitor) {
      setStep("purpose")
      setAiSuggestions(null)
    } else {
      setStep("auth")
      setIdInput("")
      setCurrentVisitor(null)
      setPurpose(PURPOSES[0])
      setAiSuggestions(null)
    }
  }

  return (
    <div className="max-w-xl w-full p-4">
      {step === "auth" && !preAuthenticatedVisitor && (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Scan className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-primary">Quick Terminal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idInput" className="text-sm font-medium text-muted-foreground">Institutional ID or Email</Label>
                <div className="relative">
                  <Input 
                    id="idInput"
                    placeholder="e.g. 2023-XXXX or user@neu.edu.ph" 
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                    className="h-12 pl-10 text-lg"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-bold bg-accent hover:bg-accent/90">
                Check In Now
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <Link href="/register" className="w-full">
                <Button variant="outline" className="w-full gap-2 text-primary border-primary/20 hover:bg-primary/5">
                  <UserPlus className="w-4 h-4" /> Register New ID
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "purpose" && currentVisitor && (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm animate-in zoom-in-95">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Purpose of Visit</CardTitle>
            <CardDescription>
              Authenticated: <span className="font-bold text-primary">{currentVisitor.name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={purpose} onValueChange={setPurpose} className="grid gap-4">
              {PURPOSES.map((p) => (
                <div key={p} className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value={p} id={p} />
                  <Label htmlFor={p} className="flex-1 capitalize font-medium cursor-pointer text-base">{p}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex gap-3">
            {!preAuthenticatedVisitor && (
              <Button variant="outline" onClick={() => setStep("auth")} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            )}
            <Button onClick={handleCheckIn} className="flex-[2] bg-primary h-12 text-lg font-bold">
              Confirm Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "success" && currentVisitor && (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden animate-in fade-in">
          <div className="h-2 bg-green-500 w-full" />
          <CardHeader className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl font-headline font-bold text-primary">Entry Confirmed!</CardTitle>
            <CardDescription className="text-lg">
              You have been logged. <span className="text-foreground font-bold">You may continue your visit</span>, {currentVisitor.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="bg-secondary/40 p-5 rounded-2xl space-y-4 border border-secondary">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <span>Personalized Library Suggestions</span>
                </div>
                {loadingSuggestions ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-muted animate-pulse rounded w-full" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                  </div>
                ) : aiSuggestions ? (
                  <ul className="space-y-4">
                    {aiSuggestions.suggestions.map((s, i) => (
                      <li key={i} className="text-sm bg-white/50 p-3 rounded-lg border border-border/20">
                        <strong className="block text-primary text-base mb-1">{s.name}</strong>
                        <span className="text-muted-foreground leading-relaxed">{s.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground animate-pulse">Syncing with digital stacks...</p>
                )}
             </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={reset} className="w-full bg-primary h-12 text-lg font-bold gap-2">
              <CheckCircle2 className="w-5 h-5" /> Complete Visit
            </Button>
            {onSessionReset && (
              <Button variant="outline" onClick={onSessionReset} className="w-full text-muted-foreground gap-2 border-primary/20">
                <Home className="w-4 h-4" /> Return to Front Page
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
