"use client"

import { useRouter } from "next/navigation"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            onSessionChange={() => {
                router.refresh()
            }}
            Link={Link}
            social={{
                providers: ["google", "github"],
            }}
        >
            {children}
        </AuthUIProvider>
    )
}