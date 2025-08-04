import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Mock user database - replace with actual database
const users = [
  {
    id: "1",
    email: "john.doe@email.com",
    password: "$2a$10$rOzJqZxnTgGww8bZqKqOUeQcr8fZqGqOUeQcr8fZqGqOUeQcr8fZqG", // 'password123'
    firstName: "John",
    lastName: "Doe",
    mfaEnabled: true,
    mfaSecret: "JBSWY3DPEHPK3PXP",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password, mfaCode } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if MFA is required
    if (user.mfaEnabled && !mfaCode) {
      return NextResponse.json({ requireMFA: true }, { status: 200 })
    }

    // Verify MFA code if provided
    if (user.mfaEnabled && mfaCode) {
      // In a real app, verify the TOTP code using the user's secret
      // For demo purposes, accept any 6-digit code
      if (!/^\d{6}$/.test(mfaCode)) {
        return NextResponse.json({ error: "Invalid MFA code" }, { status: 401 })
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
