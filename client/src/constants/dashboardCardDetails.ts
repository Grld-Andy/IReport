import type { DashboardTitleCards } from "@/types/DashboardTitleCards";

export const dashboardCardDetails: Array<DashboardTitleCards> = [
    {
      title: "Days Since Last Incident",
      count: 1,
      percentage: 10,
      color: "blue",
      isIncrese: true,
    },
    {
      title: "Open Incidents",
      count: 25,
      percentage: 20,
      color: "green",
      isIncrese: true,
    },
    {
      title: "Critical Incidents",
      count: 5,
      percentage: 2,
      color: "red",
      isIncrese: false,
    },
    {
      title: "Closed Incidents",
      count: 25,
      percentage: 20,
      color: "purple",
      isIncrese: false,
    },
    {
      title: "Resolved Today",
      count: 25,
      percentage: 20,
      color: "orange",
      isIncrese: true,
    },
  ];