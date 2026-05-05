import { db } from "@/lib/db"
import ProjectClient from "./project-client"

const groupProjects = (projects: Awaited<ReturnType<typeof fetchProjects>>) => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1)

    const groups: Record<string, typeof projects> = {
        Recent: [],
        Yesterday: [],
        "Last year": [],
        Examples: []
    }

    for (const p of projects) {
        const d = new Date(p.createdAt)
        if (d >= todayStart) groups["Recent"].push(p)
        else if (d >= yesterdayStart) groups["Yesterday"].push(p)
        else if (d >= lastYearStart) groups["Last year"].push(p)
        else groups["Examples"].push(p)
    }
    return groups
}

const fetchProjects = async () => {
    try {
        return await db.project.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
            include: { pages: { take: 1 } }
        })
    } catch (error) {
        throw new Error("Failed to fetch projects")
    }
}

export default async function ProjectPage() {

    const projects = await fetchProjects()
    const grouped = groupProjects(projects)

    return (
        <ProjectClient grouped={grouped} />
    )
}