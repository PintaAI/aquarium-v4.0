import { Button } from "@/components/ui/button"

interface LoginButtonProps {
  isLoading: boolean
  isRegister?: boolean
}

export function LoginButton({ isLoading, isRegister = false }: LoginButtonProps) {
  return (
    <Button className="w-full" disabled={isLoading} type="submit">
      {isRegister ? "Create account" : "Sign in"}
    </Button>
  )
}
