import { getSeverityColor } from "@/constants/getColors";
import type { Incident } from "@/types/Incident";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";

interface Props {
  incident: Incident;
}

const BoardCard: React.FC<Props> = ({ incident }) => {
  return (
    <div
      key={incident.id}
      className="bg-white z-10 p-2 rounded-lg shadow-md border border-black/10 flex flex-col gap-1 cursor-grab"
    >
      <div className="flex justify-between gap-4">
        <div className="flex gap-2">
          <div
            className={`${getSeverityColor(
              incident.severity.toString(),
            )} border-0 font-semibold w-min rounded-full px-2 text-sm`}
          >
            {incident.severity}
          </div>
          <div
            className={`bg-gray-200 text-black border-[1px] font-semibold w-min rounded-full px-4 text-sm`}
          >
            {incident.category}
          </div>
        </div>

        <BsThreeDotsVertical className="cursor-pointer"/>
      </div>

      <h3 className="font-semibold text-[17px] font-f">{incident.subject}</h3>

      <p className="text-sm line-clamp-2 text-gray-600">
        {incident.description}
      </p>

      <p className="text-xs line-clamp-2 text-gray-600">
        Reported By: {incident.reporter.name}
      </p>

      {incident.assignedTo && (
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            <div
              className="w-[30px] h-[30px] grid place-content-center text-white bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full overflow-hidden"
              title={incident.assignedTo.name.charAt(0).toUpperCase()}
            >
              {incident.assignedTo.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-500 text-nowrap">
                {new Date(incident.updatedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500 text-nowrap">
                {new Date(incident.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <FaRegCommentDots className="" />
            <span>0</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardCard;
