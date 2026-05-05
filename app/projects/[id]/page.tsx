"use client"

import DesignCanvas from "@/components/design-canvas";
import Navbar from "@/components/navbar";
import { Page } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ProjectIdProps {
    id: string;
    name: string;
    prompt: string;
    status: string;
    agentMessage: string;
    currentStep: string | null;
    totalPages: number;
    donePages: number;
    suggestions: string[];
    pages: Page[];
}

const TIPS = [
    'Tip: The zoom tool lets you select area to zoom into, or click to zoom in',
    'Tip: You can ask for specific outcomes: "make this screen more appealing for designers"',
    'Tip: Click on a frame to see options like Regenerate, Export, and Delete',
]

export default function ProjectIdPage() {
    const { id } = useParams<{ id: string }>()
    const [project, setProject] = useState<ProjectIdProps | null>(null);
    const [tipIndex, setTipIndex] = useState(0);
    const [isError, setIsError] = useState(false);
    const statusRef = useRef<string>("IDLE")

    useEffect(() => {
        let canceled = false
        let timerId: ReturnType<typeof setTimeout>

        async function fetchOnce() {
            try {
                const res = await fetch(`/api/projects/${id}`)

                if (!res.ok) {
                    if (!canceled) {
                        setIsError(true)
                    }
                    return
                }

                const data = (await res.json()) as ProjectIdProps

                statusRef.current = data.status
                setProject(data)
            } catch (error) {
                if (!canceled) {
                    setIsError(true)
                }
            } finally {
                if (!canceled) {
                    timerId = setTimeout(fetchOnce, 1000)
                }
            }
        }

        function schedule() {
            const active = statusRef.current === "ANALYZING" || statusRef.current === "GENERATING"
            timerId = setTimeout(fetchOnce, active ? 1200 : 8000)
        }

        fetchOnce()

        return () => {
            canceled = true
            clearTimeout(timerId)
        }
    }, [id])

    if (isError) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-zinc-50">
                <p className="text-zinc-400">
                    Project not found
                </p>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#e8e8e8]" style={{
                backgroundImage: "radial-gradient(circle, #b8b8b8 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }}>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-7 h-7 border-2 border-zinc-400 border-t-zinc-700 rounded-full animate-spin">
                        <span className="text-zinc-400 text-xs">Loading project...</span>
                    </div>
                </div>
            </div>
        )
    }

    const isGenerating = project.status === "ANALYZING" || project.status === "GENERATING";

    return (
        <main className="relative h-screen w-full overflow-hidden">
            <Navbar projectName={project.name} status={project.status} currentStep={project.currentStep} />
            <DesignCanvas pages={project.pages} isGenerating={isGenerating} />
            {/* <AgentPanel
                prompt={project.prompt}
                agentMessage={project.agentMessage}
                currentStep={project.currentStep}
                status={project.status}
                totalPages={project.totalPages}
                donePages={project.donePages}
            />
            <StatusBar prompt={project.prompt} status={project.status} />
            <ChatBar
                projectId={project.id}
                suggestions={project.status === "COMPLETED" ? project.suggestions : []}
                tip={isGenerating ? TIPS[tipIndex] : undefined}
            /> */}
        </main>
    )
}