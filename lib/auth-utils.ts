import { headers } from "next/headers"
import { auth } from "./auth"
import { redirect } from "next/navigation"

export const authSession = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      throw new Error("Unauthorized: No valid session found")
    }

    return session
  } catch (error) {
    throw new Error("Unauthorized: No valid session found")
  }
}

export const authIsRequired = async () => {
  const session = await authSession()

  if (!session) {
    redirect("/auth/sign-in")
  }

  return session
}

export const authIsNotRequired = async () => {
  const session = await authSession()

  if (session) {
    redirect("/")
  }
}
