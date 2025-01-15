const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://adriendjiongo:SbrQU7WjGVmtc6JV@cluster0.msgjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connection successful!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Transaction Model
const Transaction = mongoose.model("Transaction", {
  id: Number,
  description: String,
  price: Number,
  category: String,
  type: String,
  date: Date,
  createdAt: Date,
});

// Routes
app.get("/Transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/Balance", async (req, res) => {
  try {
    const TotalIncomesEver = await Transaction.aggregate([
      {
        $match: { type: "income" }, // Filter for type 'income'
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" }, // Sum the 'price' field
        },
      },
    ]);
    const TotalOutcomesEver = await Transaction.aggregate([
      {
        $match: { type: "outcome" }, // Filter for type 'income'
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" }, // Sum the 'price' field
        },
      },
    ]);
    const totalIn = TotalIncomesEver[0]?.totalPrice || 0;
    const totalOut = TotalOutcomesEver[0]?.totalPrice || 0;

    res.json(totalIn - totalOut);
  } catch (error) {
    console.error("Error calculating income total price:", error);
  }
});

app.get("/InOut", async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  try {
    const IncomesOfThisMonth = await Transaction.aggregate([
      {
        $match: {
          type: "income",
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
        },
      },
    ]);
    const OutcomesOfThisMonth = await Transaction.aggregate([
      {
        $match: {
          type: "outcome",
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
        },
      },
    ]);

    res.json([
      IncomesOfThisMonth[0]?.totalPrice || 0,
      OutcomesOfThisMonth[0]?.totalPrice || 0,
    ]);
  } catch (error) {
    console.error("Error calculating monthly income total:", error);
  }
});

app.get("/filteredTransactions", async (req, res) => {
  try {
    const { type, minPrice, maxPrice, afterDate, beforeDate } = req.query;
    const query = {};

    // Date range filter
    if (afterDate || beforeDate) {
      const dateRange = {};
      if (afterDate) {
        const startDate = new Date(afterDate);
        if (!isNaN(startDate)) {
          dateRange.$gte = startDate;
        } else {
          return res.status(400).json({ message: "Invalid afterDate format" });
        }
      }
      if (beforeDate) {
        const endDate = new Date(beforeDate);
        if (!isNaN(endDate)) {
          dateRange.$lte = endDate;
        } else {
          return res.status(400).json({ message: "Invalid beforeDate format" });
        }
      }
      query.date = dateRange; // Add the date range filter
    }

    // Type filter
    if (type) query.type = type;

    // Price range filter
    if (minPrice && maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    // Fetch and sort transactions
    const incomeTransactions = await Transaction.find(query).sort({ date: -1 });
    res.json(incomeTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/DashboardStats", async (req, res) => {
  try {
    const incomes = await Transaction.find({ type: "income" })
      .sort({ createdAt: 1 }) // Sort by createdAt ascending
      .select("price description createdAt -_id"); // Select only price and createdAt

    for (let i = 1; i < incomes.length; i++) {
      incomes[i].price = incomes[i].price + incomes[i - 1].price;
    }

    const outcomes = await Transaction.find({ type: "outcome" })
      .sort({ createdAt: 1 }) // Sort by createdAt ascending
      .select("price description createdAt -_id"); // Select only price and createdAt

    for (let i = 1; i < outcomes.length; i++) {
      outcomes[i].price = outcomes[i].price + outcomes[i - 1].price;
    }

    res.json([incomes, outcomes]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
app.get("/Transaction/outcomes", async (req, res) => {
  try {
    const incomes = await Transaction.find({ type: "outcome" })
      .sort({ createdAt: 1 }) // Sort by createdAt ascending
      .select("price description createdAt -_id"); // Select only price and createdAt

    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/Transactions", async (req, res) => {
  try {
    const { id, description, price, type, category, date } = req.body;
    const createdate = new Date();
    // const date = new Date();
    // Function to convert a DD/MM/YYYY string to a Date object
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
    };

    const transaction = new Transaction({
      id: id,
      description: description,
      price: price,
      type: type,
      category: category,
      createdAt: new Date(),
      date: parseDate(date),
    });
    const savedTransaction = await transaction.save();
    res.status(201).json("savedTransaction");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/*app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      todo.completed = !todo.completed;
      const updatedTodo = await todo.save();
      res.json(updatedTodo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});n*/

app.delete("/Transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      id: req.params.id,
    });
    if (transaction) {
      res.json({ message: "Transaction deleted" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
