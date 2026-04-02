# Rifa Online Pro - TODO

## Banco de Dados
- [x] Schema PostgreSQL com tabelas de rifas, números, reservas, pagamentos
- [x] Migrations e seed de dados de teste

## API (tRPC)
- [x] Autenticação e controle de acesso (admin/usuário)
- [x] CRUD completo de rifas (criar, editar, visualizar, excluir)
- [x] Sistema de reserva de números com bloqueio temporário
- [x] Geração de QR Code PIX e chave PIX
- [x] Validação manual de pagamentos (aprovar/rejeitar)
- [x] Sistema de expiração automática de reservas
- [x] Endpoints de dashboard com estatísticas
- [x] Testes unitários com vitest

## Painel Administrativo
- [x] Layout dashboard com sidebar
- [x] Página de login admin
- [x] Dashboard com estatísticas (rifas ativas, números vendidos, receita)
- [x] Gerenciamento de rifas (criar, editar, excluir)
- [x] Upload de imagens para S3
- [x] Visualização de pagamentos pendentes
- [x] Validação manual de pagamentos (aprovar/rejeitar)
- [x] Reativação de números
- [ ] Filtros e busca de rifas
- [ ] Relatório de faturamento

## Interface Pública
- [x] Página de listagem de rifas ativas
- [x] Página de detalhe da rifa
- [x] Grid de números com status visual (verde/amarelo/azul)
- [x] Sistema de reserva de número
- [x] Formulário de dados do cliente (nome, WhatsApp)
- [x] Exibição de QR Code PIX e chave
- [x] Confirmação de reserva
- [ ] Histórico de reservas do usuário

## Integração S3
- [x] Upload de imagens de rifas
- [x] Preview de imagens no painel admin
- [x] Exibição de imagens na interface pública

## Sistema de Expiração
- [x] Job automático para expirar reservas
- [x] Lógica de reativação de números

## Testes e Qualidade
- [x] Testes unitários da API
- [ ] Testes de fluxo de reserva
- [ ] Testes de validação de pagamento

## Deploy
- [ ] Configuração para Render
- [ ] Documentação de deploy
- [ ] Variáveis de ambiente
