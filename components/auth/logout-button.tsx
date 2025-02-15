"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  isLoading: boolean
}

export function LogoutButton({ isLoading }: LogoutButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={isLoading}
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  )
}
