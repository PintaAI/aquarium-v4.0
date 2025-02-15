import { prisma } from "@/lib/prisma"
import { signUpSchema } from "@/lib/zod"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = signUpSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      )
    }

    // Create user
    // In a real application, you would hash the password
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Remember to hash this in production
      }
    })

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
