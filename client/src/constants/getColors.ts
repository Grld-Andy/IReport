export const getSeverityColor = (color: string) => {
    switch (color) {
      case "Critical":
        return "bg-red-100 border-red-500 border text-red-700";
      case "Low":
        return "bg-blue-100 border-blue-500 border text-blue-700";
      case "Medium":
        return "bg-green-100 border-green-500 border text-green-700";
      default:
        return "bg-yellow-100 border-yellow-500 border text-yellow-700";
    }
  };

 export  const severityConfig: Record<string, { label: string; className: string }> = {
    low: {
      label: "Low",
      className: getSeverityColor("Low"),
    },
    medium: {
      label: "Medium",
      className: getSeverityColor("Medium"),
    },
    high: {
      label: "High",
      className: getSeverityColor("High"),
    },
    critical: {
      label: "Critical",
      className: getSeverityColor("Critical"),
    },
  };
  
 export  const statusConfig: Record<
    string,
    { label: string; dot: string; className: string }
  > = {
    open: {
      label: "Open",
      dot: "bg-blue-400",
      className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    },
    in_progress: {
      label: "In Progress",
      dot: "bg-amber-400",
      className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    },
    resolved: {
      label: "Resolved",
      dot: "bg-emerald-400",
      className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    },
    closed: {
      label: "Closed",
      dot: "bg-gray-400",
      className: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
    },
  };