import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const project = await db.project.create({
      data: {
        name: prompt.split("").slice(0, 3).join(" ") + "...",
        prompt,
        status: "ANALYZING",
        userId: "userId",
      },
    })
    return NextResponse.json({ projectId: project.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
