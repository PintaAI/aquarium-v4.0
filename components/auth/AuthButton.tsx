"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOut, LogIn } from "lucide-react";
import AuthCard from "./AuthCard";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface AuthButtonProps {
  className?: string;
}

export const AuthButton = ({ className }: AuthButtonProps) => {
  const { data: session } = useSession();

  return session ? (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      variant="destructive"
      size="sm"
      className={className}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className={className}>
          <LogIn className="w-4 h-4 mr-2" />
          Log In
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-transparent pb-4 border-none">
        <DrawerHeader className="">
          
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <AuthCard mode="login" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
