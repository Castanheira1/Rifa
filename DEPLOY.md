# Guia de Deploy - Rifa Online Pro

## Pré-requisitos

- Conta no [Render](https://render.com)
- Repositório Git (GitHub, GitLab ou Gitea)
- Variáveis de ambiente configuradas

## Passo 1: Preparar o Repositório

```bash
# Inicializar git (se ainda não estiver)
git init
git add .
git commit -m "Initial commit: Rifa Online Pro"
git push origin main
```

## Passo 2: Criar Banco de Dados PostgreSQL no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `rifa-online-pro-db`
   - **Database**: `rifa_online_pro`
   - **User**: `rifa_user`
   - Deixe a senha ser gerada automaticamente
4. Clique em "Create Database"
5. Copie a connection string (DATABASE_URL)

## Passo 3: Criar Web Service no Render

1. Clique em "New +" → "Web Service"
2. Conecte seu repositório GitHub/GitLab
3. Configure:
   - **Name**: `rifa-online-pro`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: Starter (ou superior conforme necessário)

## Passo 4: Configurar Variáveis de Ambiente

No Render Dashboard, vá para seu Web Service e adicione as seguintes variáveis:

```
DATABASE_URL=postgresql://user:password@host/database
NODE_ENV=production
JWT_SECRET=seu-secret-jwt-aqui
VITE_APP_ID=seu-app-id-oauth
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=seu-nome
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-frontend-key
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
```

## Passo 5: Deploy

1. Clique em "Deploy" no Render Dashboard
2. Aguarde o build completar (normalmente 5-10 minutos)
3. Acesse a URL fornecida pelo Render

## Passo 6: Executar Migrations

Após o primeiro deploy, execute as migrations:

```bash
# Via Render Shell
pnpm db:push
```

Ou via SSH:
```bash
ssh seu-render-service
cd /opt/render/project
pnpm db:push
```

## Troubleshooting

### Build falha com erro de dependências

```bash
# Limpar cache e reinstalar
pnpm install --force
pnpm build
```

### Banco de dados não conecta

- Verifique se a DATABASE_URL está correta
- Certifique-se de que o Web Service pode acessar o PostgreSQL
- Verifique firewall/security groups

### Aplicação não inicia

- Verifique logs no Render Dashboard
- Confirme que todas as variáveis de ambiente estão definidas
- Verifique se o NODE_ENV está como "production"

## Monitoramento

- **Logs**: Acesse em "Logs" no Render Dashboard
- **Métricas**: Visualize CPU, memória e requisições
- **Alertas**: Configure notificações para falhas

## Atualizações

Para fazer deploy de atualizações:

```bash
git add .
git commit -m "Update: descrição da mudança"
git push origin main
```

O Render fará deploy automaticamente se estiver configurado com auto-deploy.

## Backup do Banco de Dados

Render oferece backups automáticos. Para fazer backup manual:

1. Acesse o PostgreSQL no Render
2. Use `pg_dump` para exportar dados
3. Armazene em local seguro

## Escalabilidade

Para aumentar recursos:

1. Vá para o Web Service no Render
2. Clique em "Settings"
3. Aumente o plano conforme necessário
4. O serviço será reiniciado automaticamente

## Suporte

- [Documentação Render](https://render.com/docs)
- [Comunidade Render](https://render.com/community)
- Email: support@render.com
