import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../../public/logo.png";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elevate LMS | Login to Your Account",
  description:
    "Access your Elevate LMS account to continue learning and track your progress.",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh justify-center items-center flex-col">
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <div className="flex flex-col w-full max-w-md gap-6">
        <Link
          href={"/"}
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            src={logo}
            alt="logo-image"
            width={35}
            height={35}
            className="rounded"
          />
          Elevate LMS
        </Link>
        {children}

        <div className="text-balance text-sm text-center text-muted-foreground">
          By clicking continue, you are agree to our
          <span className="hover:text-primary hover:underline">
            Terms of Servives{" "}
          </span>
          and <span>Privacy Policey</span>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
