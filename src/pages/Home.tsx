import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Wallet, BarChart3 } from "lucide-react";

const Home = () => {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="bg-primary py-24 px-6 text-center">
        <motion.h1
          className="text-5xl font-extrabold text-info mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Track Your Expenses Effortlessly
        </motion.h1>

        <motion.p
          className="text-lg max-w-xl mx-auto text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Stay in control of your money with smart charts, clean dashboards, and
          real-time insights powered by Firebase + React.
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/sign-up"
            className="px-6 py-3 bg-primary font-extrabold text-white rounded-xl shadow-md hover:bg-accent transition"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 border border-info text-info font-bold rounded-xl hover:bg-info hover:text-white transition"
          >
            Log In
          </Link>
        </motion.div>
      </section>

      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Expense Tracker?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <motion.div
            className="p-6 bg-white rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <PieChart className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Visual Charts</h3>
            <p className="text-gray-600">
              Visualize your spending with interactive graphs and breakdowns.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-white rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Wallet className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Manage Your Budget</h3>
            <p className="text-gray-600">
              Categorize expenses, set limits, and take control of your wallet.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-white rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <BarChart3 className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              See how your spending habits evolve with real-time analytics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section className="py-20 bg-gray-50 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">A Simple, Clean Dashboard</h2>

        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl h-72 flex items-center justify-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {/* Placeholder for dashboard preview */}
          Dashboard preview coming soon…
        </motion.div>

        <Link
          to="/sign-up"
          className="mt-10 inline-block px-8 py-3 bg-primary text-white rounded-xl shadow hover:bg-info font-extrabold transition"
        >
          Start Tracking Now
        </Link>
      </section>
    </div>
  )
}

export default Home