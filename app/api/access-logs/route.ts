import { type NextRequest, NextResponse } from "next/server"

// Mock database for access logs
const accessLogs: any[] = [
  {
    id: "1",
    documentId: "doc-1",
    documentName: "Blood Test Results - Dec 2024",
    action: "view",
    accessorName: "Dr. Sarah Smith",
    accessorEmail: "dr.smith@hospital.com",
    ipAddress: "192.168.1.100",
    location: "New York, NY",
    device: "Desktop - Chrome",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: new Date("2024-12-15T14:30:00Z").toISOString(),
    duration: 300000, // 5 minutes in milliseconds
    shareToken: "abc123",
    suspicious: false,
    userId: "user-id",
  },
  {
    id: "2",
    documentId: "doc-2",
    documentName: "Chest X-Ray",
    action: "download",
    accessorName: "Nurse Johnson",
    accessorEmail: "nurse.johnson@clinic.com",
    ipAddress: "10.0.0.50",
    location: "Boston, MA",
    device: "Mobile - Safari",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
    timestamp: new Date("2024-12-14T09:15:00Z").toISOString(),
    shareToken: "def456",
    suspicious: false,
    userId: "user-id",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const timeframe = searchParams.get("timeframe")
    const suspicious = searchParams.get("suspicious")

    let filteredLogs = [...accessLogs]

    // Filter by action
    if (action && action !== "all") {
      filteredLogs = filteredLogs.filter((log) => log.action === action)
    }

    // Filter by timeframe
    if (timeframe) {
      const days = Number.parseInt(timeframe)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= cutoffDate)
    }

    // Filter by suspicious activity
    if (suspicious === "true") {
      filteredLogs = filteredLogs.filter((log) => log.suspicious)
    }

    // Format logs for response
    const formattedLogs = filteredLogs.map((log) => ({
      id: log.id,
      documentName: log.documentName,
      action: log.action,
      accessorName: log.accessorName,
      accessorEmail: log.accessorEmail,
      ipAddress: log.ipAddress,
      location: log.location,
      device: log.device,
      timestamp: log.timestamp,
      duration: log.duration ? `${Math.floor(log.duration / 60000)} minutes` : null,
      shareToken: log.shareToken,
      suspicious: log.suspicious,
    }))

    return NextResponse.json({
      success: true,
      logs: formattedLogs,
      total: formattedLogs.length,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching access logs.",
    })
  }
}
