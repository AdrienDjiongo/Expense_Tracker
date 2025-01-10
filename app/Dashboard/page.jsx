import React from "react";
import BarChart from "@/public/Barchart";
import CubicChart from "@/public/CubicChart";

const page = () => {
  return (
    <div className="w-1/3  mx-auto">
      <BarChart className="w-1/2 mx-auto"></BarChart>
      <CubicChart />
    </div>
  );
};

export default page;
