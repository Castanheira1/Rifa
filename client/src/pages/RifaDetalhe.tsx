import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Grid3x3, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function RifaDetalhe() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/rifa/:id");
  const rifaId = params?.id ? parseInt(params.id) : 0;

  const [selectedNumero, setSelectedNumero] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    clienteNome: "",
    clienteWhatsapp: "",
    clienteEmail: "",
  });

  const { data: rifa, isLoading: rifaLoading } = trpc.rifas.obter.useQuery(
    { id: rifaId },
    { enabled: !!rifaId }
  );

  const { data: numeros, isLoading: numerosLoading } = trpc.rifas.numeros.useQuery(
    { rifaId },
    { enabled: !!rifaId }
  );

  const reservarMutation = trpc.reservas.reservar.useMutation({
    onSuccess: (data) => {
      toast.success("Número reservado com sucesso!");
      setFormData({ clienteNome: "", clienteWhatsapp: "", clienteEmail: "" });
      setSelectedNumero(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao reservar número");
    },
  });

  const handleReservar = async () => {
    if (!selectedNumero) return;

    if (!formData.clienteNome || !formData.clienteWhatsapp) {
      toast.error("Preencha nome e WhatsApp");
      return;
    }

    const numero = numeros?.find((n) => n.numero === selectedNumero);
    if (!numero) return;

    await reservarMutation.mutateAsync({
      rifaId,
      numeroId: numero.id,
      clienteNome: formData.clienteNome,
      clienteWhatsapp: formData.clienteWhatsapp,
      clienteEmail: formData.clienteEmail,
    });
  };

  if (rifaLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!rifa) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Rifa não encontrada</h2>
          <Button onClick={() => navigate("/")}>Voltar</Button>
        </div>
      </div>
    );
  }

  const statusCounts = {
    disponivel: numeros?.filter((n) => n.status === "disponivel").length || 0,
    reservado: numeros?.filter((n) => n.status === "reservado").length || 0,
    pago: numeros?.filter((n) => n.status === "pago").length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">{rifa.titulo}</h1>
          <p className="text-muted-foreground mt-2">{rifa.descricao}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagem */}
            {rifa.imagemUrl && (
              <Card className="overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-blue-400 to-blue-600">
                  <img
                    src={rifa.imagemUrl}
                    alt={rifa.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}

            {/* Descrição e Regras */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {rifa.descricao && (
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-muted-foreground">{rifa.descricao}</p>
                  </div>
                )}
                {rifa.regras && (
                  <div>
                    <h3 className="font-semibold mb-2">Regras</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{rifa.regras}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Grid de Números */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3x3 className="w-5 h-5" />
                  Números Disponíveis
                </CardTitle>
                <CardDescription>Clique em um número para reservar</CardDescription>
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
                      <Dialog key={numero.id}>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => setSelectedNumero(numero.numero)}
                            disabled={numero.status !== "disponivel"}
                            className={`h-12 rounded-lg font-semibold text-sm transition-colors disabled:cursor-not-allowed ${
                              numero.status === "disponivel"
                                ? "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                                : numero.status === "reservado"
                                ? "bg-yellow-100 text-yellow-800"
                                : numero.status === "pago"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                            title={`Número ${numero.numero} - ${numero.status}`}
                          >
                            {numero.numero}
                          </button>
                        </DialogTrigger>
                        {numero.status === "disponivel" && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reservar Número {numero.numero}</DialogTitle>
                              <DialogDescription>
                                Preencha seus dados para reservar este número
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Valor */}
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Valor do número</p>
                                <p className="text-2xl font-bold">R$ {rifa.valorNumero}</p>
                              </div>

                              {/* Form */}
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <Label htmlFor="nome">Nome Completo</Label>
                                  <Input
                                    id="nome"
                                    value={formData.clienteNome}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        clienteNome: e.target.value,
                                      }))
                                    }
                                    placeholder="Seu nome"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <Label htmlFor="whatsapp">WhatsApp</Label>
                                  <Input
                                    id="whatsapp"
                                    value={formData.clienteWhatsapp}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        clienteWhatsapp: e.target.value,
                                      }))
                                    }
                                    placeholder="11999999999"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <Label htmlFor="email">Email (opcional)</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={formData.clienteEmail}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        clienteEmail: e.target.value,
                                      }))
                                    }
                                    placeholder="seu@email.com"
                                  />
                                </div>
                              </div>

                              {/* Info */}
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800">
                                  <p className="font-semibold mb-1">Importante</p>
                                  <p>Você terá 30 minutos para confirmar o pagamento via PIX</p>
                                </div>
                              </div>

                              {/* Button */}
                              <Button
                                onClick={handleReservar}
                                disabled={reservarMutation.isPending}
                                className="w-full"
                              >
                                {reservarMutation.isPending ? "Reservando..." : "Confirmar Reserva"}
                              </Button>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Disponíveis</span>
                  <span className="text-lg font-bold text-green-600">{statusCounts.disponivel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reservados</span>
                  <span className="text-lg font-bold text-yellow-600">{statusCounts.reservado}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vendidos</span>
                  <span className="text-lg font-bold text-blue-600">{statusCounts.pago}</span>
                </div>
              </CardContent>
            </Card>

            {/* PIX */}
            {rifa.pixChave && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pagamento PIX</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Chave PIX</p>
                    <div className="bg-slate-100 p-3 rounded-lg break-all text-sm font-mono">
                      {rifa.pixChave}
                    </div>
                  </div>
                  {rifa.pixQrCode && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">QR Code</p>
                      <img src={rifa.pixQrCode} alt="QR Code PIX" className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
