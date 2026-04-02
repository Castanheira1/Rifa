import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Grid3x3, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminGerenciarRifa() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/rifa/:id");
  const rifaId = params?.id ? parseInt(params.id) : 0;

  const { data: rifa, isLoading: rifaLoading } = trpc.rifas.obter.useQuery(
    { id: rifaId },
    { enabled: !!rifaId }
  );

  const { data: numeros, isLoading: numerosLoading } = trpc.rifas.numeros.useQuery(
    { rifaId },
    { enabled: !!rifaId }
  );

  const { data: pagamentos } = trpc.pagamentos.porRifa.useQuery(
    { rifaId },
    { enabled: !!rifaId }
  );

  const aprovarMutation = trpc.pagamentos.aprovar.useMutation({
    onSuccess: () => {
      toast.success("Pagamento aprovado!");
    },
  });

  const rejeitarMutation = trpc.pagamentos.rejeitar.useMutation({
    onSuccess: () => {
      toast.success("Pagamento rejeitado!");
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        </div>
      </div>
    );
  }

  if (rifaLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!rifa) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Rifa não encontrada</h2>
          <Button onClick={() => navigate("/admin")}>Voltar</Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusCounts = {
    disponivel: numeros?.filter((n) => n.status === "disponivel").length || 0,
    reservado: numeros?.filter((n) => n.status === "reservado").length || 0,
    pago: numeros?.filter((n) => n.status === "pago").length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{rifa.titulo}</h1>
            <p className="text-muted-foreground mt-2">Gerenciamento de números e pagamentos</p>
          </div>
          <Badge variant={rifa.status === "ativa" ? "default" : "secondary"}>
            {rifa.status === "ativa" ? "Ativa" : "Finalizada"}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.disponivel}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reservados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.reservado}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.pago}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(statusCounts.pago * parseFloat(rifa.valorNumero.toString())).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Números */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3x3 className="w-5 h-5" />
              Grid de Números
            </CardTitle>
            <CardDescription>Visualização de status de cada número</CardDescription>
          </CardHeader>
          <CardContent>
            {numerosLoading ? (
              <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-10 gap-2">
                {numeros?.map((numero) => (
                  <button
                    key={numero.id}
                    className={`h-12 rounded-lg font-semibold text-sm transition-colors ${
                      numero.status === "disponivel"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : numero.status === "reservado"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : numero.status === "pago"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    title={`Número ${numero.numero} - ${numero.status}`}
                  >
                    {numero.numero}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagamentos Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pagamentos Pendentes
            </CardTitle>
            <CardDescription>Validação manual de pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            {!pagamentos || pagamentos.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum pagamento pendente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pagamentos
                  .filter((p) => p.status === "pendente")
                  .map((pagamento) => (
                    <div key={pagamento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{pagamento.clienteNome}</h4>
                        <p className="text-sm text-muted-foreground">
                          WhatsApp: {pagamento.clienteWhatsapp}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Valor: R$ {rifa.valorNumero}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            rejeitarMutation.mutate({
                              pagamentoId: pagamento.id,
                              observacao: "Rejeitado pelo admin",
                            })
                          }
                        >
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            aprovarMutation.mutate({
                              pagamentoId: pagamento.id,
                              observacao: "Aprovado",
                            })
                          }
                        >
                          Aprovar
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
