"use client"

import { useState } from "react"
import {
  Search,
  Grid,
  List,
  Calendar,
  Tag,
  Download,
  Share2,
  Eye,
  MoreHorizontal,
  FileText,
  ImageIcon,
  Activity,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MedicalRecord {
  id: string
  name: string
  category: string
  date: string
  size: string
  tags: string[]
  shared: boolean
  thumbnail?: string
  description: string
}

export default function RecordsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Mock data
  const records: MedicalRecord[] = [
    {
      id: "1",
      name: "Blood Test Results - December 2024",
      category: "lab-report",
      date: "2024-12-15",
      size: "2.4 MB",
      tags: ["blood test", "annual checkup", "cholesterol"],
      shared: false,
      description: "Annual blood work including complete blood count and lipid panel",
    },
    {
      id: "2",
      name: "Chest X-Ray",
      category: "xray",
      date: "2024-12-10",
      size: "8.1 MB",
      tags: ["x-ray", "chest", "respiratory"],
      shared: true,
      description: "Chest X-ray for respiratory symptoms evaluation",
    },
    {
      id: "3",
      name: "Prescription - Antibiotics",
      category: "prescription",
      date: "2024-12-08",
      size: "1.2 MB",
      tags: ["prescription", "antibiotics", "infection"],
      shared: false,
      description: "Antibiotic prescription for bacterial infection treatment",
    },
    {
      id: "4",
      name: "MRI Brain Scan",
      category: "mri",
      date: "2024-12-05",
      size: "15.3 MB",
      tags: ["mri", "brain", "neurological"],
      shared: true,
      description: "Brain MRI scan for headache investigation",
    },
    {
      id: "5",
      name: "Cardiology Consultation",
      category: "consultation",
      date: "2024-12-01",
      size: "0.8 MB",
      tags: ["consultation", "cardiology", "heart"],
      shared: false,
      description: "Cardiology consultation notes and recommendations",
    },
    {
      id: "6",
      name: "Vaccination Record",
      category: "vaccination",
      date: "2024-11-28",
      size: "0.5 MB",
      tags: ["vaccination", "immunization", "flu shot"],
      shared: false,
      description: "Annual flu vaccination record",
    },
  ]

  const categories = [
    { value: "all", label: "All Categories", icon: FileText },
    { value: "lab-report", label: "Lab Reports", icon: Activity },
    { value: "xray", label: "X-Rays", icon: ImageIcon },
    { value: "prescription", label: "Prescriptions", icon: FileText },
    { value: "mri", label: "MRI Scans", icon: ImageIcon },
    { value: "consultation", label: "Consultations", icon: Stethoscope },
    { value: "vaccination", label: "Vaccinations", icon: Activity },
  ]

  const getRecordIcon = (category: string) => {
    const categoryMap: { [key: string]: any } = {
      "lab-report": Activity,
      xray: ImageIcon,
      prescription: FileText,
      mri: ImageIcon,
      consultation: Stethoscope,
      vaccination: Activity,
    }
    return categoryMap[category] || FileText
  }

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      "lab-report": "bg-blue-100 text-blue-800",
      xray: "bg-green-100 text-green-800",
      prescription: "bg-purple-100 text-purple-800",
      mri: "bg-orange-100 text-orange-800",
      consultation: "bg-teal-100 text-teal-800",
      vaccination: "bg-pink-100 text-pink-800",
    }
    return colorMap[category] || "bg-gray-100 text-gray-800"
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === "all" || record.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-gray-600">{filteredRecords.length} documents in your vault</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search records, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center">
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Records Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecords.map((record) => {
              const RecordIcon = getRecordIcon(record.category)

              return (
                <Card key={record.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <RecordIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg leading-tight">{record.name}</CardTitle>
                    <CardDescription className="text-sm">{record.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {record.date}
                        </span>
                        <span>{record.size}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={getCategoryColor(record.category)}>
                          {categories.find((c) => c.value === record.category)?.label}
                        </Badge>
                        {record.shared && (
                          <Badge variant="secondary" className="text-xs">
                            <Share2 className="w-3 h-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                      </div>

                      {record.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {record.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {record.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{record.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredRecords.map((record, index) => {
                  const RecordIcon = getRecordIcon(record.category)

                  return (
                    <div
                      key={record.id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                        index !== filteredRecords.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <RecordIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{record.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {record.date}
                            </span>
                            <span>{record.size}</span>
                            <Badge className={getCategoryColor(record.category)} variant="secondary">
                              {categories.find((c) => c.value === record.category)?.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {record.shared && (
                          <Badge variant="secondary" className="text-xs">
                            <Share2 className="w-3 h-3 mr-1" />
                            Shared
                          </Badge>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-500">
              {searchQuery || filterCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Upload your first medical document to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
