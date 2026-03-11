export const getRandomColor = () => {
  const colors = [
    "bg-gradient-to-r from-red-500 via-red-600 to-red-700 border-red-700 border text-white",
    "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 border-blue-700 border text-white",
    "bg-gradient-to-r from-green-500 via-green-600 to-green-700 border-green-700 border text-white",
    "bg-gradient-to-r from-yellow-500 via-yellow-500 to-yellow-500 border-yellow-700 border text-white",
    "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 border-purple-700 border text-white",
    "bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 border-pink-700 border text-white",
    "bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 border-indigo-700 border text-white",
    "bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 border-teal-700 border text-white",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

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