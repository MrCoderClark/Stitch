import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = await db.project.findUnique({
    where: { id },
  })

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const pages = await db.page.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({
    ...project,
    suggestions: project.suggestions
      ? (JSON.parse(project.suggestions) as string[])
      : [],
    pages,
  })
}
