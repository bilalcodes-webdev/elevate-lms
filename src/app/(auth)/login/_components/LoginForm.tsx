"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const [githubPending, setGithubTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [emailPending, setEmailTransition] = useTransition();
  const router = useRouter();

  const handleSignInWithGithub = () => {
    setGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Login Successfully with Github");
          },
          onError: (error) => {
            toast.error(
              error.error.message || "Something went wrong, Please try again"
            );
          },
        },
      });
    });
  };

  const handleEmailLogIn = () => {
    setEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email Sent Successfully");
            router.push(`/verify-request?email=${email}`);
          },
          onError: (err) => {
            toast.error(err.error.message || "Failed To Send Email");
          },
        },
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>Login With Your Github Email Account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button
          onClick={handleSignInWithGithub}
          disabled={githubPending}
          variant={"outline"}
          className="w-full"
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              Signing...
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Sign In With Github
            </>
          )}
        </Button>

        <div className="relative text-sm text-center after:absolute after:inset-0 after:z-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@gmail.com"
              type="email"
              id="email"
              name="email"
            />
          </div>

          <Button onClick={handleEmailLogIn} disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Continue With Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default LoginForm;
