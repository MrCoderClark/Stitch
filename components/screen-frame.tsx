import { Page } from "@/types"

interface ScreenFrameProps {
    page: Page
}

export default function ScreenFrame({ page }: ScreenFrameProps) {
    return (
        <div className="">
            <h1>Screen Frame</h1>
        </div >
    )
}