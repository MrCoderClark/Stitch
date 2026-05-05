"use client"

import { ArrowUp, Calendar, LoaderCircle, Monitor, Search, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation";
import { Label } from "radix-ui";
import { useState } from "react";

interface PageSnippet {
    id: string;
    code: string | null
}

interface ProjectItem {
    id: string;
    name: string;
    createdAt: Date;
    pages: PageSnippet[]
}

interface ProjectProps {
    grouped: Record<string, ProjectItem[]>
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(date))
}

export default function ProjectClient({ grouped }: ProjectProps) {
    const router = useRouter()
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState<"app" | "web">("app")
    const [search, setSearch] = useState("")

    const allProjects = Object.values(grouped).flat()
    const filtered = search ? allProjects.filter(project => project.name.toLowerCase().includes(search.toLowerCase())) : null

    const handleGenerate = async (text = prompt) => {
        if (!text.trim() || isLoading) return;

        setIsLoading(true)

        try {
            const res = await fetch('/api/projects/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: text })
            })

            const { projectId } = await res.json()

            router.push(`/projects/${projectId}`)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleGenerate()
        }
    }

    return (
        <div className="flex w-full min-w-screen h-screen bg-[#f0f0f0] overflow-hidden font-sans">
            <aside className="w-72.5 shrink-0 bg-[#f0f0f0] border-r border-zinc-200/80 flex flex-col overflow-hidden">
                <div className="flex gap-1 p-3 gb-2">
                    <div className="py-3">
                        <div className="flex items-center gap-2 bg-white/60 border borrder-zinc-200 rounded-xl px-3 py-2">
                            <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search projects..."
                                className="bg-transparent text-sm text-shadow-zinc-700 placeholder:text-zinc-400 focus:outline-none w-full" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
                        {filtered ? (
                            <div className="space-y-1">
                                {filtered.map(project => (
                                    <ProjectRow key={project.id} project={project} router={router} />
                                ))}
                                {filtered.length === 0 && (
                                    <p className="text-xs text-zince-400 py-4 text-center">
                                        No projects found
                                    </p>
                                )}
                            </div>
                        ) : (
                            Object.entries(grouped).map(([label, projects]) => projects.length === 0 ? null : (
                                <div key={label}>
                                    <p className="text-xs font-semibold text-zinc-400 mb-2 px-1">
                                        {label}
                                    </p>
                                    <div className="space-y-0.5">
                                        {projects.map(p => (
                                            <ProjectRow key={p.id} project={p} router={router} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </aside>

            <div
                className="flex flex-1 flex-col overflow-hidden relative bg-[#f0f0f0]"
                style={{
                    backgroundImage: "radial-gradient(circle, #c8c8c8 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                }}
            >
                <header className="flex items-center justify-between px-6 py-3 bg-transparent">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-zinc-900 tracking-tight">
                            Stitch
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        UserCard
                    </div>
                </header>

                <main className="flex flex-1 flex-col items-center justify-center px-8 pb-12 overflow-y-auto">
                    <div className="w-full max-w-155 space-y-6">
                        <h1 className="text-[55px] font-bold text-zinc-900 leading-[1.05] tracking-tight">
                            Welcome to Stitch
                        </h1>

                        <div className="bg-white/90 backdrop-blur-sm border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                            <textarea
                                onChange={e => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    mode === "app" ? "Design a mobile app" : "Design a web app"
                                }
                                disabled={isLoading}
                                rows={4}
                                className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none leading-relaxed disabled:opacity-50"
                            />

                            <div className="flex items-center justify-between px-4 pb-3 pt-1">
                                <div className="flex items-center gap-1">
                                    <button
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${mode === "app" ? "bg-zinc-100 text-zinc-800" : "text-zince-400 hover:text-zinc-600"}`}
                                        onClick={() => setMode("app")}
                                    >
                                        <Smartphone className="w-4 h-4" /> App
                                    </button>
                                    <button
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${mode === "web" ? "bg-zinc-100 text-zinc-800" : "text-zince-400 hover:text-zinc-600"}`}
                                        onClick={() => setMode("web")}
                                    >
                                        <Monitor className="w-4 h-4" /> Web
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleGenerate()}
                                        className="w-7 h-7 flex items-center justify-center bg-zinc-900 disabled:bg-zinc-200 hover:bg-zinc-600 rounded-full transition-all text-white diabled:text-zinc-400"
                                    >
                                        {isLoading ? <LoaderCircle className="w-3 h-3 animate-spin" /> : <ArrowUp className="w-3 h-3" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

const ProjectRow = ({ project, router }: { project: ProjectItem, router: ReturnType<typeof useRouter> }) => {
    return (
        <button
            onClick={() => router.push(`/projects/${project.id}`)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/70 transition-all group text-left"
        >
            <ProjectThumbnail project={project} />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 truncate leading-tight">
                    {project.name}
                </p>

                <div className="flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span className="text.xs text-zinc-400">
                        {formatDate(project.createdAt)}
                    </span>
                </div>
            </div>
        </button>
    )
}

const ProjectThumbnail = ({ project }: { project: ProjectItem }) => {
    const colors = [
        "from-blue-400 to-indigo-600",
        "from-teal-400 to-cyan-600",
        "from-violet-400 to-purple-600",
        "from-rose-400 to-pink-600",
        "from-amber-400 to-orange-500",
        "from-slate-600 to-slate-800"
    ]

    const index = project.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length

    return (
        <div className={`w-9 h-9 rounded-lg bg-linear-to-br ${colors[index]} shrink-0 overflow-hidden flex items-center justify-center`}>
            {project.pages[0]?.code ? (
                <div className="w-full h-full scale-[0.08] origin-top-left pointer-events-none">

                </div>
            ) : <div />}
        </div>
    )
}