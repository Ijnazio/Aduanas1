import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, AlertTriangle, Ban } from "lucide-react";
import type { FoodItem } from "../../types";

const declarationFormSchema = z.object({
  foodItems: z.array(z.string()),
  hasPets: z.boolean(),
  petType: z.string().optional(),
  petCount: z.number().optional(),
});

type DeclarationFormData = z.infer<typeof declarationFormSchema>;

const foodItems: FoodItem[] = [
  { name: "Frutas frescas", allowed: false, restricted: true, prohibited: false },
  { name: "Verduras", allowed: false, restricted: true, prohibited: false },
  { name: "Productos lácteos", allowed: true, restricted: false, prohibited: false },
  { name: "Carnes procesadas", allowed: false, restricted: true, prohibited: false },
  { name: "Productos enlatados", allowed: true, restricted: false, prohibited: false },
  { name: "Semillas", allowed: false, restricted: false, prohibited: true },
];

export default function DeclarationsSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState<string[]>([]);
  const [showPetDetails, setShowPetDetails] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DeclarationFormData>({
    resolver: zodResolver(declarationFormSchema),
    defaultValues: {
      foodItems: [],
      hasPets: false,
      petType: "",
      petCount: 1,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: DeclarationFormData) => {
      const petDetails = data.hasPets
        ? { type: data.petType, count: data.petCount }
        : null;

      const response = await apiRequest("POST", "/api/declarations", {
        foodItems: data.foodItems,
        hasPets: data.hasPets,
        petDetails,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Declaración enviada correctamente",
      });
      form.reset();
      setSelectedFoodItems([]);
      setShowPetDetails(false);
      queryClient.invalidateQueries({ queryKey: ["/api/statistics/today"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al enviar la declaración",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: DeclarationFormData) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFoodItemChange = (itemName: string, checked: boolean) => {
    const newItems = checked
      ? [...selectedFoodItems, itemName]
      : selectedFoodItems.filter((item) => item !== itemName);
    
    setSelectedFoodItems(newItems);
    form.setValue("foodItems", newItems);
  };

  const handlePetToggle = (checked: boolean) => {
    setShowPetDetails(checked);
    form.setValue("hasPets", checked);
    if (!checked) {
      form.setValue("petType", "");
      form.setValue("petCount", 1);
    }
  };

  const getItemIcon = (item: FoodItem) => {
    if (item.prohibited) {
      return <Ban className="h-4 w-4 text-red-600" />;
    }
    if (item.restricted) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (item.allowed) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-gray-400" />;
  };

  const getRestrictedItems = () => {
    return selectedFoodItems
      .map((itemName) => foodItems.find((item) => item.name === itemName))
      .filter((item) => item && (item.restricted || item.prohibited));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Declaración de Alimentos y Mascotas
        </h2>
        <p className="text-gray-600">
          Declaración jurada para el ingreso de productos alimentarios y animales
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Productos Alimentarios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foodItems.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.name}
                        checked={selectedFoodItems.includes(item.name)}
                        onCheckedChange={(checked) =>
                          handleFoodItemChange(item.name, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={item.name}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {item.name}
                      </Label>
                      {getItemIcon(item)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Mascotas y Animales
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPets"
                      checked={showPetDetails}
                      onCheckedChange={handlePetToggle}
                    />
                    <Label htmlFor="hasPets" className="text-sm text-gray-700 cursor-pointer">
                      Viaja con mascotas
                    </Label>
                  </div>

                  {showPetDetails && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="petType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Animal</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="perro">Perro</SelectItem>
                                  <SelectItem value="gato">Gato</SelectItem>
                                  <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="petCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número de Animales</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={1}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300"
                alt="Official documents and paperwork"
                className="w-full h-40 object-cover rounded-lg"
              />

              {getRestrictedItems().length > 0 && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-yellow-900">
                          Productos Detectados con Restricciones
                        </h4>
                        <div className="text-sm text-yellow-800 mt-2 space-y-1">
                          {getRestrictedItems().map((item) => (
                            <p key={item?.name}>
                              • {item?.name}:{" "}
                              {item?.prohibited
                                ? "Producto prohibido"
                                : "Requiere inspección SAG"}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setSelectedFoodItems([]);
                    setShowPetDetails(false);
                  }}
                  disabled={isSubmitting}
                >
                  Limpiar
                </Button>
                <Button
                  type="submit"
                  className="bg-chile-blue hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Declaración"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
