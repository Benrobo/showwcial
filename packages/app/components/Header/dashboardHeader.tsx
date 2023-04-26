import next from "next";
import React from "react";

function DashboardHeader() {
  return (
    <div className="w-full h-[20em] flex items-start justify-center bg-dark-200 px-1 py-[3rem] ">
      <div className="w-full px-[2em] flex items-start justify-between">
        <div className="left w-auto flex flex-col items-start justify-start gap-5">
          <p className="text-white-300 text-[13px] ">
            Overview / <span className="text-white-100 pp-SB">Ananlytics</span>
          </p>
          <p className="text-white-200 text-4xl">
            Welcome Back, <span className="pp-SB text-white-100">JOHN DOE</span>
          </p>
          <p className="text-white-300 text-[13px] ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam,
            ullam?
          </p>
        </div>
        <div className="right w-auto flex flex-col items-start justify-start gap-5">
          <p className="text-white-300 text-[13px] ">
            Tuesday 17, October 2023
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
