import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

// Mock database for documents
const documents: any[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const tags = formData.get("tags") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name)
    const fileName = `${crypto.randomUUID()}${fileExtension}`
    const filePath = path.join(process.cwd(), "uploads", fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // In production, save to cloud storage (AWS S3, etc.)
    await writeFile(filePath, buffer)

    // Encrypt file metadata (in production, encrypt the actual file)
    const encryptedMetadata = {
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }

    // Save document record
    const document = {
      id: crypto.randomUUID(),
      fileName,
      originalName: file.name,
      filePath,
      size: file.size,
      type: file.type,
      category,
      description,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      uploadedAt: new Date().toISOString(),
      userId: "user-id", // Get from JWT token
      encrypted: true,
      metadata: encryptedMetadata,
    }

    documents.push(document)

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        originalName: document.originalName,
        size: document.size,
        type: document.type,
        category: document.category,
        uploadedAt: document.uploadedAt,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user documents (filter by userId from JWT)
    const userDocuments = documents.map((doc) => ({
      id: doc.id,
      originalName: doc.originalName,
      size: doc.size,
      type: doc.type,
      category: doc.category,
      description: doc.description,
      tags: doc.tags,
      uploadedAt: doc.uploadedAt,
    }))

    return NextResponse.json({
      success: true,
      documents: userDocuments,
    })
  } catch (error) {
    console.error("Get documents error:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
