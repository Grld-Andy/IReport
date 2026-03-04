import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const StatsCard: React.FC = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Open Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        24
      </CardContent>
      <CardFooter className="flex-col gap-2">
        +25% Might add percentage
      </CardFooter>
    </Card>
  );
};

export default StatsCard;
