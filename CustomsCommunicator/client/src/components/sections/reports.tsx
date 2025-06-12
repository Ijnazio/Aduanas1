import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, FileSpreadsheet, BarChart3, PieChart } from "lucide-react";
import type { Statistics } from "@shared/schema";

interface ReportFilters {
  period: string;
  type: string;
  status: string;
}

export default function ReportsSection() {
  const [filters, setFilters] = useState<ReportFilters>({
    period: "today",
    type: "all",
    status: "all",
  });
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics/today"],
  });

  // Mock report data
  const reportData = [
    {
      date: "2024-01-15",
      entries: 247,
      exits: 189,
      vehicles: 89,
      rejections: 3,
    },
    {
      date: "2024-01-14",
      entries: 198,
      exits: 156,
      vehicles: 67,
      rejections: 1,
    },
    {
      date: "2024-01-13",
      entries: 223,
      exits: 201,
      vehicles: 75,
      rejections: 2,
    },
    {
      date: "2024-01-12",
      entries: 165,
      exits: 142,
      vehicles: 54,
      rejections: 0,
    },
  ];

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "Su reporte se está generando...",
    });
    // Simulate PDF export
    setTimeout(() => {
      toast({
        title: "Éxito",
        description: "Reporte PDF generado exitosamente",
      });
    }, 2000);
  };

  const handleExportExcel = () => {
    toast({
      title: "Exportando Excel",
      description: "Su reporte se está generando...",
    });
    // Simulate Excel export
    setTimeout(() => {
      toast({
        title: "Éxito",
        description: "Reporte Excel generado exitosamente",
      });
    }, 2000);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Generando Reporte",
      description: "Aplicando filtros seleccionados...",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h2>
        <p className="text-gray-600">
          Generación automática de reportes y análisis estadístico
        </p>
      </div>

      {/* Report Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <Select
                value={filters.period}
                onValueChange={(value) => setFilters({ ...filters, period: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Trámite
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="vehicles">Vehículos</SelectItem>
                  <SelectItem value="minors">Menores</SelectItem>
                  <SelectItem value="declarations">Declaraciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprobados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGenerateReport}
                className="w-full bg-chile-blue hover:bg-blue-700"
              >
                <Search className="mr-2 h-4 w-4" />
                Generar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Tráfico Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-16 w-16 mx-auto mb-2" />
                <p className="font-medium">Gráfico de tráfico diario</p>
                <p className="text-sm mt-1">
                  Entradas: {stats?.totalEntries || 0} | Salidas: {stats?.totalExits || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Trámite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <PieChart className="h-16 w-16 mx-auto mb-2" />
                <p className="font-medium">Distribución de trámites</p>
                <p className="text-sm mt-1">
                  Vehículos: {stats?.totalVehicles || 0} | Pendientes: {stats?.pendingReviews || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resumen de Actividades</CardTitle>
          <div className="flex space-x-2">
            <Button
              onClick={handleExportPDF}
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <FileText className="mr-1 h-4 w-4" />
              PDF
            </Button>
            <Button
              onClick={handleExportExcel}
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <FileSpreadsheet className="mr-1 h-4 w-4" />
              Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ingresos</TableHead>
                  <TableHead>Salidas</TableHead>
                  <TableHead>Vehículos</TableHead>
                  <TableHead>Rechazos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell className="font-medium">{row.date}</TableCell>
                    <TableCell>{row.entries}</TableCell>
                    <TableCell>{row.exits}</TableCell>
                    <TableCell>{row.vehicles}</TableCell>
                    <TableCell>{row.rejections}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
