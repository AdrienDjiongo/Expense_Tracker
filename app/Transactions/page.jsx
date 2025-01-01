"use client";
import React from "react";
import { useEffect, useState } from "react";
import { ChevronsUp, ChevronsDown, CirclePlus, Filter } from "lucide-react";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"], // Include the required subsets
  weight: ["400"], // Choose the font weights you need
  style: ["normal"], // Optional: include italic styles
});

function page() {
  const [transactions, setTransactions] = useState([]);

  console.log(new Date());

  let TransactionFilter =
    "type=income&minPrice=200&maxPrice=100000&afterDate=2024/12/30";

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

  const monthNamess = [
    "Janvier",
    "Fevrier",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juilet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre",
  ];

  console.log(new Date().toLocaleString().substr(0, 10));

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const formatDate = (dateStr) => {
      // Convert string to Date object
      const dateObj = new Date(dateStr);

      // Check if the conversion resulted in a valid date
      if (isNaN(dateObj)) {
        throw new Error("Invalid date format");
      }

      // Format the Date object as DD/MM/YYYY
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const year = dateObj.getFullYear();

      return `${day}/${month}/${year}`;
    };

    const yo = formatDate(transaction.date);
    const [day, month, year] = yo.split("/");
    const monthKey = `${month}/${year}`;

    const monthName = monthNamess[month - 1];

    const dateKey = yo;

    // Ensure the structure for the month exists
    if (!acc[monthKey]) {
      acc[monthKey] = {};
    }

    // Ensure the structure for the date exists
    if (!acc[monthKey][dateKey]) {
      acc[monthKey][dateKey] = [];
    }

    // Add the transaction to the corresponding date
    acc[monthKey][dateKey].push(transaction);

    return acc;
  }, {});

  return (
    <div
      className={`grid grid-cols-7  ${montserrat.className}   min-h-[100vh] `}
    >
      <div className="col-span-1  top-0 left-0  shadow-2xl   ">
        <div className="flex flex-col gap-4 my-16 px-4 ">
          <Link href="/" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              Home
            </p>{" "}
          </Link>

          <Link href="/" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              Dashboard
            </p>
          </Link>
          <Link href="/Transactions" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg bg-[#3ec3d5] rounded-lg ">
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
      <div className="col-span-6 bg-[#f7f7fa] px-4 ">
        <div className="flex justify-between px-6 py-4">
          <div className="rounded-lg px-2 py-4 text-center bg-[#ffffffcc] w-fit h-fit font-bold shadow-md ">
            <p>Current balance</p>
            <p className=" text-[#3ec3d5] "> 50200 xaf </p>
          </div>
          <div className="rounded-lg px-2 text-center bg-[#ffffffcc] w-fit h-fit font-bold shadow-md ">
            <p>this month</p>
            <div className="text-[#41dc65] flex text-sm  rounded-lg px-2 pt-1 w-fit h-fit font-semibold ">
              <ChevronsUp />
              <p className=""> 34000 xaf </p>
            </div>

            <div className="text-[#ff5460] flex text-sm  rounded-lg px-2 pb-1 w-fit h-fit font-semibold ">
              <ChevronsDown />
              <p className=""> 12000 xaf </p>
            </div>
          </div>
        </div>
        <Link href="/NewTransaction">
          {" "}
          <CirclePlus
            color="white"
            size={60}
            strokeWidth={0.8}
            className=" fixed bottom-0 rounded-full drop-shadow-sm mb-5 hover:cursor-pointer bg-[#3ec3d5a8] left-1/2  "
          />
        </Link>

        <div className="grid grid-cols-8 mx-10 pb-10 ">
          <div className="col-span-2 text-sm flex flex-col gap-3 ">
            <div className="flex justify-around text-zinc-500 text-base ">
              <p>Filter...</p>
              <Filter color="#3ec3d5" size={20} />
            </div>
            <div className="text-zinc-500  ">
              <p className="mx-auto underline text-[#3ec3d5]">by date</p>
              <div className="flex flex-col gap-1">
                {" "}
                <p>single date :</p>
                <p>OR</p>
                <p>from:</p> <p>to :</p>
                <p>none</p>{" "}
              </div>
            </div>
            <div className="text-zinc-500">
              <p className="mx-auto underline text-[#3ec3d5]">by statuts</p>
              <div className="flex flex-col gap-1">
                <p>Incomes </p>
                <p>Outcomes</p>
              </div>
            </div>
            <div className="text-zinc-500  ">
              <p className="mx-auto underline text-[#3ec3d5]">by categories</p>
              <div className="flex flex-col gap-1">
                {" "}
                <p>cat 1</p>
                <p>cat 2</p>
                <p>cat 3</p>
              </div>
            </div>
            <div className="text-zinc-500">
              <p className="mx-auto underline text-[#3ec3d5]">by amount</p>
              <div className="flex flex-col gap-1">
                <p>from:</p> <p>to :</p>
                <p>all</p>
              </div>
            </div>
          </div>

          <div className=" flex gap-3 flex-col col-span-6 mx-10    ">
            {Object.keys(groupedTransactions).length > 0 ? (
              <div>
                {Object.entries(groupedTransactions).map(([month, dates]) => (
                  <div key={`month-${month}`}>
                    {/* Month Header */}
                    <h2
                      style={{ marginTop: "20px", fontWeight: "bold" }}
                      className=" font-semibold text-2xl -ml-8 text-zinc-600 "
                    >
                      Mois de{" "}
                      {monthNamess[parseInt(month.split("/")[0], 10) - 1]}{" "}
                      {month.split("/")[1]} {/* Afficher l'année ici */}
                    </h2>
                    {Object.entries(dates).map(([date, transactions]) => (
                      <div key={`date-${date}`}>
                        {/* Date Header */}
                        <h3
                          style={{ marginTop: "10px" }}
                          className="text-zinc-500"
                        >
                          Date:{" "}
                          {date.substr(0, 2) +
                            " " +
                            monthNamess[parseInt(date.substr(3, 2)) - 1] +
                            " " +
                            date.substr(6, 4)}
                        </h3>
                        {/* List of Transactions for the Date */}
                        {transactions
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          ) // Sort by price from biggest to smallest
                          .map((transaction) => (
                            <div
                              key={`transaction-${transaction._id}`}
                              className="flex my-4 flex-col gap-3"
                            >
                              <div className="bg-white px-6 py-3 shadow-md rounded-md flex justify-between">
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
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p>Chargement des données...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
