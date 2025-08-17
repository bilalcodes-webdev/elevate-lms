/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { CheckCircle, PlayCircle, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-lg mx-auto shadow-2xl rounded-2xl p-6 animate-fadeIn bg-white dark:bg-gray-900">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-green-600 dark:text-green-400">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Woohoo! 🎉 Your payment has been confirmed.
            <span className="block mt-1">
              Your course is unlocked — let’s start learning 🚀
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button asChild variant="default" className="gap-2">
              <Link href="/courses">
                <PlayCircle className="h-4 w-4" />
                Start Course
              </Link>
            </Button>

            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
