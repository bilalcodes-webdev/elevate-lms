import * as LucideIcons from "lucide-react";


export interface FeaturedCourse {
  title: string;
  description: string;
  icon: keyof typeof LucideIcons;
}

// 2️⃣ Export featured courses normally
export const featuredCourses: FeaturedCourse[] = [
  {
    title: "Modern React Mastery",
    description: "Dive deep into hooks, state management, and component-driven architecture.",
    icon: "Atom",
  },
  {
    title: "TypeScript Bootcamp",
    description: "Unlock static typing with interfaces, generics, and more.",
    icon: "FileCode",
  },
  {
    title: "Creative UI/UX Design",
    description: "Learn to design beautiful, user-centric interfaces.",
    icon: "Brush",
  },
  {
    title: "Node.js Backend Pro",
    description: "Master building scalable APIs with Node.js and Express.",
    icon: "Cpu",
  },
];