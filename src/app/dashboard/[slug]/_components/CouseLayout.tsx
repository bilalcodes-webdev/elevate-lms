"use client";

import { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseSidebar from "../../_components/CourseSidebar";

type Props = {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  course: any; // replace with Prisma type later
};

export default function CourseLayoutClient({ children, course }: Props) {
  return (
    <div className="flex flex-1 h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r border-border shrink-0">
        <CourseSidebar course={course} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-border bg-background">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-4 w-[85%] max-w-sm border-r border-border"
            >
              <CourseSidebar course={course} />
            </SheetContent>
          </Sheet>

          <span className="font-semibold truncate">{course.title}</span>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4">{children}</div>
      </main>
    </div>
  );
}
