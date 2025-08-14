"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { api } from "@/lib/convex/_generated/api";
import { capitalize } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { LogOut, User } from "lucide-react";
import ThemeToggle from "../theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function UserMenu() {
  const { signOut } = useAuthActions();

  const currentUser = useQuery(api.user.currentUser);

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer w-9 h-9" asChild>
        <Avatar>
          <AvatarImage src={currentUser.image} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">
              {capitalize(currentUser.role)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-1 text-sm gap-2 select-none flex items-center">
          <ThemeToggle />
          Toggle theme
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          className="text-red-600 hover:bg-muted cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
