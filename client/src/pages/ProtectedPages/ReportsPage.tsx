import PageHeader from "@/components/custom/PageHeader";
import StatsCard from "@/components/custom/Dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/app/hooks";
import {
  generateReportAnalytics,
  filterIncidentsByRange,
  incidentsToCsv,
  type ReportRange,
} from "@/constants/incidentAnalyticsFunc";
import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RANGES: Array<{ id: ReportRange; label: string }> = [
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
  { id: "all", label: "All" },
];

const CHART_COLORS = ["#16a34a", "#2563eb", "#e11d48", "#d97706", "#7c3aed", "#0891b2"];

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: Readonly<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`bg-gray-50 p-5 flex flex-col gap-4 rounded-2xl border border-black/10 shadow-sm ${className}`}
    >
      <div>
        <h3 className="font-bold text-[16px]">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const ReportsPage: React.FC = () => {
  const { incidents } = useAppSelector((state) => state.incidents);
  const [range, setRange] = useState<ReportRange>("30d");

  const analytics = useMemo(
    () => generateReportAnalytics(incidents, range),
    [incidents, range],
  );

  const exportCsv = () => {
    const csv = incidentsToCsv(filterIncidentsByRange(incidents, range));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `safezone-incidents-${range}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <PageHeader
          title="Reports"
          subtitle="Incident metrics by category, severity, team, and time"
        />

        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 border border-black/10">
            {RANGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRange(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                  range === item.id
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button onClick={exportCsv} className="bg-green-600 hover:bg-green-500">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-scroll hide-scrollbar py-1">
        {analytics.kpis.map((card) => (
          <StatsCard key={card.title} cardDetails={card} />
        ))}
      </div>

      {incidents.length === 0 ? (
        <div className="h-[240px] grid place-content-center text-gray-500 bg-gray-50 rounded-2xl border border-black/10">
          No incident data yet. Reports will appear once incidents are logged.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <ChartCard
            title="Incident volume trend"
            subtitle="Open, resolved, and critical over time"
            className="xl:col-span-3"
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analytics.trend}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="open"
                  name="Open"
                  stroke="#e11d48"
                  fill="#e11d48"
                  fillOpacity={0.12}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.12}
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  name="Critical"
                  stroke="#d97706"
                  fill="#d97706"
                  fillOpacity={0.08}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="By category" subtitle="Distribution this period">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={analytics.byCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {analytics.byCategory.map((item, index) => (
                    <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="By severity" subtitle="Count per severity">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.bySeverity}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Incidents" radius={[6, 6, 0, 0]}>
                  {analytics.bySeverity.map((item, index) => (
                    <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="By status" subtitle="Current workflow split">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.byStatus}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Incidents" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Avg. resolution time" subtitle="Hours by category">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.resolutionTime}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="avgHours" name="Hours" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Weekly volume" subtitle="Incidents by day of week">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.weeklyVolume}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="incidents" name="Incidents" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Team performance"
            subtitle="Total vs resolved, with average hours"
            className="xl:col-span-1"
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.teamPerformance}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="team" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
