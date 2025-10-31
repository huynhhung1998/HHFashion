import React from "react";
import StatCard from "./StatCard";
import TransactionChart from "./TransactionChart";
import UserTable from "./UserTable";
import { Users, CreditCard, DollarSign } from "lucide-react";

const DashboardLayout = () => {
    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Stat cards */}
            <div >
                <StatCard/>
               
            </div>

            {/* Chart + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionChart />
                <UserTable />
            </div>
        </div>
    );
};

export default DashboardLayout;
