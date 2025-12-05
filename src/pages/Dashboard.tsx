import type { User } from "firebase/auth"
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import { database } from "../database/config";



type userProps ={
    user: User | null,
}

const data = [
  {
    name: 'Page A',
    uv: 400,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 300,
    pv: 4567,
    amt: 2400,
  },
  {
    name: 'Page C',
    uv: 320,
    pv: 1398,
    amt: 2400,
  },
  {
    name: 'Page D',
    uv: 200,
    pv: 9800,
    amt: 2400,
  },
  {
    name: 'Page E',
    uv: 278,
    pv: 3908,
    amt: 2400,
  },
  {
    name: 'Page F',
    uv: 189,
    pv: 4800,
    amt: 2400,
  },
  {
    name: 'Page G',
    uv: 189,
    pv: 10800,
    amt: 2400,
  },
];


type ExpenseFormData ={
  category: string;
  amount: number;
  date: number;
}
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


const Dashboard = ({user}: userProps) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const [expenses, setExpenses] = useState<ExpenseFormData[]>([]);


  const getBudget = () =>{
    return collection(database, 'budgets');
  }

  const addNewBudget= async (user:User, data:ExpenseFormData) =>{
    try {
      const budgetRef = await doc(getBudget(), user.uid);
      await updateDoc(budgetRef, {
        expenses: arrayUnion({
          category: data.category,
          amount: data.amount,
          date: data.date,
          createdAt: data.date
        })
      });
    } catch (error: any) {
      if (error.code === 'not-found') {
        const budgetRef = await doc(getBudget(), user.uid);
        await setDoc(budgetRef, {
          expenses: [{
            category: data.category,
            amount: data.amount,
            date: data.date,
            createdAt: data.date
          }]
        });
      }else{
        console.error("Error adding expense: ", error);
        throw new Error("Failed to add expense");
      }
    }
  }

const fetchUserExpenses = async (user: User) => {
  try {
    const budgetRef = doc(database, "budgets", user.uid);
    const docSnap = await getDoc(budgetRef);
    if (!docSnap.exists()) {
      return [];
    }
    const data = docSnap.data();
    const expenses = data.expenses ?? [];
    return expenses;
  } catch (err) {
    return [];
    console.error("Error fetching user expenses: ", err);
    throw new Error("Failed to fetch expenses");
  }
};



   useEffect( () => {
    if (!user) return;
    const loadExpenses = async () => {
      try {
        const dataRef = await fetchUserExpenses(user);
        const data = dataRef as ExpenseFormData[];
        setExpenses(data);
      } catch (err) {
        return [];
        console.error("Error fetching expenses:", err);
      }
    };
    loadExpenses();
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ExpenseFormData = {
      category: category ? category : "Other",
      amount: amount ? Number(amount) : 0,
      date : date ? Date.parse(date) : Date.now(),
    };
    addNewBudget(user!, data);
    setCategory("");
    setAmount(0);
    setDate("");
    setError("");
  };

  return (
    <div className="mt-20 p-4">
      {user? (
        <div>
          <h1 className="text-2xl text-primary-content">Dashboard {user.displayName}</h1>
          <div className="flex flex-col md:flex-row mt-6 gap-8">
            <section className="budget-form-section w-full md:w-3/3 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
              <form className="flex flex-col gap-4 max-w-sm" onSubmit={handleSubmit}>
                {error && (
                    <p className="text-red-600 bg-red-100 p-2 rounded-lg font-medium">
                      {error}
                    </p>
                  )}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="expense-name">Expense Name</label>
                  
                  <select className="select select-ghost border-white w-full px-3 py-2 border rounded-lg" value={category} id="expense-name" onChange={(e) => setCategory(e.target.value)}>
                    <option disabled selected>expense Categorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="expense-amount">Amount</label>
                  <input className="w-full px-3 py-2 border rounded-lg" type="number" id="expense-amount" placeholder="e.g., 50.00" min="0" step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition" type="submit">Add Expense</button>
              </form>
            </section>
            <section className="w-full">
              <h2 className="text-xl font-bold mb-4">Your Spending Over Time</h2>
              <p className="mb-6 text-gray-600">Analyze your expenses with the interactive chart below.</p>
              <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={data}>
                  <CartesianGrid />
                  <Line dataKey="pv" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Legend />
              </LineChart>
            </section>
          </div>
            {expenses.length === 0 ? (
              <p className="text-xl text-accent">No expenses recorded yet.</p>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4 text-info mt-10">Recent Expenses</h2>
                <ul>
                  {expenses.map((expense, index) => (
                    <li key={index} className="mb-2 p-4 border rounded-lg shadow-sm">
                      <p><strong>Category:</strong> {expense.category}</p>
                      <p><strong>Amount:</strong> ${expense.amount}</p>
                      <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
        ):(
          <Navigate to="/login" replace></Navigate>
        )}
    </div>
  )
}

export default Dashboard