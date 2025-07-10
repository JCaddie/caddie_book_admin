import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks/use-auth";
import { DashboardData } from "../types";
import {
  fetchMasterDashboard,
  fetchAdminDashboard,
  fetchAnnouncements,
} from "../constants/mock-data";

// 메인 대시보드 데이터 hook
export const useDashboardData = () => {
  const { user } = useAuth();

  const masterQuery = useQuery({
    queryKey: ["dashboard", "master"],
    queryFn: fetchMasterDashboard,
    enabled: user?.role === "MASTER",
  });

  const adminQuery = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: fetchAdminDashboard,
    enabled: user?.role === "ADMIN",
  });

  const jcaddieAnnouncementsQuery = useQuery({
    queryKey: ["announcements", "jcaddie"],
    queryFn: () => fetchAnnouncements("JCADDIE"),
  });

  const golfCourseAnnouncementsQuery = useQuery({
    queryKey: ["announcements", "golf-course"],
    queryFn: () => fetchAnnouncements("GOLF_COURSE"),
    enabled: user?.role === "ADMIN",
  });

  const isLoading =
    masterQuery.isLoading ||
    adminQuery.isLoading ||
    jcaddieAnnouncementsQuery.isLoading ||
    (user?.role === "ADMIN" && golfCourseAnnouncementsQuery.isLoading);

  const data: DashboardData = {
    announcements: {
      jcaddie: jcaddieAnnouncementsQuery.data || [],
      golfCourse: golfCourseAnnouncementsQuery.data || [],
    },
    master: masterQuery.data,
    admin: adminQuery.data,
  };

  return {
    data,
    isLoading,
    role: user?.role,
    refetch: () => {
      jcaddieAnnouncementsQuery.refetch();
      if (user?.role === "MASTER") {
        masterQuery.refetch();
      } else if (user?.role === "ADMIN") {
        adminQuery.refetch();
        golfCourseAnnouncementsQuery.refetch();
      }
    },
  };
};
