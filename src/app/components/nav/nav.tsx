"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Button, buttonVariants } from "../ui/button";

function Nav() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const { signIn } = useAuthActions();

  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-[1400px] flex h-16 items-center gap-2 px-6">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight mr-6 select-none"
        >
          DA Hacks 4.0
        </Link>

        <nav className="items-center gap-2 hidden lg:flex lg:justify-center lg:flex-1 select-none">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground h-8 rounded-md gap-1.5 px-3"
          >
            Projects
          </Link>
          <Link
            href="/judge"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground h-8 rounded-md gap-1.5 px-3"
          >
            Judge
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground h-8 rounded-md gap-1.5 px-3"
          >
            Leaderboard
          </Link>
        </nav>

        <div className="lg:hidden flex-1" />

        <div className=" gap-3 items-center lg:flex hidden">
          <ThemeToggle />
          <Button
            onClick={() => void signIn("google")}
            className="cursor-pointer"
          >
            Log In
          </Button>
        </div>

        <button
          className="lg:hidden flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring relative hover:bg-muted cursor-pointer transition-[background-color]"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="block w-6 h-6 relative">
            <Menu
              className={`absolute inset-0 w-6 h-6 transition-all duration-200 ease-in-out ${menuOpen ? "opacity-0 scale-90 rotate-45" : "opacity-100 scale-100 rotate-0"}`}
            />
            <X
              className={`absolute inset-0 w-6 h-6 transition-all duration-200 ease-in-out ${menuOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 -rotate-45"}`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="fixed left-0 right-0 top-17 z-40 bg-background/95 flex flex-col items-center justify-start pt-12 px-8 min-h-[calc(100vh-4rem)]">
          <nav className="flex flex-col gap-6 w-full max-w-xs mx-auto text-center">
            <Link
              href="/projects"
              className={buttonVariants({
                variant: "ghost",
                className: "text-xl py-6",
              })}
              onClick={() => setMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/judge"
              className={buttonVariants({
                variant: "ghost",
                className: "text-xl py-6",
              })}
              onClick={() => setMenuOpen(false)}
            >
              Judge
            </Link>
            <Link
              href="/leaderboard"
              className={buttonVariants({
                variant: "ghost",
                className: "text-xl py-6",
              })}
              onClick={() => setMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <div className="flex items-center gap-3 justify-center mt-2 font-medium select-none">
              <ThemeToggle />
              Toggle Theme
            </div>
            <Button
              className="w-full mt-2 cursor-pointer"
              onClick={() => void signIn("google")}
            >
              Log In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Nav;
