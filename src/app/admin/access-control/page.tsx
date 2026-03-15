"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getVisitors, updateVisitorStatus, type Visitor } from "@/app/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShieldX, ShieldCheck, UserMinus, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AccessControlPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setVisitors(getVisitors())
  }, [])

  const toggleStatus = (id: string, currentStatus: boolean) => {
    updateVisitorStatus(id, !currentStatus)
    setVisitors(getVisitors())
    toast({
      title: !currentStatus ? "Access Blocked" : "Access Restored",
      description: `Visitor ${id} access has been updated successfully.`,
      variant: !currentStatus ? "destructive" : "default"
    })
  }

  const filtered = visitors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-secondary/30">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold text-primary">Access Control</h1>
          <p className="text-muted-foreground">Manage library entry permissions and block specific individuals</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline">Visitor Directory</CardTitle>
                <CardDescription>Grant or revoke terminal authentication permissions</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Find visitor by ID or Name..." 
                  className="pl-8 bg-secondary/50 border-none" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead>Visitor ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Department/College</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono text-xs">{v.id}</TableCell>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.college}</TableCell>
                    <TableCell className="text-right">
                      {v.isBlocked ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => toggleStatus(v.id, v.isBlocked)}
                        >
                          <UserPlus className="w-4 h-4 mr-1" /> Unblock
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => toggleStatus(v.id, v.isBlocked)}
                        >
                          <UserMinus className="w-4 h-4 mr-1" /> Block
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
