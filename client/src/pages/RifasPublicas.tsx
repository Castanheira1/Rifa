import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket, DollarSign } from "lucide-react";

export default function RifasPublicas() {
  const { data: rifas, isLoading } = trpc.rifas.listar.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold tracking-tight">Rifas Online</h1>
          <p className="text-muted-foreground mt-2">Escolha sua rifa e reserve seu número</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        ) : !rifas || rifas.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhuma rifa disponível</h2>
            <p className="text-muted-foreground">Volte em breve para novas rifas</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rifas.map((rifa) => (
              <Card key={rifa.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Imagem */}
                {rifa.imagemUrl && (
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                    <img
                      src={rifa.imagemUrl}
                      alt={rifa.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="line-clamp-2">{rifa.titulo}</CardTitle>
                  <CardDescription className="line-clamp-2">{rifa.descricao}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="text-lg font-bold flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {rifa.valorNumero}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Números</p>
                      <p className="text-lg font-bold">{rifa.totalNumeros}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativa
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/rifa/${rifa.id}`}>
                    <Button className="w-full">Ver Rifa</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
