import { Loader2 } from "lucide-react";
import { UserButton } from "@daveyplate/better-auth-ui"

interface NavbarProps {
    projectName: string;
    status: string;
    currentStep: string | null;
}

export default function Navbar({ projectName, status, currentStep }: NavbarProps) {
    const isGenerating = status === "ANALYZING" || status === "GENERATING";

    return (
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2.5 bg-white/80 backdrop-blur-md border-b border-zinc-200/70">
            <div className="flex items-center gap-3">
                <button className="text-sm font-semibold text-zinc-800 hover:text-zinc-500 transition-colors">
                    {projectName}
                </button>
            </div>
            {isGenerating && (
                <div className="flex items-center gap-2 text-zinc-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs font-medium">
                        {currentStep ?? "Generating screen..."}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2">
                <UserButton className="h-9 cursor-pointer" />
            </div>
        </div >
    )
}