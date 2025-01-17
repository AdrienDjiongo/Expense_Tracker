"use client";
import Image from "next/image";
import { ChevronsUp, ChevronsDown, CirclePlus } from "lucide-react";
import Link from "next/link";

import { Montserrat } from "next/font/google";
import React from "react";
import { useState, useEffect } from "react";

const montserrat = Montserrat({
  subsets: ["latin"], // Include the required subsets
  weight: ["400"], // Choose the font weights you need
  style: ["normal"], // Optional: include italic styles
});

export default function Home() {
  const [balance, setBalance] = useState("loading...");
  const [amounts, setAmounts] = useState(["loading...", "loading..."]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(`http://localhost:5000/Transactions`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(`http://localhost:5000/Balance`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => setBalance(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(`http://localhost:5000/InOut`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => setAmounts(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className={`grid grid-cols-7 ${montserrat.className} `}>
      <div className="col-span-1  shadow-2xl   ">
        <div className="flex flex-col gap-4 my-10 px-4 ">
          <Link href="/" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg bg-[#3ec3d5] rounded-lg ">
              Home
            </p>{" "}
          </Link>

          <Link href="/Dashboard" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              Dashboard
            </p>
          </Link>
          <Link href="/Transactions" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              Transactions
            </p>{" "}
          </Link>

          <Link href="/" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              {" "}
              settings{" "}
            </p>{" "}
          </Link>
        </div>
      </div>
      <div className="col-span-6 bg-[rgba(247,247,250)] px-4 ">
        <div className="mt-20 mx-[20%] flex justify-between ">
          <div className="bg-[#41dc65] text-white border-2 border- rounded-lg px-3 py-5 w-fit h-fit font-bold shadow-md ">
            <p>Incomes this month</p>
            <p className=""> + {amounts[0]} xaf </p>
          </div>
          <div className="rounded-lg px-3 text-2xl py-6 bg-[#ffffffcc] w-fit -mt-10 h-fit font-bold shadow-md ">
            <p>Current balance</p>
            <p className=" text-[#3ec3d5] text-center "> {balance} xaf </p>
          </div>
          <div className="bg-[#ff5460] text-white  rounded-lg px-3 py-5 w-fit h-fit font-bold shadow-md ">
            <p>outcomes this month</p>
            <p className=" "> - {amounts[1]}xaf </p>
          </div>
        </div>

        <div className=" flex gap-3 flex-col mx-[20%] my-10  ">
          <div className="flex items-center justify-between">
            {" "}
            <p>Recent transactions...</p>{" "}
            <Link
              href="/NewTransaction"
              className="flex items-center gap-3 bg-[#3ec3d5a8] p-3 rounded-2xl  "
            >
              {" "}
              <span className="pt-1 ">new transaction</span>{" "}
              <CirclePlus
                color="white"
                size={30}
                strokeWidth={1.5}
                className="rounded-full drop-shadow-sm hover:cursor-pointer bg-[] left-1/2  "
              />
            </Link>{" "}
          </div>
          {transactions.slice(0, 4).map((transaction) => (
            <div
              key={`transaction-${transaction._id}`}
              className="flex my-1 flex-col gap-1"
            >
              <div className="bg-white px-6 py-2 shadow-md rounded-md flex justify-between ">
                <p>{transaction.description}</p>
                <div className="flex gap-2">
                  <p
                    className={`${
                      transaction.type == "outcome"
                        ? "text-[#ff5460]"
                        : "text-[#41dc65]"
                    } font-semibold`}
                  >
                    {transaction.type == "income" ? (
                      <span>+</span>
                    ) : (
                      <span>-</span>
                    )}
                    {transaction.price} xaf
                  </p>
                  {transaction.type == "outcome" ? (
                    <ChevronsDown color="#ff5460" />
                  ) : (
                    <ChevronsUp color="#62ff8ee7" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/Transactions ">
          {" "}
          <div className="bg-zinc-300 rounded-lg px-3 py-2 w-fit mx-auto mb-5 font-semibold -mt-4 ">
            view all...
          </div>{" "}
        </Link>
      </div>
    </div>
  );
}
