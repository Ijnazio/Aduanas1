import { useState } from "react";
import { useAuth } from "../lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Shield } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !role) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, password, role);
      
      if (!success) {
        toast({
          title: "Error de autenticación",
          description: "Usuario, contraseña o rol incorrecto",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Chilean Government Header */}
          <div className="flex justify-center items-center mb-6">
            <div className="bg-chile-blue text-white px-4 py-2 rounded-l-lg font-semibold">
              GOBIERNO DE
            </div>
            <div className="bg-chile-red text-white px-4 py-2 rounded-r-lg font-semibold">
              CHILE
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sistema de Modernización Aduanera
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Paso Fronterizo Pehuenche - Acceso Seguro
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese su usuario"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">Tipo de Usuario</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccione su rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funcionario">Funcionario Aduana</SelectItem>
                      <SelectItem value="turista">Turista</SelectItem>
                      <SelectItem value="sag">Fiscalizador SAG</SelectItem>
                      <SelectItem value="pdi">Oficial PDI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-chile-blue hover:bg-blue-700"
                disabled={isLoading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-xs text-gray-500 text-center flex items-center justify-center">
                <Shield className="mr-1 h-3 w-3" />
                Sistema seguro - Acceso solo para personal autorizado
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
