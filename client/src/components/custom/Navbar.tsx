import React from "react";
import { FaUser } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { MdOutlineEmail } from "react-icons/md";
import SearchInput from "../ui/SearchInput";

const Navbar: React.FC = () => {
  return (
    <nav className="px-5 py-3 bg-gray-100 rounded-lg w-full flex justify-between items-center gap-5">
      <SearchInput/>

      <div className="flex gap-2 items-center">
        <div className="grid place-content-center h-[35px] w-[35px] rounded-full bg-white">
          <MdOutlineEmail size={17} />
        </div>
        <div className="grid relative place-content-center h-[35px] w-[35px] rounded-full bg-white">
          <GoBell size={17} />
          <div className="absolute top-0 right-0 bg-red-600 w-3 h-3 rounded-full"></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="grid place-content-center h-[35px] w-[35px] rounded-full bg-green-500">
            <FaUser size={17} color="white" />
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

export default Navbar;
