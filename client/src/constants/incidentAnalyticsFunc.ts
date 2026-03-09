import { subDays, format, isWeekend, parseISO, differenceInCalendarDays, isToday } from "date-fns";
import type { Incident } from "@/types/Incident";
import type { DashboardTitleCards } from "@/types/DashboardTitleCards";

/** Generate chart data for the last 5 weekdays (Mon-Fri) */
export function generateChartData(incidents: Incident[]) {
  const last5Weekdays: string[] = [];
  let day = new Date();
  while (last5Weekdays.length < 5) {
    if (!isWeekend(day)) last5Weekdays.unshift(format(day, "yyyy-MM-dd"));
    day = subDays(day, 1);
  }

  const countsByDay: Record<string, number> = {};
  last5Weekdays.forEach((d) => (countsByDay[d] = 0));

  for (const incident of incidents) {
    const dateKey = format(parseISO(incident.createdAt), "yyyy-MM-dd");
    if (countsByDay[dateKey] !== undefined) countsByDay[dateKey]++;
  }

  return last5Weekdays.map((date) => ({
    name: format(parseISO(date), "EEE"), // Mon, Tue, etc.
    incidentNumber: countsByDay[date],
  }));
}

/** Generate dashboard card metrics */
export function generateDashboardCards(incidents: Incident[]): DashboardTitleCards[] {
  let latestIncidentDate: Date | null = null;
  let openCount = 0;
  let closedCount = 0;
  let criticalCount = 0;
  let resolvedTodayCount = 0;

  for (const incident of incidents) {
    const created = parseISO(incident.createdAt);
    const updated = parseISO(incident.updatedAt);

    if (!latestIncidentDate || created > latestIncidentDate) latestIncidentDate = created;

    if (incident.status === "Open") openCount++;
    if (incident.status === "Closed") closedCount++;
    if (incident.severity === "Critical") criticalCount++;
    if (isToday(updated) && incident.status === "Closed") resolvedTodayCount++;
  }

  const daysSinceLastIncident = latestIncidentDate
    ? differenceInCalendarDays(new Date(), latestIncidentDate)
    : null;

  return [
    {
      title: "Days Since Last Incident",
      count: daysSinceLastIncident ?? 0,
      percentage: 0,
      color: "blue",
      isIncrese: daysSinceLastIncident !== null,
    },
    {
      title: "Open Incidents",
      count: openCount,
      percentage: 0,
      color: "green",
      isIncrese: true,
    },
    {
      title: "Critical Incidents",
      count: criticalCount,
      percentage: 0,
      color: "red",
      isIncrese: criticalCount > 0,
    },
    {
      title: "Closed Incidents",
      count: closedCount,
      percentage: 0,
      color: "purple",
      isIncrese: false,
    },
    {
      title: "Resolved Today",
      count: resolvedTodayCount,
      percentage: 0,
      color: "orange",
      isIncrese: resolvedTodayCount > 0,
    },
  ];
}