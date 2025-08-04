"use client"

import { useState } from "react"
import { Share2, Lock, Eye, Copy, Trash2, Plus, Calendar, User, Shield, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SharedLink {
  id: string
  documentName: string
  recipientEmail: string
  recipientName: string
  shareUrl: string
  expiresAt: string
  accessCount: number
  maxAccess?: number
  passwordProtected: boolean
  permissions: "view" | "download"
  status: "active" | "expired" | "revoked"
  createdAt: string
}

export default function SharePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [shareSettings, setShareSettings] = useState({
    recipientEmail: "",
    recipientName: "",
    expiresIn: "7",
    maxAccess: "",
    password: "",
    permissions: "view",
    requirePassword: false,
    allowDownload: false,
    notifyAccess: true,
  })

  // Mock data
  const availableDocuments = [
    { id: "1", name: "Blood Test Results - Dec 2024", type: "Lab Report" },
    { id: "2", name: "Chest X-Ray", type: "X-Ray" },
    { id: "3", name: "MRI Brain Scan", type: "MRI" },
    { id: "4", name: "Prescription - Antibiotics", type: "Prescription" },
  ]

  const sharedLinks: SharedLink[] = [
    {
      id: "1",
      documentName: "Blood Test Results - Dec 2024",
      recipientEmail: "dr.smith@hospital.com",
      recipientName: "Dr. Sarah Smith",
      shareUrl: "https://mymedivault.com/shared/abc123",
      expiresAt: "2024-12-22",
      accessCount: 3,
      maxAccess: 5,
      passwordProtected: true,
      permissions: "view",
      status: "active",
      createdAt: "2024-12-15",
    },
    {
      id: "2",
      documentName: "Chest X-Ray",
      recipientEmail: "nurse.johnson@clinic.com",
      recipientName: "Nurse Johnson",
      shareUrl: "https://mymedivault.com/shared/def456",
      expiresAt: "2024-12-20",
      accessCount: 1,
      passwordProtected: false,
      permissions: "download",
      status: "active",
      createdAt: "2024-12-13",
    },
    {
      id: "3",
      documentName: "MRI Brain Scan",
      recipientEmail: "specialist@neurology.com",
      recipientName: "Dr. Michael Chen",
      shareUrl: "https://mymedivault.com/shared/ghi789",
      expiresAt: "2024-12-18",
      accessCount: 0,
      passwordProtected: true,
      permissions: "view",
      status: "expired",
      createdAt: "2024-12-11",
    },
  ]

  const handleCreateShare = () => {
    console.log("Creating share with settings:", shareSettings)
    console.log("Selected documents:", selectedDocuments)
    setIsCreateDialogOpen(false)
    // Reset form
    setShareSettings({
      recipientEmail: "",
      recipientName: "",
      expiresIn: "7",
      maxAccess: "",
      password: "",
      permissions: "view",
      requirePassword: false,
      allowDownload: false,
      notifyAccess: true,
    })
    setSelectedDocuments([])
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // Show toast notification
  }

  const revokeShare = (id: string) => {
    console.log("Revoking share:", id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "revoked":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Share Records</h1>
              <p className="text-gray-600">Securely share medical documents with healthcare providers</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Share Link
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Share Medical Records</DialogTitle>
                  <DialogDescription>
                    Create a secure link to share selected documents with healthcare providers
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Document Selection */}
                  <div className="space-y-3">
                    <Label>Select Documents to Share</Label>
                    <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                      {availableDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-3 py-2">
                          <input
                            type="checkbox"
                            id={doc.id}
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDocuments([...selectedDocuments, doc.id])
                              } else {
                                setSelectedDocuments(selectedDocuments.filter((id) => id !== doc.id))
                              }
                            }}
                            className="rounded"
                          />
                          <label htmlFor={doc.id} className="flex-1 cursor-pointer">
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.type}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <Input
                        id="recipientName"
                        placeholder="Dr. Sarah Smith"
                        value={shareSettings.recipientName}
                        onChange={(e) => setShareSettings({ ...shareSettings, recipientName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail">Recipient Email</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={shareSettings.recipientEmail}
                        onChange={(e) => setShareSettings({ ...shareSettings, recipientEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Access Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Access Settings</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Link Expires In</Label>
                        <Select
                          value={shareSettings.expiresIn}
                          onValueChange={(value) => setShareSettings({ ...shareSettings, expiresIn: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">1 week</SelectItem>
                            <SelectItem value="14">2 weeks</SelectItem>
                            <SelectItem value="30">1 month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxAccess">Max Access Count (Optional)</Label>
                        <Input
                          id="maxAccess"
                          type="number"
                          placeholder="Unlimited"
                          value={shareSettings.maxAccess}
                          onChange={(e) => setShareSettings({ ...shareSettings, maxAccess: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Password Protection</Label>
                          <p className="text-sm text-gray-500">Require password to access documents</p>
                        </div>
                        <Switch
                          checked={shareSettings.requirePassword}
                          onCheckedChange={(checked) =>
                            setShareSettings({ ...shareSettings, requirePassword: checked })
                          }
                        />
                      </div>

                      {shareSettings.requirePassword && (
                        <Input
                          placeholder="Enter password"
                          type="password"
                          value={shareSettings.password}
                          onChange={(e) => setShareSettings({ ...shareSettings, password: e.target.value })}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Download</Label>
                        <p className="text-sm text-gray-500">Allow recipient to download documents</p>
                      </div>
                      <Switch
                        checked={shareSettings.allowDownload}
                        onCheckedChange={(checked) => setShareSettings({ ...shareSettings, allowDownload: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Access Notifications</Label>
                        <p className="text-sm text-gray-500">Notify me when documents are accessed</p>
                      </div>
                      <Switch
                        checked={shareSettings.notifyAccess}
                        onCheckedChange={(checked) => setShareSettings({ ...shareSettings, notifyAccess: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateShare}
                      disabled={selectedDocuments.length === 0 || !shareSettings.recipientEmail}
                    >
                      Create Share Link
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Shares</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="all">All Shares</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {sharedLinks
              .filter((link) => link.status === "active")
              .map((link) => (
                <Card key={link.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{link.documentName}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {link.recipientName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Expires {link.expiresAt}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(link.status)}>{link.status}</Badge>
                        {link.passwordProtected && (
                          <Badge variant="outline">
                            <Lock className="w-3 h-3 mr-1" />
                            Protected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Share URL */}
                      <div className="flex items-center space-x-2">
                        <Input value={link.shareUrl} readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.shareUrl)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Access Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {link.accessCount} {link.maxAccess ? `/ ${link.maxAccess}` : ""} views
                          </span>
                          <span className="flex items-center">
                            <Shield className="w-4 h-4 mr-1" />
                            {link.permissions === "view" ? "View only" : "View & Download"}
                          </span>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => revokeShare(link.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            {sharedLinks
              .filter((link) => link.status === "expired")
              .map((link) => (
                <Card key={link.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{link.documentName}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {link.recipientName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Expired {link.expiresAt}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(link.status)}>{link.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {link.accessCount} total views
                      </span>
                      <Button variant="outline" size="sm">
                        Renew Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {sharedLinks.map((link) => (
              <Card key={link.id} className={link.status !== "active" ? "opacity-75" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{link.documentName}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {link.recipientName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {link.status === "expired" ? "Expired" : "Expires"} {link.expiresAt}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(link.status)}>{link.status}</Badge>
                      {link.passwordProtected && (
                        <Badge variant="outline">
                          <Lock className="w-3 h-3 mr-1" />
                          Protected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {link.accessCount} {link.maxAccess ? `/ ${link.maxAccess}` : ""} views
                    </span>
                    {link.status === "active" ? (
                      <Button variant="destructive" size="sm" onClick={() => revokeShare(link.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Revoke
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        Renew Share
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {sharedLinks.length === 0 && (
          <div className="text-center py-12">
            <Share2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shared documents</h3>
            <p className="text-gray-500 mb-4">
              Create secure share links to provide healthcare providers access to your medical records
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Share Link
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
