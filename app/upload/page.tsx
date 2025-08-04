"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Camera, FileText, ImageIcon, Activity, Stethoscope, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface UploadedFile {
  id: string
  file: File
  type: string
  category: string
  description: string
  tags: string[]
  uploadProgress: number
  status: "uploading" | "completed" | "error"
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isScanning, setIsScanning] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: file.type,
      category: "",
      description: "",
      tags: [],
      uploadProgress: 0,
      status: "uploading" as const,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    
    newFiles.forEach((uploadFile) => {
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 100) } : f,
          ),
        )
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed", uploadProgress: 100 } : f)),
        )
      }, 2000)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 50 * 1024 * 1024, 
  })

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFileDetails = (id: string, field: string, value: string) => {
    setUploadedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const handleScan = () => {
    setIsScanning(true)
    
    setTimeout(() => {
      setIsScanning(false)
      
      const scannedFile = new File([""], "scanned-document.pdf", { type: "application/pdf" })
      onDrop([scannedFile])
    }, 3000)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type === "application/pdf") return FileText
    return FileText
  }

  const documentCategories = [
    { value: "lab-report", label: "Lab Report", icon: Activity },
    { value: "xray", label: "X-Ray", icon: ImageIcon },
    { value: "prescription", label: "Prescription", icon: FileText },
    { value: "mri", label: "MRI Scan", icon: ImageIcon },
    { value: "consultation", label: "Consultation Notes", icon: Stethoscope },
    { value: "other", label: "Other", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
          <p className="text-gray-600">Add new medical records to your secure vault</p>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Upload Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Files
              </CardTitle>
              <CardDescription>Drag and drop files or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Drag & drop files here, or click to select</p>
                    <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, JPG, PNG (max 50MB)</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Document Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Document Scanner
              </CardTitle>
              <CardDescription>Use your camera to scan paper documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                {isScanning ? (
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Camera className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-blue-600 mb-2">Scanning document...</p>
                    <Progress value={66} className="w-full" />
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <Button onClick={handleScan} className="w-full">
                      Start Scanning
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">Position document in good lighting</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
              <CardDescription>Add details and categorize your documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {uploadedFiles.map((uploadFile) => {
                  const FileIcon = getFileIcon(uploadFile.type)

                  return (
                    <div key={uploadFile.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{uploadFile.file.name}</h4>
                            <p className="text-sm text-gray-500">
                              {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {uploadFile.status === "uploading" && (
                            <Badge variant="secondary">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Uploading...
                            </Badge>
                          )}
                          {uploadFile.status === "completed" && (
                            <Badge variant="default" className="bg-green-500">
                              <Check className="w-3 h-3 mr-1" />
                              Uploaded
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {uploadFile.status === "uploading" && (
                        <Progress value={uploadFile.uploadProgress} className="mb-4" />
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Document Category</Label>
                          <Select
                            value={uploadFile.category}
                            onValueChange={(value) => updateFileDetails(uploadFile.id, "category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {documentCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center">
                                    <category.icon className="w-4 h-4 mr-2" />
                                    {category.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Add a description for this document..."
                            value={uploadFile.description}
                            onChange={(e) => updateFileDetails(uploadFile.id, "description", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Tags</Label>
                          <Input placeholder="Add tags separated by commas (e.g., blood test, annual checkup)" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <Button variant="outline">Save as Draft</Button>
                <Button>Save All Documents</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
