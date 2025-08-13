"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../../../public/logo.png";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { DropDownMenu } from "./DropDown";

interface NavigationProps {
  name: string;
  slug: string;
}

const navigationItems: NavigationProps[] = [
  { name: "Home", slug: "/" },
  { name: "Courses", slug: "/courses" },
  { name: "Dashboard", slug: "/dashboard" },
];

const Navbar = () => {
  const { data, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6 lg:px-8">
        {/* Logo & Title */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image
            src={logo}
            alt="Elevate LMS logo"
            className="size-8 rounded-sm"
          />
          <span className="text-lg font-bold">Elevate LMS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-between md:flex">
          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.slug}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side: Theme + Auth Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isPending ? null : data ? (
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
      </div>
    </header>
  );
};

export default Navbar;
