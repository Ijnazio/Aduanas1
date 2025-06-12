import { cn } from "@/lib/utils";
import {
  BarChart3,
  Car,
  Baby,
  ClipboardList,
  HelpCircle,
  Search,
  Gauge,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: "overview", label: "Panel Principal", icon: Gauge },
  { id: "minors", label: "Menores de Edad", icon: Baby },
  { id: "vehicles", label: "Vehículos", icon: Car },
  { id: "declarations", label: "Declaraciones", icon: ClipboardList },
  { id: "control", label: "Control SAG/PDI", icon: Search },
  { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "help", label: "Ayuda", icon: HelpCircle },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "nav-link w-full text-left",
                    activeSection === item.id ? "active" : ""
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
