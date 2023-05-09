import React from "react";
import DashboardAnalytics from "../../components/Analytics";
import DashboardHeader from "../../components/Header/dashboardHeader";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import withAuth from "../../util/withAuth";

function Dashboard() {
  return (
    <MainDashboardLayout activeTab="dashboard">
      {/* <DashboardHeader /> */}
      {/* <DashboardAnalytics /> */}
    </MainDashboardLayout>
  );
}

export default withAuth(Dashboard);
