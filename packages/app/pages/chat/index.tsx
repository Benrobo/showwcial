import MainDashboardLayout from "../../components/Layout/mainDashboard";

export default function Chat() {
  return (
    <MainDashboardLayout activeTab="chat">
      <div className="w-full flex flex-col">
        <p className="text-white-100">CHAT HERE</p>
      </div>
    </MainDashboardLayout>
  );
}
