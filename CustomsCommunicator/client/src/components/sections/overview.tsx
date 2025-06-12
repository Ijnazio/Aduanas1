import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, ClipboardCheck, AlertTriangle, Circle } from "lucide-react";
import type { Statistics } from "@shared/schema";
import type { ActivityItem } from "../../types";

export default function OverviewSection() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics/today"],
  });

  // Mock recent activity data
  const recentActivity: ActivityItem[] = [
    {
      id: "1",
      message: "Turista ingresó - Documento validado",
      timestamp: "Hace 5 minutos",
      status: "success",
    },
    {
      id: "2",
      message: "Vehículo en revisión SAG",
      timestamp: "Hace 12 minutos",
      status: "warning",
    },
    {
      id: "3",
      message: "Alerta: Documentación incompleta",
      timestamp: "Hace 20 minutos",
      status: "error",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Panel Principal</h2>
        <p className="text-gray-600">Resumen de actividades del paso fronterizo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 chile-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalEntries || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vehículos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalVehicles || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardCheck className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trámites Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.pendingReviews || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.alerts || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Border Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0">
                    <Circle className={`h-2 w-2 ${getStatusColor(activity.status)}`} />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Paso Fronterizo</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
              alt="Border crossing checkpoint"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estado Operacional</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <Circle className="h-2 w-2 text-green-400 mr-1" />
                  Operativo
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo de Espera</span>
                <span className="text-sm font-medium text-gray-900">15-20 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Carriles Habilitados</span>
                <span className="text-sm font-medium text-gray-900">4 de 6</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
