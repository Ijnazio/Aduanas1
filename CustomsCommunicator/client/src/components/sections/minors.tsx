import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Upload, CheckCircle, Clock, Info } from "lucide-react";

const minorFormSchema = z.object({
  minorName: z.string().min(1, "Nombre es requerido"),
  minorDocument: z.string().min(1, "Documento es requerido"),
  birthDate: z.string().min(1, "Fecha de nacimiento es requerida"),
  applicationType: z.enum(["salida", "entrada"], {
    required_error: "Tipo de trámite es requerido",
  }),
  authorizationFile: z.string().optional(),
});

type MinorFormData = z.infer<typeof minorFormSchema>;

export default function MinorsSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MinorFormData>({
    resolver: zodResolver(minorFormSchema),
    defaultValues: {
      minorName: "",
      minorDocument: "",
      birthDate: "",
      applicationType: undefined,
      authorizationFile: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MinorFormData) => {
      const response = await apiRequest("POST", "/api/minors", {
        ...data,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Solicitud de menor procesada correctamente",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/statistics/today"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al procesar la solicitud",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: MinorFormData) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Menores de Edad</h2>
        <p className="text-gray-600">
          Formulario para autorización de salida/entrada de menores
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="minorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo del Menor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ingrese el nombre completo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minorDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUT/Pasaporte</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12.345.678-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Trámite</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="salida">Salida del país</SelectItem>
                          <SelectItem value="entrada">Entrada al país</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Autorización Notarial
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arrastre el documento aquí o haga clic para seleccionar
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-chile-blue text-white hover:bg-blue-700"
                  >
                    Seleccionar Archivo
                  </Button>
                </div>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 chile-blue mr-2" />
                    <h4 className="font-medium text-gray-900">Estado de Validación</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        Documento cargado correctamente
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-700">Validación en proceso</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-chile-blue hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Procesando..." : "Procesar Solicitud"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
