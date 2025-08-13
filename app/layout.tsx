import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DrakorID - Korean Drama Streaming",
  description: "Watch Korean dramas online for free. Stream the latest K-dramas with subtitles.",
  keywords: ["korean drama", "k-drama", "streaming", "watch online", "subtitles"],
  authors: [{ name: "DrakorID" }],
  creator: "DrakorID",
  publisher: "DrakorID",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
