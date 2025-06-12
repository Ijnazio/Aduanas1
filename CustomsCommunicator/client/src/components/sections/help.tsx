import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, Clock, FileText, PlayCircle } from "lucide-react";

export default function HelpSection() {
  const faqs = [
    {
      question: "¿Cómo proceso la salida de un menor?",
      answer: "Para procesar la salida de un menor, debe cargar la autorización notarial en el formulario correspondiente y esperar la validación automática del sistema.",
    },
    {
      question: "¿Qué documentos necesito para vehículos?",
      answer: "Se requiere la patente, datos del vehículo, información del propietario y el tipo de trámite (entrada o salida temporal).",
    },
    {
      question: "¿Cómo generar reportes?",
      answer: "Vaya a la sección de Reportes, seleccione los filtros deseados y haga clic en 'Generar'. Podrá exportar en PDF o Excel.",
    },
    {
      question: "¿Qué productos están prohibidos en el paso fronterizo?",
      answer: "Las semillas están completamente prohibidas. Frutas frescas, verduras y carnes procesadas requieren inspección SAG. Consulte la lista completa en la sección de Declaraciones.",
    },
    {
      question: "¿Cómo funciona el control SAG/PDI?",
      answer: "Los funcionarios SAG y PDI pueden revisar las solicitudes pendientes, aprobar, rechazar o marcar para inspección adicional desde el panel de control especializado.",
    },
  ];

  const tutorials = [
    {
      title: "Introducción al Sistema",
      duration: "5:30 min",
      description: "Aprenda los conceptos básicos del sistema aduanero",
    },
    {
      title: "Gestión de Vehículos",
      duration: "8:15 min",
      description: "Proceso completo de trámites vehiculares",
    },
    {
      title: "Control de Menores",
      duration: "6:45 min",
      description: "Validación de documentos y autorizaciones",
    },
    {
      title: "Generación de Reportes",
      duration: "4:20 min",
      description: "Cómo crear y exportar reportes estadísticos",
    },
  ];

  const resources = [
    { name: "Manual de Usuario (PDF)", href: "#" },
    { name: "Procedimientos SAG", href: "#" },
    { name: "Formularios Oficiales", href: "#" },
    { name: "Actualizaciones del Sistema", href: "#" },
    { name: "Normativa Aduanera", href: "#" },
    { name: "Contactos de Emergencia", href: "#" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Centro de Ayuda</h2>
        <p className="text-gray-600">
          Guías y documentación para el uso del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Tutorials Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tutoriales en Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <PlayCircle className="h-12 w-12 chile-blue mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">
                      {tutorial.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {tutorial.description}
                    </p>
                    <p className="text-xs text-gray-500">{tutorial.duration}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contacto Técnico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 chile-blue mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">+56 2 2345 6789</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 chile-blue mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">soporte@aduana.cl</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 chile-blue mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">24/7 disponible</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.href}
                    className="flex items-center text-sm chile-blue hover:text-blue-700 transition-colors"
                  >
                    <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                    {resource.name}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Servidor Principal</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operativo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Base de Datos</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operativo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sistema Integrado</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Mantenimiento
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  Última actualización: {new Date().toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
