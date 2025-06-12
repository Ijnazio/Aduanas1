import { useState } from "react";
import { useAuth } from "../lib/auth";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import OverviewSection from "../components/sections/overview";
import MinorsSection from "../components/sections/minors";
import VehiclesSection from "../components/sections/vehicles";
import DeclarationsSection from "../components/sections/declarations";
import ControlSection from "../components/sections/control";
import ReportsSection from "../components/sections/reports";
import HelpSection from "../components/sections/help";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const { user } = useAuth();

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "minors":
        return <MinorsSection />;
      case "vehicles":
        return <VehiclesSection />;
      case "declarations":
        return <DeclarationsSection />;
      case "control":
        return <ControlSection />;
      case "reports":
        return <ReportsSection />;
      case "help":
        return <HelpSection />;
      default:
        return <OverviewSection />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-screen">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
