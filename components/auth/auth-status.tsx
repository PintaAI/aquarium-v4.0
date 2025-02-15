"use client"

import Image from "next/image"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/auth/logout-button"

export function AuthStatus() {
  const user = useCurrentUser()

  return (
    <div className="max-w-4xl mx-auto text-center mb-8">
      {user ? (
        <div className="p-4 rounded-lg bg-card border mb-8">
          <p className="text-lg mb-2">
            Logged in as <span className="font-semibold">{user.name || user.email}</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name || "Profile"}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </div>
          <div className="mt-4">
            <LogoutButton isLoading={false} />
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-card border mb-8">
          <p className="text-lg mb-4">Sign in to access all features</p>
          <Button asChild className="w-full">
            <Link href="/auth">
              Sign in
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
