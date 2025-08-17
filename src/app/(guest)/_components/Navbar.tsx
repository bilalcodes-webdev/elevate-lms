"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../../../public/logo.png";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { DropDownMenu } from "./DropDown";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { data, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  const slug = data?.user.role === "admin" ? "/admin" : "/dashboard";
  const lebel = data?.user.role === "admin" ? "Admin Dashboard" : "Dashboard";
  

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Elevate LMS logo"
            className="size-8 rounded-sm"
          />
          <span className="text-lg font-bold">Elevate LMS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-between ml-4">
          {/* Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Courses
            </Link>
            <Link
              href={slug}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {lebel}
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? null : data ? (
              <div className="mr-2">
                <DropDownMenu
                  image={
                    data?.user.image ||
                    `https://avatar.vercel.sh/${data?.user.email}?rounded=60`
                  }
                  email={data?.user.email ?? ""}
                  name={
                    data?.user.name && data?.user.name.length > 0
                      ? data.user.name
                      : data?.user.email.split("@")[0]
                  }
                />
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          {isPending ? null : data ? (
            <div className="mr-2">
              <DropDownMenu
                image={
                  data?.user.image ||
                  `https://avatar.vercel.sh/${data?.user.email}?rounded=60`
                }
                email={data?.user.email ?? ""}
                name={
                  data?.user.name && data?.user.name.length > 0
                    ? data.user.name
                    : data?.user.email.split("@")[0]
                }
              />
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-accent focus:outline-none"
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-40 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="border-t bg-background px-4 py-3 space-y-3">
          <Link
            href="/"
            className="block text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className="block text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Courses
          </Link>
          <Link
            href={slug}
            className="block text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
