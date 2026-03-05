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