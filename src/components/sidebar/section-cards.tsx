import {
  IconBook,
  IconPlaylistX,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminDashboardData } from "@/app/data/admin/get-admin-dashboard-data";

export async function SectionCards() {
  const data = await getAdminDashboardData();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between py-0 pb-2">
          <div>
            <CardDescription>Total Signups</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data.totalUsers}
            </CardTitle>
          </div>
          <IconUser className="size-5" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Total registered users on the platform
          </p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between py-0 pb-2">
          <div>
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data.totalCustomers}
            </CardTitle>
          </div>
          <IconShoppingBag className="size-5" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Users who have enrolled in courses
          </p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between py-0 pb-2">
          <div>
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data.totalCourses}
            </CardTitle>
          </div>
          <IconBook className="size-5" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Available courses on platform</p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between py-0 pb-2">
          <div>
            <CardDescription>Total Lessons</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data.totalLessons}
            </CardTitle>
          </div>
          <IconPlaylistX className="size-5" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">
            Total available content on platform
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
