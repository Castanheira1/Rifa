import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, Ticket, DollarSign, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: rifas } = trpc.rifas.meusRifas.useQuery();

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">Você não tem permissão para acessar este painel.</p>
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Bem-vindo ao painel administrativo de rifas</p>
          </div>
          <Link href="/admin/criar-rifa">
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Rifa
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rifas Ativas</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.rifasAtivas || 0}</div>
                  <p className="text-xs text-muted-foreground">de {stats?.totalRifas || 0} rifas</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Números Vendidos</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.numerosVendidos || 0}</div>
                  <p className="text-xs text-muted-foreground">números pagos</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">R$ {(stats?.receitaTotal || 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">faturamento</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.pagamentosPendentes || 0}</div>
                  <p className="text-xs text-muted-foreground">aguardando validação</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rifas List */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Rifas</CardTitle>
            <CardDescription>Gerenciamento de todas as suas rifas</CardDescription>
          </CardHeader>
          <CardContent>
            {!rifas || rifas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Nenhuma rifa criada ainda</p>
                <Link href="/admin/criar-rifa">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Rifa
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {rifas.map((rifa) => (
                  <div key={rifa.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold">{rifa.titulo}</h3>
                      <p className="text-sm text-muted-foreground">
                        {rifa.totalNumeros} números • R$ {rifa.valorNumero}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        rifa.status === "ativa"
                          ? "bg-green-100 text-green-800"
                          : rifa.status === "finalizada"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {rifa.status === "ativa" ? "Ativa" : rifa.status === "finalizada" ? "Finalizada" : "Cancelada"}
                      </span>
                      <Link href={`/admin/rifa/${rifa.id}`}>
                        <Button variant="outline" size="sm">
                          Gerenciar
                        </Button>
                      </Link>
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
