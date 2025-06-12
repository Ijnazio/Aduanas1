import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { UserCircle, Check, X, Pause, Save } from "lucide-react";
import type { ReviewItem } from "../../types";

export default function ControlSection() {
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [observations, setObservations] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock pending reviews data
  const pendingReviews: ReviewItem[] = [
    {
      id: 1,
      applicantName: "Juan Pérez",
      document: "12.345.678-9",
      type: "Vehículo: AA-BB-12",
      description: "Declaración: Frutas frescas, productos lácteos",
      priority: "medium",
      timeInQueue: "15 min",
      status: "pending",
    },
    {
      id: 2,
      applicantName: "María González",
      document: "AB123456",
      type: "Con menor de edad",
      description: "Documentación incompleta para menor",
      priority: "urgent",
      timeInQueue: "8 min",
      status: "pending",
    },
  ];

  const updateReviewMutation = useMutation({
    mutationFn: async ({ status, reviewId }: { status: string; reviewId: number }) => {
      const response = await apiRequest("PATCH", `/api/reviews/${reviewId}`, {
        status,
        observations,
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      const statusMessages: { [key: string]: string } = {
        approved: "Revisión aprobada correctamente",
        rejected: "Revisión rechazada",
        requires_inspection: "Marcado para inspección adicional",
      };

      toast({
        title: "Éxito",
        description: statusMessages[variables.status] || "Estado actualizado",
      });

      setObservations("");
      setSelectedReview(null);
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/pending"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al actualizar la revisión",
        variant: "destructive",
      });
    },
  });

  const saveObservationsMutation = useMutation({
    mutationFn: async () => {
      if (!selectedReview) return;
      
      const response = await apiRequest("PATCH", `/api/reviews/${selectedReview.id}`, {
        observations,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Observaciones guardadas",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al guardar observaciones",
        variant: "destructive",
      });
    },
  });

  const handleReviewAction = (status: string) => {
    if (!selectedReview) return;
    updateReviewMutation.mutate({ status, reviewId: selectedReview.id });
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };

    const labels = {
      low: "Baja",
      medium: "Pendiente",
      high: "Alta",
      urgent: "Urgente",
    };

    return (
      <Badge className={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Control SAG/PDI</h2>
        <p className="text-gray-600">
          Panel de control y revisión para funcionarios especializados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Reviews */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revisiones Pendientes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {pendingReviews.map((review) => (
                  <div
                    key={review.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedReview?.id === review.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <UserCircle className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {review.applicantName}
                          </h4>
                          <p className="text-sm text-gray-600">{review.document}</p>
                          <p className="text-xs text-gray-500">{review.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(review.priority)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="chile-blue hover:text-blue-700"
                        >
                          Revisar
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{review.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Prioridad: {review.priority} | Tiempo en cola: {review.timeInQueue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Panel de Control</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200"
                alt="Customs officers at work"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <Button
                  onClick={() => handleReviewAction("approved")}
                  disabled={!selectedReview || updateReviewMutation.isPending}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Aprobar Revisión
                </Button>
                <Button
                  onClick={() => handleReviewAction("rejected")}
                  disabled={!selectedReview || updateReviewMutation.isPending}
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Rechazar
                </Button>
                <Button
                  onClick={() => handleReviewAction("requires_inspection")}
                  disabled={!selectedReview || updateReviewMutation.isPending}
                  className="w-full bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Requiere Inspección
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Registre sus observaciones aquí..."
                className="mb-3"
              />
              <Button
                onClick={() => saveObservationsMutation.mutate()}
                disabled={!observations.trim() || saveObservationsMutation.isPending}
                className="w-full bg-chile-blue hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar Observación
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
