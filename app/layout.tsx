import { Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers";

const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' })



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={roboto.variable}
    >
      <body className="antialiased min-h-screen min-w-screen flex flex-col items-center">
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
