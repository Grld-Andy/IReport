import { Button } from "@/components/ui/button";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="w-screen overflow-x-hidden">
      <nav className="bg-white w-full p-5 fixed shadow-md flex justify-between">
        <div className="flex gap-2 items-center">
          <img src="/images/icon-alarmalade.png" className="w-5" />
          <p className="font-semibold text-lg">
            Incident<span className="text-green-700">CoMa</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-500 hover:bg-green-600">Register</Button>
          <Button className="" variant={"outline"}>
            Login
          </Button>
        </div>
      </nav>
      <div className="w-screen h-screen flex gap-10 items-center justify-center flex-col">
        <h1 className="text-[2.7em] leading-[50px] font-bold text-center">
          Incident control for the field
          <br /> in real time.
        </h1>
        <p className="px-[150px] text-center text-gray-900 text-md">
          SafeZone gives any high-risk operation ports, construction sites,
          factories, mines a single platform to report, dispatch, track, and
          resolve incidents before they escalate.
        </p>
        <div className="flex items-center w-full justify-center gap-5">
          <Button className="bg-green-500 hover:bg-green-600">Register your company</Button>
          <Button className="bg-green-500 hover:bg-green-600">Watch demo</Button>
        </div>
      </div>
      {/* <img
        className="h-5"
        src="https://incident.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fheropanels-slack-mobile.b768252d.png&w=1920&q=75&dpl=dpl_6fjRJEW1zLiCaE5oFztgLdby3F6S"
      /> */}
    </div>
  );
};

export default Page;
