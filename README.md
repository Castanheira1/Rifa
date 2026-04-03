# Rifa Online Pro

Plataforma completa de gestão de rifas online com painel administrativo, sistema de reserva de números, pagamento PIX e validação manual.

## Características

### Para Administradores
- **Dashboard com Estatísticas**: Visualize rifas ativas, números vendidos, receita total e pagamentos pendentes
- **Gerenciamento de Rifas**: Crie, edite e delete rifas com facilidade
- **Configuração de Pagamento**: Defina chave PIX e gere QR Codes automaticamente
- **Grid de Números**: Visualize status de cada número (disponível, reservado, pago)
- **Validação Manual de Pagamentos**: Aprove ou rejeite pagamentos com observações
- **Upload de Imagens**: Adicione fotos dos prêmios ao S3
- **Reativação de Números**: Reative números se o pagamento não for confirmado

### Para Clientes
- **Listagem de Rifas**: Visualize todas as rifas ativas
- **Reserva de Números**: Escolha e reserve números com bloqueio temporário
- **Pagamento PIX**: Receba QR Code e chave PIX para cada reserva
- **Confirmação Automática**: Números ficam bloqueados por 30 minutos (configurável)
- **Interface Intuitiva**: Design elegante e responsivo

## Stack Tecnológico

- **Frontend**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend**: Node.js + Express + tRPC
- **Banco de Dados**: PostgreSQL + Drizzle ORM
- **Autenticação**: Sistema de Login Local (Usuário/Senha)
- **Armazenamento**: AWS S3
- **Deploy**: Render

## Instalação Local

### Pré-requisitos
- Node.js 22+
- pnpm 10+
- PostgreSQL 14+

### Setup

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
pnpm db:push

# Iniciar desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/rifa_online_pro

# Autenticação
JWT_SECRET=seu-secret-jwt-aqui
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Owner
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=seu-nome

# APIs Manus
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-frontend-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
```

## Estrutura do Projeto

```
rifa-online-pro/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e configurações
│   │   └── App.tsx        # Roteamento principal
│   └── public/            # Arquivos estáticos
├── server/                # Backend Node.js
│   ├── routers.ts         # Procedimentos tRPC
│   ├── db.ts              # Query helpers
│   ├── jobs.ts            # Jobs agendados
│   └── qrcode.ts          # Geração de QR Code
├── drizzle/               # Schema e migrations
│   └── schema.ts          # Definição das tabelas
├── storage/               # Helpers S3
└── shared/                # Código compartilhado
```

## Fluxo de Funcionamento

### 1. Admin Cria Rifa
- Acessa `/admin`
- Clica em "Nova Rifa"
- Preenche: título, descrição, regras, valor, quantidade de números, chave PIX
- Sistema cria automaticamente os números (1 a N)

### 2. Cliente Visualiza Rifa
- Acessa `/rifas`
- Clica em uma rifa
- Visualiza grid de números com status
- Clica em número disponível

### 3. Cliente Reserva Número
- Preenche: nome, WhatsApp, email (opcional)
- Sistema bloqueia o número por 30 minutos
- Exibe QR Code e chave PIX
- Cria registro de pagamento pendente

### 4. Admin Valida Pagamento
- Acessa `/admin/rifa/:id`
- Visualiza pagamentos pendentes
- Aprova ou rejeita pagamento
- Se aprovado: número vira "pago"
- Se rejeitado: número volta para "disponível"

### 5. Expiração Automática
- Job executa a cada 5 minutos
- Verifica reservas expiradas
- Reativa números não pagos
- Atualiza status de reservas

## Endpoints da API

### Rifas
- `GET /api/trpc/rifas.listar` - Listar rifas ativas
- `GET /api/trpc/rifas.obter` - Obter rifa por ID
- `GET /api/trpc/rifas.numeros` - Listar números de uma rifa
- `POST /api/trpc/rifas.criar` - Criar rifa (admin)
- `PUT /api/trpc/rifas.atualizar` - Atualizar rifa (admin)
- `DELETE /api/trpc/rifas.deletar` - Deletar rifa (admin)

### Reservas
- `POST /api/trpc/reservas.reservar` - Reservar número
- `GET /api/trpc/reservas.pagamentosPendentes` - Listar pagamentos pendentes (admin)

### Pagamentos
- `POST /api/trpc/pagamentos.aprovar` - Aprovar pagamento (admin)
- `POST /api/trpc/pagamentos.rejeitar` - Rejeitar pagamento (admin)
- `GET /api/trpc/pagamentos.porRifa` - Listar pagamentos de uma rifa (admin)

### Dashboard
- `GET /api/trpc/dashboard.stats` - Estatísticas do admin

## Testes

```bash
# Executar testes
pnpm test

# Testes com coverage
pnpm test:coverage

# Testes em watch mode
pnpm test:watch
```

## Build e Deploy

```bash
# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start
```

Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas de deploy no Render.

## Segurança

- Autenticação via Login Local (Admin)
- Controle de acesso baseado em roles (admin/user)
- Validação de entrada com Zod
- Proteção contra CSRF
- HTTPS obrigatório em produção

## Performance

- Otimização de queries com Drizzle ORM
- Cache de dados com React Query
- Lazy loading de imagens
- Compressão de assets
- CDN para S3

## Roadmap

- [ ] Integração com Stripe para pagamento automático
- [ ] Notificações por email e WhatsApp
- [ ] Relatórios avançados com gráficos
- [ ] Exportação de dados (CSV, PDF)
- [ ] Sorteio automático de ganhador
- [ ] Sistema de cupons e descontos
- [ ] App mobile (React Native)

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação em [DEPLOY.md](./DEPLOY.md) e [CRIAR_ADMIN.md](./CRIAR_ADMIN.md)
2. Abra uma issue no repositório
3. Entre em contato com o suporte

## Licença

MIT - Veja LICENSE para detalhes

## Contribuindo

Contribuições são bem-vindas! Por favor:
1. Faça fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para gerenciamento de rifas online**
