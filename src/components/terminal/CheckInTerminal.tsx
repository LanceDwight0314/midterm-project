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
import { Scan, Mail, CheckCircle2, ArrowLeft, Lightbulb } from "lucide-react"
import { suggestLibraryResources, type SuggestLibraryResourcesOutput } from "@/ai/flows/suggest-library-resources"

const PURPOSES = [
  "reading books",
  "research for thesis",
  "use of computer",
  "doing assignments"
]

export function CheckInTerminal() {
  const [step, setStep] = useState<"auth" | "purpose" | "success">("auth")
  const [idInput, setIdInput] = useState("")
  const [currentVisitor, setCurrentVisitor] = useState<Visitor | null>(null)
  const [purpose, setPurpose] = useState(PURPOSES[0])
  const [aiSuggestions, setAiSuggestions] = useState<SuggestLibraryResourcesOutput | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  
  const { toast } = useToast()

  const handleAuth = (e?: React.FormEvent) => {
    e?.preventDefault()
    const visitor = findVisitor(idInput)
    
    if (!visitor) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid ID or Institutional Email. Please contact the librarian."
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
    
    // Fetch AI Suggestions in the background
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
    setStep("auth")
    setIdInput("")
    setCurrentVisitor(null)
    setPurpose(PURPOSES[0])
    setAiSuggestions(null)
  }

  return (
    <div className="max-w-xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {step === "auth" && (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Scan className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-primary">NEU Library Guard</CardTitle>
            <CardDescription className="text-lg">Please tap your RFID card or enter your institutional email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idInput" className="text-sm font-medium text-muted-foreground">School ID or Google Email</Label>
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
                Authenticate Access
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-xs text-muted-foreground">
            System monitored by NEU Information Services
          </CardFooter>
        </Card>
      )}

      {step === "purpose" && currentVisitor && (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Purpose of Visit</CardTitle>
            <CardDescription>Welcome back, <span className="font-bold text-primary">{currentVisitor.name}</span> ({currentVisitor.college})</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={purpose} onValueChange={setPurpose} className="grid gap-4">
              {PURPOSES.map((p) => (
                <div key={p} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                  <RadioGroupItem value={p} id={p} />
                  <Label htmlFor={p} className="flex-1 capitalize font-medium cursor-pointer">{p}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("auth")} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={handleCheckIn} className="flex-[2] bg-primary">
              Confirm Check-in
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "success" && currentVisitor && (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="h-2 bg-accent w-full" />
          <CardHeader className="text-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
            <CardTitle className="text-4xl font-headline font-bold text-primary">Welcome to NEU Library!</CardTitle>
            <CardDescription className="text-xl mt-2">
              Check-in successful for <span className="text-foreground font-bold">{currentVisitor.name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="bg-secondary/30 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Lightbulb className="w-5 h-5" />
                  <span>AI Librarian Suggestions</span>
                </div>
                {loadingSuggestions ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                ) : aiSuggestions ? (
                  <ul className="space-y-3">
                    {aiSuggestions.suggestions.map((s, i) => (
                      <li key={i} className="text-sm">
                        <strong className="block text-primary">{s.name}</strong>
                        <span className="text-muted-foreground">{s.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Preparing resources for your {purpose}...</p>
                )}
             </div>
          </CardContent>
          <CardFooter>
            <Button onClick={reset} className="w-full bg-primary h-12 text-lg">
              Next Visitor
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
