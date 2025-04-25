import React from "react";
import NavBar from "../layouts/NavBar";
import Table from "../components/Table";
import { motion } from "framer-motion";

function AnalyticsPage() {
  return (
    <div>
      <NavBar />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 1 }}
      >
        <div className="px-10 mt-5">
          <h1 className="text-2xl text-[#336B81]">Active Requests</h1>
          <Table />
        </div>
      </motion.div>
    </div>
  );
}

export default AnalyticsPage;
