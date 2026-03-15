"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getLogs, getVisitors } from "@/app/lib/db"
import { Users, UserCheck, CalendarDays, TrendingUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, today: 0, activeVisitors: 0 })
  const [chartData, setChartData] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const logs = getLogs()
    const today = new Date().toISOString().split('T')[0]
    
    const todayLogs = logs.filter(l => l.timestamp.startsWith(today))
    
    setStats({
      total: logs.length,
      today: todayLogs.length,
      activeVisitors: todayLogs.length // simplified for demo
    })

    // Process chart data for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const count = logs.filter(l => l.timestamp.startsWith(dateStr)).length
      return { 
        name: d.toLocaleDateString('en-US', { weekday: 'short' }), 
        count,
        date: dateStr 
      }
    }).reverse()

    setChartData(last7Days)
  }, [])

  const handleGenerateReport = () => {
    toast({
      title: "Generating PDF Report",
      description: "Statistics report is being compiled. Your download will start shortly."
    })
    
    setTimeout(() => {
      toast({
        title: "Report Downloaded",
        description: "NEU_Library_Stats_Report.pdf successfully saved."
      })
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-secondary/30">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Library Dashboard</h1>
            <p className="text-muted-foreground">Monitor visitor statistics and terminal performance</p>
          </div>
          <Button onClick={handleGenerateReport} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" /> Generate Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
              <Users className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Visits Today</CardTitle>
              <UserCheck className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">+5 since last hour</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Peak Duration</CardTitle>
              <CalendarDays className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 PM - 4 PM</div>
              <p className="text-xs text-muted-foreground">Based on weekly average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm p-6 col-span-1 lg:col-span-2">
            <CardHeader className="px-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline">Visitor Trends</CardTitle>
                  <CardDescription>Number of visitors over the past 7 days</CardDescription>
                </div>
                <TrendingUp className="text-accent w-6 h-6" />
              </div>
            </CardHeader>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? "hsl(var(--accent))" : "hsl(var(--primary))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
