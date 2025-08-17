"use client";

import { SidebarDataTypes } from "@/app/data/courses/get-user-sidebar-data";
import { useMemo } from "react";

type Result = {
  percentage: number;
  totalLesson: number;
  completedLessons: number;
};

export const useTrackProgress = (data: SidebarDataTypes["course"]): Result => {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    data.chapter.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;

        const completed = lesson.lessonProgress.some(
          (progress) => progress.lessonId === lesson.id && progress.completed
        );

        if (completed) {
          completedLessons++;
        }
      });
    });

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      percentage: progressPercentage,
      totalLesson: totalLessons,
      completedLessons,
    };
  }, [data]);
};
