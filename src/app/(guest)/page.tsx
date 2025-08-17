// src/app/(guest)/page.tsx
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { featuredCourses } from "./_components/FeaturedCard";
import * as LucideIcons from "lucide-react";


// 3️⃣ Page Component
const HomePage = () => {
  return (
    <>
      <section className="relative py-20 text-center flex flex-col items-center space-y-8">
        <Badge variant="outline">The Future Of Online Education</Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Elevate Your Learning Experience
        </h1>
        <p className="text-muted-foreground md:text-xl max-w-[720px]">
          Discover a smarter, streamlined way to learn. Empower your journey
          with modern tools, interactive content, and personalized progress tracking.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/courses" className={buttonVariants({ size: "lg" })}>
            Explore Courses
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {featuredCourses.map((course, index) => {
          const IconComponent = LucideIcons[course.icon] as React.FC<
            React.SVGProps<SVGSVGElement>
          > | undefined;

          return (
            <Card
              key={index}
              className="hover:shadow-md hover:-translate-y-2 cursor-pointer transition-all duration-300"
            >
              <CardHeader>
                {IconComponent && <IconComponent className="w-8 h-8 text-primary mb-4" />}
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{course.description}</CardContent>
            </Card>
          );
        })}
      </section>
    </>
  );
};

export default HomePage;
