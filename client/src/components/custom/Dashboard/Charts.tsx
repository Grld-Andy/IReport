import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "@/redux/app/hooks";
import { generateChartData } from "@/constants/incidentAnalyticsFunc";

export default function DashboardChart() {
  const { incidents } = useAppSelector((state) => state.incidents);
  const data = generateChartData(incidents);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
        <Line
          type="monotone"
          dataKey="incidentNumber"
          stroke="#16a34a"
          strokeWidth={2}
          name="Incidents"
        />
        <XAxis dataKey="name" />
        <YAxis
          width={40}
          allowDecimals={false}
          label={{ value: "Incidents", angle: -90, position: "insideLeft" }}
        />
        <Legend align="center" />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
