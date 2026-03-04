import { Input } from "@/components/ui/input";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { MdOutlineEmail } from "react-icons/md";

const DashboardNavbar: React.FC = () => {
  return (
    <nav className="px-5 py-3 bg-gray-100 rounded-lg w-full flex justify-between items-center gap-5">
      <div className="bg-white rounded-full p-2 flex gap-2 items-center w-full max-w-[500px]">
        <CiSearch size={25} />
        <Input
          placeholder="Search Incident"
          className="shadow-none active:ring-transparent focus-visible:ring-none focus-visible:ring-transparent active:border-none border-none outline-none"
        />
      </div>

      <div className="flex gap-1 items-center">
        <div className="grid place-content-center h-[45px] w-[45px] rounded-full bg-white">
          <MdOutlineEmail size={25} />
        </div>
        <div className="grid place-content-center h-[45px] w-[45px] rounded-full bg-white">
          <GoBell size={25} />
        </div>
        <div className="flex gap-2 items-center">
          <div className="grid place-content-center h-[45px] w-[45px] rounded-full bg-green-500">
            <FaUser size={25} color="white" />
          </div>
          <div className="flex flex-col justify-between items-start py-1">
            <h3 className="text-black text-[1em]">John Doe</h3>
            <p className="text-gray-800 text-[0.8em]">johndoe@gmail.com</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
