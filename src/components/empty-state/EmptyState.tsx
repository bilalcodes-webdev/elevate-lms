"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  redirectTo: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  redirectTo,
}) => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-full w-full mt-14">
      <Card className="w-full max-w-3xl text-center p-6">
        <CardContent className="flex flex-col items-center space-y-4">
          <AlertCircle className="w-12 h-12 text-gray-400" />
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-500">{description}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push(redirectTo)}>
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
