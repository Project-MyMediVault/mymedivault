"use client"

import { useState } from "react"
import { Eye, Download, Share2, Clock, User, MapPin, Smartphone, Monitor, AlertTriangle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AccessLog {
  id: string
  documentName: string
  action: "view" | "download" | "share"
  accessorName: string
  accessorEmail: string
  ipAddress: string
  location: string
  device: string
  timestamp: string
  duration?: string
  shareLink?: string
  suspicious: boolean
}

export default function AccessLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterTimeframe, setFilterTimeframe] = useState("7")

  // Mock data
  const accessLogs: AccessLog[] = [
    {
      id: "1",
      documentName: "Blood Test Results - Dec 2024",
      action: "view",
      accessorName: "Dr. Sarah Smith",
      accessorEmail: "dr.smith@hospital.com",
      ipAddress: "192.168.1.100",
      location: "New York, NY",
      device: "Desktop - Chrome",
      timestamp: "2024-12-15T14:30:00Z",
      duration: "5 minutes",
      shareLink: "abc123",
      suspicious: false,
    },
    {
      id: "2",
      documentName: "Chest X-Ray",
      action: "download",
      accessorName: "Nurse Johnson",
      accessorEmail: "nurse.johnson@clinic.com",
      ipAddress: "10.0.0.50",
      location: "Boston, MA",
      device: "Mobile - Safari",
      timestamp: "2024-12-14T09:15:00Z",
      shareLink: "def456",
      suspicious: false,
    },
    {
      id: "3",
      documentName: "MRI Brain Scan",
      action: "view",
      accessorName: "Unknown User",
      accessorEmail: "unknown@suspicious.com",
      ipAddress: "203.0.113.1",
      location: "Unknown Location",
      device: "Desktop - Firefox",
      timestamp: "2024-12-13T23:45:00Z",
      duration: "1 minute",
      suspicious: true,
    },
    {
      id: "4",
      documentName: "Prescription - Antibiotics",
      action: "view",
      accessorName: "Dr. Michael Chen",
      accessorEmail: "specialist@neurology.com",
      ipAddress: "172.16.0.10",
      location: "San Francisco, CA",
      device: "Tablet - Chrome",
      timestamp: "2024-12-12T16:20:00Z",
      duration: "3 minutes",
      shareLink: "ghi789",
      suspicious: false,
    },
    {
      id: "5",
      documentName: "Blood Test Results - Dec 2024",
      action: "share",
      accessorName: "You",
      accessorEmail: "john.doe@email.com",
      ipAddress: "192.168.1.50",
      location: "New York, NY",
      device: "Desktop - Chrome",
      timestamp: "2024-12-11T10:00:00Z",
      suspicious: false,
    },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case "view":
        return Eye
      case "download":
        return Download
      case "share":
        return Share2
      default:
        return Eye
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "view":
        return "bg-blue-100 text-blue-800"
      case "download":
        return "bg-green-100 text-green-800"
      case "share":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeviceIcon = (device: string) => {
    return device.toLowerCase().includes("mobile") || device.toLowerCase().includes("tablet") ? Smartphone : Monitor
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    }
  }

  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      log.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.accessorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.accessorEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = filterAction === "all" || log.action === filterAction

    // Filter by timeframe
    const logDate = new Date(log.timestamp)
    const now = new Date()
    const daysAgo = Number.parseInt(filterTimeframe)
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const matchesTimeframe = logDate >= cutoffDate

    return matchesSearch && matchesAction && matchesTimeframe
  })

  const suspiciousLogs = accessLogs.filter((log) => log.suspicious)
  const recentLogs = accessLogs.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Access Logs</h1>
              <p className="text-gray-600">Monitor who accessed your medical records and when</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <Eye className="w-4 h-4 mr-1" />
                {filteredLogs.length} total accesses
              </Badge>
              {suspiciousLogs.length > 0 && (
                <Badge variant="destructive" className="text-sm">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {suspiciousLogs.length} suspicious
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-2xl">{accessLogs.filter((log) => log.action === "view").length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Downloads</CardDescription>
              <CardTitle className="text-2xl">{accessLogs.filter((log) => log.action === "download").length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Shares Created</CardDescription>
              <CardTitle className="text-2xl">{accessLogs.filter((log) => log.action === "share").length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Suspicious Activity</CardDescription>
              <CardTitle className="text-2xl text-red-600">{suspiciousLogs.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-500">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by document, user, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="view">Views</SelectItem>
                  <SelectItem value="download">Downloads</SelectItem>
                  <SelectItem value="share">Shares</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Access Logs */}
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action)
                const DeviceIcon = getDeviceIcon(log.device)
                const { date, time } = formatTimestamp(log.timestamp)

                return (
                  <Card key={log.id} className={log.suspicious ? "border-red-200 bg-red-50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              log.suspicious ? "bg-red-100" : "bg-gray-100"
                            }`}
                          >
                            <ActionIcon className={`w-5 h-5 ${log.suspicious ? "text-red-600" : "text-gray-600"}`} />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{log.documentName}</h4>
                              <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                              {log.suspicious && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Suspicious
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                <div>
                                  <div className="font-medium">{log.accessorName}</div>
                                  <div className="text-xs">{log.accessorEmail}</div>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <div>
                                  <div>{date}</div>
                                  <div className="text-xs">{time}</div>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <DeviceIcon className="w-4 h-4 mr-1" />
                                <div>
                                  <div>{log.device}</div>
                                  <div className="text-xs">{log.ipAddress}</div>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <div>
                                  <div>{log.location}</div>
                                  {log.duration && <div className="text-xs">Duration: {log.duration}</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {recentLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action)
              const { date, time } = formatTimestamp(log.timestamp)

              return (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ActionIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{log.documentName}</h4>
                          <p className="text-sm text-gray-600">
                            {log.action} by {log.accessorName} • {date} at {time}
                          </p>
                        </div>
                      </div>
                      <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="suspicious" className="space-y-4">
            {suspiciousLogs.length > 0 ? (
              suspiciousLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action)
                const { date, time } = formatTimestamp(log.timestamp)

                return (
                  <Card key={log.id} className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <ActionIcon className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{log.documentName}</h4>
                              <Badge variant="destructive">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Suspicious
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                Accessed by: {log.accessorName} ({log.accessorEmail})
                              </p>
                              <p>
                                From: {log.ipAddress} - {log.location}
                              </p>
                              <p>Device: {log.device}</p>
                              <p>
                                Time: {date} at {time}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Investigate
                          </Button>
                          <Button variant="destructive" size="sm">
                            Block Access
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No suspicious activity</h3>
                <p className="text-gray-500">All access to your medical records appears normal and authorized</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No access logs found</h3>
            <p className="text-gray-500">
              No activity matches your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
