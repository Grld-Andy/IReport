import React from "react";
import type { DashboardTitleCards } from "@/types/DashboardTitleCards";

interface Props {
  cardDetails: DashboardTitleCards;
}

const StatsCard: React.FC<Props> = ({ cardDetails }) => {
  return (
    <div className="flex flex-1 gap-2 bg-white flex-col shadow-md border-[1px] border-black/20 rounded-2xl p-3">
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="text-[1.2em] font-[400]">{cardDetails.title}</p>
        </div>
        <div>
          <p className="font-bold text-[3em]">{cardDetails.count}</p>
        </div>
      </div>
      <div className="flex-col gap-2">
        <div className={`flex gap-1 text-[0.8em]
              ${cardDetails.color == "green" ? "text-green-900" : ""}
              ${cardDetails.color == "red" ? "text-red-900" : ""}
              ${cardDetails.color == "orange" ? "text-orange-900" : ""}
              ${cardDetails.color == "blue" ? " text-blue-900" : ""}
              ${cardDetails.color == "purple" ? "text-purple-900" : ""}`
            }>
          <span className={`
              grid place-items-center w-[70px] h-[20px] border-[1px]  rounded-full
              ${cardDetails.color == "green" ? "bg-green-300 border-green-600" : ""}
              ${cardDetails.color == "red" ? "bg-red-300 border-red-600" : ""}
              ${cardDetails.color == "orange" ? "bg-orange-300 border-orange-600" : ""}
              ${cardDetails.color == "blue" ? "bg-blue-300 border-blue-600" : ""}
              ${cardDetails.color == "purple" ? "bg-purple-300 border-purple-600" : ""}
            `}>
            {cardDetails.percentage}%
          </span>
          <p className="text-nowrap">Might add percentage</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
