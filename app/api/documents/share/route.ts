import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Mock database for share links
const shareLinks: any[] = []

export async function POST(request: NextRequest) {
  try {
    const {
      documentIds,
      recipientEmail,
      recipientName,
      expiresIn,
      maxAccess,
      password,
      permissions,
      requirePassword,
      allowDownload,
      notifyAccess,
    } = await request.json()

    // Validate input
    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return NextResponse.json({ error: "No documents selected" }, { status: 400 })
    }

    if (!recipientEmail) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

    // Generate secure share token
    const shareToken = crypto.randomBytes(32).toString("hex")
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareToken}`

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + Number.parseInt(expiresIn))

    // Hash password if provided
    let hashedPassword = null
    if (requirePassword && password) {
      hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    }

    // Create share link record
    const shareLink = {
      id: crypto.randomUUID(),
      shareToken,
      shareUrl,
      documentIds,
      recipientEmail,
      recipientName,
      expiresAt: expiresAt.toISOString(),
      maxAccess: maxAccess ? Number.parseInt(maxAccess) : null,
      password: hashedPassword,
      permissions,
      requirePassword,
      allowDownload,
      notifyAccess,
      accessCount: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      userId: "user-id", // Get from JWT token
    }

    shareLinks.push(shareLink)

    // In production, send email notification to recipient
    if (notifyAccess) {
      // Send email with share link
      console.log(`Sending share notification to ${recipientEmail}`)
    }

    return NextResponse.json({
      success: true,
      shareLink: {
        id: shareLink.id,
        shareUrl: shareLink.shareUrl,
        expiresAt: shareLink.expiresAt,
        recipientEmail: shareLink.recipientEmail,
        recipientName: shareLink.recipientName,
      },
    })
  } catch (error) {
    console.error("Share creation error:", error)
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user's share links
    const userShareLinks = shareLinks.map((link) => ({
      id: link.id,
      shareUrl: link.shareUrl,
      documentIds: link.documentIds,
      recipientEmail: link.recipientEmail,
      recipientName: link.recipientName,
      expiresAt: link.expiresAt,
      accessCount: link.accessCount,
      maxAccess: link.maxAccess,
      status: link.status,
      permissions: link.permissions,
      requirePassword: link.requirePassword,
      createdAt: link.createdAt,
    }))

    return NextResponse.json({
      success: true,
      shareLinks: userShareLinks,
    })
  } catch (error) {
    console.error("Get share links error:", error)
    return NextResponse.json({ error: "Failed to fetch share links" }, { status: 500 })
  }
}
