"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState, useTransition, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Main page component
export default function VerifyRequest() {
  return (
    <Suspense>
      <OTPVerifyUI />
    </Suspense>
  );
}

// OTP verification UI
function OTPVerifyUI() {
  const [otp, setOtp] = useState("");
  const [isVerifying, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(60);
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  // Cooldown timer for resending OTP
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  // Verify OTP
  const verifyOtp = () => {
    if (!email || otp.length !== 6) return;

    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully.");
            router.push("/");
          },
          onError: () => {
            toast.error("Invalid OTP.");
          },
        },
      });
    });
  };

  // Resend OTP
  const resendOtp = async () => {
    if (!email || cooldown > 0) return;

    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
      fetchOptions: {
        onSuccess: () => {
          toast.success("OTP Resent.");
          setCooldown(60); // Reset cooldown
        },
        onError: (err) => {
          toast.error(err?.error?.message || "Failed to resend OTP.");
        },
      },
    });
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 rounded-xl shadow-md border bg-background space-y-6">
      {/* Heading */}
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <br />
          <span className="font-medium text-orange-500">{email}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup className="gap-2">
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-12 h-12 rounded-md border border-border text-lg font-semibold bg-muted text-foreground"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify Button */}
      <Button
        className="w-full"
        disabled={otp.length !== 6 || isVerifying}
        onClick={verifyOtp}
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Code"
        )}
      </Button>

      {/* Resend OTP */}
      <p className="text-xs text-center text-muted-foreground">
        Didn’t receive a code?{" "}
        <button
          onClick={resendOtp}
          disabled={cooldown > 0}
          className="text-orange-500 hover:underline disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
        </button>
      </p>
    </div>
  );
}
