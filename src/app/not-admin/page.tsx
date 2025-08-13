"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Lock, Info } from "lucide-react";

export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-8 bg-background">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Access Denied
          </CardTitle>
          <CardDescription className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
            <Lock className="h-5 w-5" />
            You do not have permission to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="flex items-center justify-center gap-2 text-center text-muted-foreground">
            <Info className="h-5 w-5" />
            Please contact your administrator if you think this is a mistake.
          </p>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="flex items-center gap-2"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Home
      </Button>
    </main>
  );
}
