import type { User } from "firebase/auth";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { auth, database } from "../database/config";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { ChartNoAxesCombined, ChartColumnDecreasing } from "lucide-react";
import { PieChartWithCustomizedLabel } from "../components/ChartLabel";


const usePieDataFromTransactions = (transactions: Transaction[]) =>
   useMemo(() => {
     const map = new Map<string, number>();
     transactions
       .filter((t) => t.type === "expense")
       .forEach((t) => {
         const name = t.category ?? "Other";
         map.set(name, (map.get(name) ?? 0) + t.amount);
       });
     return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}, [transactions]);

type ExpenseFormData = {
  category: string;
  amount: number;
  date: number;
};

type IncomeData = {
  income: number;
  date: number;
};

export type Transaction = {
  type: "income" | "expense";
  amount: number;
  date: number;
  category?: string;
};

const categories = [
  "Food",
  "Transportation",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Investments",
  "Education",
  "Travel",
  "Other",
];

const Dashboard = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<
    { name: string; amount: number; date: number }[]
  >([]);
  const [user, setUser] = useState<User | null>(null);
  const [income, setIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const pieData = usePieDataFromTransactions(transactions);
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  const getBudget = () => {
    return collection(database, "budgets");
  };

  const addIncome = async (user: User, incomeAmount: number) => {
    try {
      const budgetRef = await doc(getBudget(), user.uid);
      await updateDoc(budgetRef, {
        incomes: arrayUnion({ income: incomeAmount, date: Date.now() }),
      });
      toast.success("Add Income Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error: any) {
      if (error.code === "not-found") {
        const budgetRef = await doc(getBudget(), user.uid);
        await setDoc(budgetRef, {
          incomes: arrayUnion({ income: incomeAmount, date: Date.now() }),
        });
        toast.success("Set Income Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        console.error("Error setting income: ", error);
        throw new Error("Failed to set income");
      }
    }
  };

  const addNewBudget = async (user: User, data: ExpenseFormData) => {
    try {
      const budgetRef = await doc(getBudget(), user.uid);
      await updateDoc(budgetRef, {
        expenses: arrayUnion({
          category: data.category,
          amount: data.amount,
          date: data.date,
          createdAt: data.date,
        }),
      });
      toast.success("add new Expense Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error: any) {
      if (error.code === "not-found") {
        const budgetRef = await doc(getBudget(), user.uid);
        await setDoc(budgetRef, {
          expenses: [
            {
              category: data.category,
              amount: data.amount,
              date: data.date,
              createdAt: data.date,
            },
          ],
        });
        toast.success("Create Expense Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        console.error("Error adding expense: ", error);
        throw new Error("Failed to add expense");
      }
    }
  };

  const deleteTransaction = async (user: User, t: Transaction) => {
    try {
      const budgetRef = doc(getBudget(), user.uid);
      const docSnap = await getDoc(budgetRef);
      if (!docSnap.exists()) return;

      const docData = docSnap.data();
      const updatedData: any = {};

      if (t.type === "expense") {
        const expensesData: ExpenseFormData[] = docData.expenses ?? [];
        const filtered = expensesData.filter(
          (e) =>
            !(
              e.date === t.date &&
              e.amount === t.amount &&
              e.category === t.category
            )
        );
        updatedData.expenses = filtered;
      } else {
        const incomes: IncomeData[] = docData.incomes ?? [];
        const filtered = incomes.filter(
          (i) => !(i.date === t.date && i.income === t.amount)
        );
        updatedData.incomes = filtered;
      }

      await updateDoc(budgetRef, updatedData);
      toast.success("Transaction deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (!user) return;
    const docRef = doc(database, "budgets", user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setData([]);
          setTotalExpenses(0);
          setIncome(0);
          setTransactions([]);
          return;
        }
        const docData = docSnap.data();
        const expensesData: ExpenseFormData[] = docData.expenses ?? [];
        setTotalExpenses(expensesData.reduce((acc, e) => acc + e.amount, 0));
        setData(
          expensesData.map((exp) => ({
            name: exp.category,
            amount: exp.amount,
            date: exp.date,
          }))
        );
        const incomes: IncomeData[] = docData.incomes ?? [];
        setIncome(incomes.reduce((acc, i) => acc + i.income, 0));
        const txs: Transaction[] = [
          ...expensesData.map((e) => ({
            type: "expense" as const,
            amount: e.amount,
            date: e.date,
            category: e.category,
          })),
          ...incomes.map((i) => ({
            type: "income" as const,
            amount: i.income,
            date: i.date,
          })),
        ];
        txs.sort((a, b) => b.date - a.date);
        setTransactions(txs);
      },
      (err) => {
        console.error("Budget snapshot error:", err);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const handleSetIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeInput = (e.target as HTMLFormElement).elements.namedItem(
      "income-amount"
    ) as HTMLInputElement;
    const incomeAmount = incomeInput ? Number(incomeInput.value) : 0;
    if (user) {
      addIncome(user, incomeAmount);
      incomeInput.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ExpenseFormData = {
      category: category ? category : "Other",
      amount: amount ? Number(amount) : 0,
      date: date ? Date.parse(date) : Date.now(),
    };
    addNewBudget(user!, data);
    setCategory("");
    setAmount(0);
    setDate("");
    setError("");
  };

  return (
    <div className="mt-20 p-4">
      {user ? (
        <div>
          <h1 className="text-2xl text-primary-content">
            Dashboard{" "}
            <span className="text-2xl text-success font-extrabold">
              {user.displayName}
            </span>{" "}
          </h1>
          <div className="flex flex-col md:flex-row mt-6 gap-6">
            <section className="budget-form-section w-full md:w-[50%] p-1 rounded-lg shadow gap-6 flex flex-col">
              <form
                onSubmit={handleSetIncome}
                className="flex flex-col gap-2 w-full"
              >
                <h2 className="text-xl font-bold mb-4">Set new Income</h2>
                <div className="mb-4">
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="income-amount"
                  >
                    Income Amount
                  </label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg"
                    type="number"
                    id="income-amount"
                    placeholder="e.g., 3000.00"
                    min="0.5"
                    step="0.01"
                  />
                </div>
                <button
                  className="px-4 py-2 bg-success text-white rounded-lg hover:bg-info transition"
                  type="submit"
                >
                  Set Income
                </button>
              </form>
              <form
                className="flex flex-col gap-4 w-full"
                onSubmit={handleSubmit}
              >
                <h2 className="text-xl font-bold">Add new Expense</h2>
                {error && (
                  <p className="text-red-600 bg-red-100 p-2 rounded-lg font-medium">
                    {error}
                  </p>
                )}
                <div>
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="expense-name"
                  >
                    Expense Name
                  </label>

                  <select
                    defaultValue={categories[length - 1]}
                    className="select select-ghost border-white w-full px-3 py-2 border rounded-lg"
                    value={category}
                    id="expense-name"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" disabled>
                      expense Categorie
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="expense-amount"
                  >
                    Amount
                  </label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg"
                    type="number"
                    id="expense-amount"
                    placeholder="e.g., 50.00"
                    min="0.5"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <button
                  className="px-4 py-2 bg-error text-white rounded-lg hover:bg-primary/90 transition"
                  type="submit"
                >
                  Add Expense
                </button>
              </form>
            </section>
            <section className="w-full md:w-[50%] p-1 rounded-lg shadow">
              <div className="flex flex-row justify-around mb-4">
                <div className="bg-success font-extrabold flex flex-row items-center justify-around w-full p-2 mr-2 rounded-lg text-center max-w-100">
                  <div>
                    <h2>Current Solde</h2>
                    <p>$ {income - totalExpenses} </p>
                  </div>
                  <div>
                    <ChartNoAxesCombined />
                  </div>
                </div>
                <div className="bg-error w-full p-2 mr-2 rounded-lg text-center flex flex-row justify-around items-center font-extralight max-w-100">
                  <div>
                    <h2>Expenses</h2>
                    <p> $ {totalExpenses}</p>
                  </div>
                  <div>
                    <ChartColumnDecreasing />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                 <LineChart
                style={{ width: "100%", aspectRatio: 1.618, maxWidth: 700 }}
                responsive
                data={data}
                  >
                <CartesianGrid />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                </LineChart>
                {pieData.length > 0 && <PieChartWithCustomizedLabel pieData={pieData} />}
              </div>
            </section>
          </div>
          {transactions.length === 0 ? (
            <p className="text-xl text-accent">No expenses recorded yet.</p>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4 text-info mt-10">
                Recent Expenses
              </h2>
              <ul>
                {transactions.map((t, index) => (
                  <motion.li
                    key={index}
                    className="mb-2 p-4 border rounded-lg shadow-sm flex justify-between items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <p className="font-semibold">
                        {t.type === "income"
                          ? "Income"
                          : t.category ?? "Expense"}
                      </p>
                      <p className="text-sm text-muted">
                        {new Date(t.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div
                        className={
                          t.type === "income"
                            ? "text-green-600 font-bold text-lg md:text-2xl"
                            : "text-red-600 font-bold text-sm md:text-xl"
                        }
                      >
                        {t.type === "income" ? "+" : "-"} ${t.amount.toFixed(2)}
                      </div>
                      <button
                        onClick={() => user && deleteTransaction(user, t)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </div>
      ) : (
        <Navigate to="/login" replace></Navigate>
      )}
    </div>
  );
};

export default Dashboard;
