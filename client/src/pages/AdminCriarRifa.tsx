import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AdminCriarRifa() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    regras: "",
    valorNumero: "",
    totalNumeros: "",
    pixChave: "",
    tempoReservaMinutos: "30",
  });

  const criarRifaMutation = trpc.rifas.criar.useMutation({
    onSuccess: (data) => {
      toast.success("Rifa criada com sucesso!");
      navigate(`/admin/rifa/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar rifa");
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar este painel.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await criarRifaMutation.mutateAsync({
        titulo: formData.titulo,
        descricao: formData.descricao,
        regras: formData.regras,
        valorNumero: formData.valorNumero,
        totalNumeros: parseInt(formData.totalNumeros),
        pixChave: formData.pixChave,
        tempoReservaMinutos: parseInt(formData.tempoReservaMinutos),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Criar Nova Rifa</h1>
            <p className="text-muted-foreground mt-2">Preencha os dados da rifa para criar uma nova</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Rifa</CardTitle>
            <CardDescription>Preencha todos os campos obrigatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Rifa</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ex: Rifa do iPhone 15"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva o prêmio e detalhes da rifa"
                  rows={4}
                />
              </div>

              {/* Regras */}
              <div className="space-y-2">
                <Label htmlFor="regras">Regras da Rifa</Label>
                <Textarea
                  id="regras"
                  name="regras"
                  value={formData.regras}
                  onChange={handleInputChange}
                  placeholder="Descreva as regras e termos"
                  rows={4}
                />
              </div>

              {/* Grid de 2 colunas */}
              <div className="grid grid-cols-2 gap-4">
                {/* Valor do Número */}
                <div className="space-y-2">
                  <Label htmlFor="valorNumero">Valor por Número (R$)</Label>
                  <Input
                    id="valorNumero"
                    name="valorNumero"
                    type="number"
                    step="0.01"
                    value={formData.valorNumero}
                    onChange={handleInputChange}
                    placeholder="10.00"
                    required
                  />
                </div>

                {/* Total de Números */}
                <div className="space-y-2">
                  <Label htmlFor="totalNumeros">Total de Números</Label>
                  <Input
                    id="totalNumeros"
                    name="totalNumeros"
                    type="number"
                    value={formData.totalNumeros}
                    onChange={handleInputChange}
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              {/* Chave PIX */}
              <div className="space-y-2">
                <Label htmlFor="pixChave">Chave PIX</Label>
                <Input
                  id="pixChave"
                  name="pixChave"
                  value={formData.pixChave}
                  onChange={handleInputChange}
                  placeholder="CPF, email ou chave aleatória"
                />
              </div>

              {/* Tempo de Reserva */}
              <div className="space-y-2">
                <Label htmlFor="tempoReservaMinutos">Tempo de Reserva (minutos)</Label>
                <Input
                  id="tempoReservaMinutos"
                  name="tempoReservaMinutos"
                  type="number"
                  value={formData.tempoReservaMinutos}
                  onChange={handleInputChange}
                  placeholder="30"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin")}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Rifa"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
