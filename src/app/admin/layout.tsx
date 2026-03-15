"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Skip auth check for the login page itself
    if (pathname === "/admin/login") {
      setIsAuthorized(true)
      return
    }

    const auth = sessionStorage.getItem("admin_authenticated")
    if (auth !== "true") {
      setIsAuthorized(false)
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
    }
  }, [pathname, router])

  // Prevent flash of content while checking auth
  if (isAuthorized === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
