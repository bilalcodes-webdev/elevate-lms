"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-lg mx-auto shadow-2xl rounded-2xl p-6 animate-fadeIn bg-white dark:bg-gray-900">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-500 animate-bounce" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-red-600 dark:text-red-400">
            Payment Cancelled!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Oops! You stopped mid-way 🛑 — but no problem!
            <span className="block mt-1">
              Your course is still waiting for you 📚✨
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button asChild variant="default" className="gap-2">
              <Link href="/courses">
                <RefreshCcw className="h-4 w-4" />
                Try Again
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
