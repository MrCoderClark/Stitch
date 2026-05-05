import { Page } from "@/types";
import { useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import ScreenFrame from "./screen-frame";

interface DesignCanvasProps {
    pages: Page[];
    isGenerating?: boolean;
}

const CANVAS_PAD = 600
const FRAME_GAP = 120;
const FRAME_WIDTH = 1440;

export default function DesignCanvas({ pages, isGenerating }: DesignCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);

    const SCALE = 0.4
    const initX = 80 - CANVAS_PAD * SCALE
    const initY = 80 - CANVAS_PAD * SCALE

    return (
        <div className="absolute inset-0 top-12.25">
            <TransformWrapper
                minScale={0.05}
                maxScale={2}
                limitToBounds={true}
                initialScale={SCALE}
                initialPositionX={initX}
                initialPositionY={initY}
                panning={{ excluded: ["input", "button", "textarea"] }}
                wheel={{ step: 0.04 }}
                doubleClick={{ disabled: true }}
            >
                <TransformComponent
                    wrapperClass="!w-full !h-full cursor-grab active:cursor-grabbing bg-[#e8e8e8]"
                    wrapperStyle={{
                        backgroundImage: "radial-gradient(circle, #c8c8c8 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                >
                    <div
                        className="flex items-start"
                        style={{
                            padding: CANVAS_PAD,
                            gap: FRAME_GAP,
                            minWidth: `${CANVAS_PAD * 2 + pages.length * (FRAME_WIDTH + FRAME_GAP)}px`,
                            minHeight: "2000px"
                        }}
                    >
                        {pages.map(page =>
                            page.generating && !page.code ? (
                                <SkeletonFrame key={page.id} name={page.name} />
                            ) : (
                                <ScreenFrame key={page.id} page={page} />
                            )
                        )}

                        {pages.length === 0 && !isGenerating && (
                            <div className="flex flex-col items-center justify-center gap-3 text-zinc-400/50 select-none pt-5">
                                <p className="text-2xl font-light">
                                    Enter a prompt to start generating
                                </p>
                            </div>
                        )}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}

function SkeletonFrame({ name }: { name: string }) {
    return (
        <div className="flex flex-col gap-2" style={{ width: FRAME_WIDTH }}>
            <div className="flex items-center gap-2 px-1 h-8">
                <div className="w-4 h-4 rounded-sm bg-gray-500  animate-pulse">
                    <span className="text-gray-900 text-xs font-medium">
                        {name}
                    </span>
                </div>

                <div className="bg-gray-400 rounded-2xl border border-gray-400 overflow-hidden relative"
                    style={{ width: FRAME_WIDTH, height: 1600 }}
                >
                    <div className="h-10 bg-gray-500 flex items-center px-4 gap-2">
                        {Array.from({ length: 4 }).map((item, index) => (
                            <div
                                key={index}
                                className="h-28 bg-gray-500 rounded-xl animate-pulse"
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >

                            </div>
                        ))}
                    </div>

                    <div className="h-48 w-full bg-gray-500 rounded-xl animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-gray-500 rounded-xl animate-pulse" />
                        <div className="h-32 bg-gray-500 rounded-xl animate-pulse" style={{ animationDelay: "0.2s" }} />
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-4 py-1.5 flex items-center shadow border-zinc-200 gap-2">
                    <div className="w-4 h-4 border-2 border-b-zinc-400 border-t-transparent rounded-full animate-spin">
                        <span className="text-xs font-medium text-zinc-500">
                            Generating screen...
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}