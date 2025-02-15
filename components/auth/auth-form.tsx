"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type AuthMode = "login" | "register"

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isLogin = mode === "login"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast.error("Invalid credentials")
          return
        }

        router.push("/")
        router.refresh()
        toast.success("Logged in successfully")
      } else {
        const name = formData.get("name") as string
        const confirmPassword = formData.get("confirmPassword") as string

        if (password !== confirmPassword) {
          toast.error("Passwords do not match")
          return
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            confirmPassword,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast.error(data.message || "Something went wrong")
          return
        }

        toast.success(data.message)
        setMode("login")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{isLogin ? "Welcome back" : "Create an account"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Enter your credentials to sign in"
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                disabled={loading}
                placeholder="John Doe"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <LoginButton isLoading={loading} isRegister={!isLogin} />
          <Button
            className="w-full"
            disabled={loading}
            type="button"
            variant="outline"
            onClick={() => {
              setMode(isLogin ? "register" : "login")
            }}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
