import { AccountView, } from "@daveyplate/better-auth-ui"
import { accountViewPaths } from "@daveyplate/better-auth-ui/server"


export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(accountViewPaths).map((path) => ({ path }))
}

export default async function AccountPage({
    params
}: {
    params: Promise<{ path: string }>
}) {
    const { path } = await params

    return (
        <main>
            <AccountView path={path} className="shadow-2xl border-none" />
        </main>
    )
}