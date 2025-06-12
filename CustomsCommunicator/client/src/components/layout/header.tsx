import { useAuth } from "../../lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      funcionario: "Funcionario Aduana",
      turista: "Turista",
      sag: "Fiscalizador SAG",
      pdi: "Oficial PDI",
    };
    return roleMap[role] || role;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <div className="bg-chile-blue text-white px-3 py-1 rounded-l text-sm font-semibold">
                GOB
              </div>
              <div className="bg-chile-red text-white px-3 py-1 rounded-r text-sm font-semibold">
                CL
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Sistema Aduanero - Paso Pehuenche
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user?.fullName}</span> -{" "}
              <span className="font-medium chile-blue">
                {user?.role ? getRoleDisplayName(user.role) : ""}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
