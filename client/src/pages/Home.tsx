import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Ticket, Users, TrendingUp, Shield } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">Rifa Online Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/rifas">
              <Button variant="ghost">Rifas</Button>
            </Link>
            {isAuthenticated && user?.role === "admin" ? (
              <Link href="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Plataforma de Rifas Online
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie, gerencie e participe de rifas com segurança. Sistema completo com pagamento PIX e validação manual.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rifas">
              <Button size="lg" className="gap-2">
                <Ticket className="w-5 h-5" />
                Ver Rifas Ativas
              </Button>
            </Link>
            {isAuthenticated && user?.role === "admin" ? (
              <Link href="/admin">
                <Button size="lg" variant="outline" className="gap-2">
                  <Shield className="w-5 h-5" />
                  Painel Admin
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2">
                  <Shield className="w-5 h-5" />
                  Criar Rifa
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Recursos Principais</h2>
            <p className="text-muted-foreground">Tudo que você precisa para gerenciar rifas online</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Gerenciamento de Rifas</h3>
                <p className="text-sm text-muted-foreground">
                  Crie e gerencie rifas com facilidade. Defina valores, regras e quantidade de números.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Reserva de Números</h3>
                <p className="text-sm text-muted-foreground">
                  Clientes escolhem e reservam números com bloqueio temporário automático.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">Pagamento PIX</h3>
                <p className="text-sm text-muted-foreground">
                  Integração com PIX. QR Code e chave automáticos para cada reserva.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg">Validação Manual</h3>
                <p className="text-sm text-muted-foreground">
                  Admin valida pagamentos manualmente. Controle total sobre confirmações.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white space-y-6">
          <h2 className="text-3xl font-bold">Pronto para começar?</h2>
          <p className="text-lg opacity-90">
            Crie sua primeira rifa agora e comece a gerenciar rifas online com segurança.
          </p>
          {isAuthenticated && user?.role === "admin" ? (
            <Link href="/admin/criar-rifa">
              <Button size="lg" variant="secondary">
                Criar Nova Rifa
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Fazer Login
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          <p>Rifa Online Pro © 2026. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
