"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLogs, getVisitors, findVisitor } from "@/app/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Clock, MapPin, UserCircle } from "lucide-react"

export default function VisitorsLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const rawLogs = getLogs()
    const enrichedLogs = rawLogs.map(log => {
      const visitor = findVisitor(log.visitorId)
      return { ...log, visitor }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    setLogs(enrichedLogs)
  }, [])

  const filteredLogs = logs.filter(log => 
    log.visitor?.name.toLowerCase().includes(search.toLowerCase()) ||
    log.visitor?.id.toLowerCase().includes(search.toLowerCase()) ||
    log.purpose.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-secondary/30">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold text-primary">Visitor Logs</h1>
          <p className="text-muted-foreground">Historical record of all library entries</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-headline">Recent Entries</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search logs..." 
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
                  <TableHead className="w-[200px]">Visitor</TableHead>
                  <TableHead>College / Office</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-secondary/10">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <UserCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold">{log.visitor?.name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{log.visitorId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{log.visitor?.college}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs font-normal">
                        {log.purpose}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {log.visitor?.isBlocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Allowed</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredLogs.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                No visitor logs found matching your search.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
