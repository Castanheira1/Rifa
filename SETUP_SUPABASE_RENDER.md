# Guia de Setup: Supabase + Render

Este guia mostra como fazer deploy manual do Rifa Online Pro usando Supabase para o banco de dados e Render para a aplicação.

## Passo 1: Criar Banco de Dados no Supabase

### 1.1 Criar Projeto Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Configure:
   - **Name**: `rifa-online-pro`
   - **Database Password**: Guarde em local seguro
   - **Region**: Escolha a mais próxima (ex: São Paulo)
4. Aguarde a criação (2-3 minutos)

### 1.2 Obter Connection String
1. No Supabase Dashboard, vá para **Settings** > **Database**
2. Procure por "Connection String"
3. Selecione a aba **URI**
4. Copie a string (será usada como `DATABASE_URL`)

Exemplo:
```
postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres
```

### 1.3 Executar Migrations
1. Localmente, configure a `DATABASE_URL` no `.env`:
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres
```

2. Execute as migrations:
```bash
pnpm db:push
```

3. Confirme que as tabelas foram criadas no Supabase:
   - Settings > SQL Editor
   - Verifique se existem as tabelas: `users`, `rifas`, `numeros_rifa`, `reservas`, `pagamentos`

## Passo 2: Preparar Projeto para Render

### 2.1 Criar Repositório Git
```bash
# Se ainda não tiver git
git init
git add .
git commit -m "Initial commit: Rifa Online Pro"

# Adicionar remote (GitHub, GitLab, etc)
git remote add origin https://github.com/seu-usuario/rifa-online-pro.git
git push -u origin main
```

### 2.2 Variáveis de Ambiente Necessárias

Prepare as seguintes variáveis para adicionar no Render:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres

# Autenticação
VITE_APP_ID=seu-app-id-manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
JWT_SECRET=gere-uma-chave-segura-aqui

# Owner
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=Seu Nome

# APIs Manus
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-frontend-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id

# Environment
NODE_ENV=production
```

## Passo 3: Deploy no Render

### 3.1 Criar Web Service
1. Acesse [render.com](https://render.com)
2. Clique em **New +** > **Web Service**
3. Conecte seu repositório GitHub/GitLab
4. Configure:
   - **Name**: `rifa-online-pro`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: Starter (ou superior)

### 3.2 Adicionar Variáveis de Ambiente
1. Na página do Web Service, vá para **Environment**
2. Adicione todas as variáveis da seção 2.2
3. Clique em **Save**

### 3.3 Deploy
1. Clique em **Deploy**
2. Aguarde o build completar (5-10 minutos)
3. Acesse a URL fornecida pelo Render

## Passo 4: Verificar Deployment

### 4.1 Testar Aplicação
1. Acesse a URL do Render
2. Clique em "Ver Rifas Ativas" (deve estar vazio, é normal)
3. Clique em "Painel Admin" para testar login
4. Crie uma rifa de teste

### 4.2 Verificar Logs
1. No Render Dashboard, clique em seu Web Service
2. Vá para **Logs**
3. Procure por erros ou avisos

### 4.3 Conectar ao Banco de Dados
1. No Supabase, vá para **SQL Editor**
2. Execute:
```sql
SELECT COUNT(*) FROM rifas;
```
3. Deve retornar 0 ou o número de rifas criadas

## Troubleshooting

### Build falha com erro de dependências
```bash
# Limpar cache local
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Banco de dados não conecta
- Verifique se a `DATABASE_URL` está correta
- Confirme que o Supabase está ativo
- Teste a conexão localmente antes de fazer push

### Aplicação não inicia
- Verifique os logs no Render
- Confirme que todas as variáveis de ambiente estão definidas
- Verifique se `NODE_ENV=production`

### Erro 502 Bad Gateway
- Aguarde alguns minutos (pode estar iniciando)
- Verifique os logs do Render
- Reinicie o Web Service em Settings > Restart

## Próximas Etapas

1. **Configurar Domínio Customizado**
   - Render > Settings > Custom Domain
   - Adicione seu domínio e configure DNS

2. **Configurar SSL/HTTPS**
   - Render oferece SSL grátis automaticamente

3. **Configurar Auto-Deploy**
   - Render > Settings > Auto-Deploy
   - Selecione "Yes" para fazer deploy automático a cada push

4. **Monitorar Performance**
   - Render > Metrics
   - Acompanhe CPU, memória e requisições

## Suporte

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Render](https://render.com/docs)
- [Issues do Projeto](https://github.com/seu-usuario/rifa-online-pro/issues)

---

**Desenvolvido com ❤️ para gerenciamento de rifas online**
