import {
  subDays,
  format,
  isWeekend,
  parseISO,
  differenceInCalendarDays,
  differenceInHours,
  isToday,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from "date-fns";
import type { Incident } from "@/types/Incident";
import type { DashboardTitleCards } from "@/types/DashboardTitleCards";

export type ReportRange = "7d" | "30d" | "90d" | "all";

export interface ReportAnalytics {
  kpis: DashboardTitleCards[];
  trend: Array<{
    name: string;
    open: number;
    resolved: number;
    critical: number;
    total: number;
  }>;
  byCategory: Array<{ name: string; value: number }>;
  bySeverity: Array<{ name: string; value: number }>;
  byStatus: Array<{ name: string; value: number }>;
  resolutionTime: Array<{ category: string; avgHours: number }>;
  weeklyVolume: Array<{ day: string; incidents: number }>;
  teamPerformance: Array<{
    team: string;
    total: number;
    resolved: number;
    avgHours: number;
  }>;
}

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

const isResolved = (status: string) =>
  status === "Resolved" || status === "Closed";

const parseCreated = (incident: Incident) => parseISO(incident.createdAt);

function getRangeStart(range: ReportRange, now = new Date()): Date | null {
  if (range === "7d") return subDays(now, 7);
  if (range === "30d") return subDays(now, 30);
  if (range === "90d") return subDays(now, 90);
  return null;
}

function filterByCreatedRange(
  incidents: Incident[],
  start: Date | null,
  end: Date = new Date(),
) {
  if (!start) return incidents;
  return incidents.filter((incident) => {
    const created = parseCreated(incident);
    return created >= start && created <= end;
  });
}

export function filterIncidentsByRange(incidents: Incident[], range: ReportRange) {
  return filterByCreatedRange(incidents, getRangeStart(range));
}

function countBy(incidents: Incident[], key: "category" | "severity" | "status") {
  const counts: Record<string, number> = {};
  for (const incident of incidents) {
    const label = incident[key] || "Unspecified";
    counts[label] = (counts[label] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function avgResolutionHours(incidents: Incident[]) {
  const resolved = incidents.filter((incident) => isResolved(incident.status));
  if (!resolved.length) return 0;

  const totalHours = resolved.reduce((sum, incident) => {
    const hours = differenceInHours(
      parseISO(incident.updatedAt),
      parseCreated(incident),
    );
    return sum + Math.max(hours, 0);
  }, 0);

  return Math.round((totalHours / resolved.length) * 10) / 10;
}

function buildTrend(incidents: Incident[], range: ReportRange) {
  const now = new Date();
  let start = getRangeStart(range, now);

  if (!start) {
    if (!incidents.length) return [];
    start = incidents
      .map(parseCreated)
      .reduce((earliest, date) => (date < earliest ? date : earliest), now);
  }

  if (start > now) return [];

  const interval = { start, end: now };

  let buckets: Date[];
  if (range === "7d" || range === "30d") {
    buckets = eachDayOfInterval(interval);
  } else if (range === "90d") {
    buckets = eachWeekOfInterval(interval);
  } else {
    buckets = eachMonthOfInterval(interval);
  }

  const formatKey = range === "all" ? "MMM yyyy" : "MMM d";

  return buckets.map((bucketStart, index) => {
    const bucketEnd = buckets[index + 1] ?? now;
    const inBucket = incidents.filter((incident) => {
      const created = parseCreated(incident);
      return created >= bucketStart && created < bucketEnd;
    });

    return {
      name: format(bucketStart, formatKey),
      open: inBucket.filter((incident) => incident.status === "Open").length,
      resolved: inBucket.filter((incident) => isResolved(incident.status)).length,
      critical: inBucket.filter((incident) => incident.severity === "Critical").length,
      total: inBucket.length,
    };
  });
}

export function generateReportAnalytics(
  incidents: Incident[],
  range: ReportRange,
): ReportAnalytics {
  const now = new Date();
  const start = getRangeStart(range, now);
  const current = filterByCreatedRange(incidents, start, now);

  const previousStart = start ? new Date(start.getTime() - (now.getTime() - start.getTime())) : null;
  const previous = previousStart
    ? filterByCreatedRange(incidents, previousStart, start ?? now)
    : [];

  const resolvedCount = current.filter((incident) => isResolved(incident.status)).length;
  const previousResolved = previous.filter((incident) => isResolved(incident.status)).length;
  const criticalCount = current.filter((incident) => incident.severity === "Critical").length;
  const previousCritical = previous.filter((incident) => incident.severity === "Critical").length;
  const avgHours = avgResolutionHours(current);
  const previousAvgHours = avgResolutionHours(previous);

  const kpis: DashboardTitleCards[] = [
    {
      title: "Total Incidents",
      count: current.length,
      percentage: percentChange(current.length, previous.length),
      color: "yellow",
      isIncrese: current.length >= previous.length,
      subtitle: "vs last period",
    },
    {
      title: "Resolved",
      count: resolvedCount,
      percentage: percentChange(resolvedCount, previousResolved),
      color: "green",
      isIncrese: resolvedCount >= previousResolved,
      subtitle: "vs last period",
    },
    {
      title: "Critical",
      count: criticalCount,
      percentage: percentChange(criticalCount, previousCritical),
      color: "red",
      isIncrese: criticalCount > previousCritical,
      subtitle: "vs last period",
    },
    {
      title: "Avg. Resolution (h)",
      count: avgHours,
      percentage: percentChange(avgHours, previousAvgHours),
      color: "blue",
      isIncrese: avgHours <= previousAvgHours || previousAvgHours === 0,
      subtitle: "vs last period",
    },
    {
      title: "Open",
      count: current.filter((incident) => incident.status === "Open").length,
      percentage: 0,
      color: "orange",
      isIncrese: true,
    },
  ];

  const resolutionByCategory: Record<string, { total: number; count: number }> = {};
  for (const incident of current) {
    if (!isResolved(incident.status)) continue;
    const hours = Math.max(
      differenceInHours(parseISO(incident.updatedAt), parseCreated(incident)),
      0,
    );
    const category = incident.category || "Unspecified";
    const entry = resolutionByCategory[category] ?? { total: 0, count: 0 };
    entry.total += hours;
    entry.count += 1;
    resolutionByCategory[category] = entry;
  }

  const teamMap: Record<string, { total: number; resolved: number; hours: number }> = {};
  for (const incident of current) {
    const team = incident.team || "Unassigned";
    const entry = teamMap[team] ?? { total: 0, resolved: 0, hours: 0 };
    entry.total += 1;
    if (isResolved(incident.status)) {
      entry.resolved += 1;
      entry.hours += Math.max(
        differenceInHours(parseISO(incident.updatedAt), parseCreated(incident)),
        0,
      );
    }
    teamMap[team] = entry;
  }

  const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyCounts: Record<string, number> = Object.fromEntries(
    weekdayOrder.map((day) => [day, 0]),
  );
  for (const incident of current) {
    const day = format(parseCreated(incident), "EEE");
    weeklyCounts[day] = (weeklyCounts[day] ?? 0) + 1;
  }

  return {
    kpis,
    trend: buildTrend(current, range),
    byCategory: countBy(current, "category"),
    bySeverity: countBy(current, "severity"),
    byStatus: countBy(current, "status"),
    resolutionTime: Object.entries(resolutionByCategory).map(
      ([category, { total, count }]) => ({
        category,
        avgHours: Math.round((total / count) * 10) / 10,
      }),
    ),
    weeklyVolume: weekdayOrder.map((day) => ({
      day,
      incidents: weeklyCounts[day],
    })),
    teamPerformance: Object.entries(teamMap).map(([team, stats]) => ({
      team,
      total: stats.total,
      resolved: stats.resolved,
      avgHours:
        stats.resolved === 0
          ? 0
          : Math.round((stats.hours / stats.resolved) * 10) / 10,
    })),
  };
}

export function incidentsToCsv(incidents: Incident[]) {
  const headers = [
    "Subject",
    "Status",
    "Severity",
    "Category",
    "Team",
    "Reporter",
    "Assigned To",
    "Created At",
    "Updated At",
  ];

  const rows = incidents.map((incident) => [
    incident.subject,
    incident.status,
    incident.severity,
    incident.category,
    incident.team,
    incident.reporter?.name ?? "",
    incident.assignedTo?.name ?? "",
    incident.createdAt,
    incident.updatedAt,
  ]);

  return [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
}