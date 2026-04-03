# Como Criar Usuário Admin

## Usuário Padrão (Recomendado)

O sistema já vem configurado com um usuário administrador padrão:
- **Usuário**: `admin`
- **Senha**: `Rifa.Wanderlei`

Se você resetou seu banco de dados, execute o script SQL abaixo no seu editor SQL (ex: Supabase) para restaurar este acesso:

```sql
INSERT INTO users (username, password_hash, name, role, login_method, last_signed_in, created_at)
VALUES (
  'admin',
  'f987f9269ae5e10c5cc595bcb8707bb222248dca3004f582c93663fbfd819f70',
  'Administrador',
  'admin',
  'password',
  NOW(),
  NOW()
);
```

## Como Alterar a Senha do Admin

Para alterar a senha do admin para algo de sua preferência:

1. Gere o hash SHA-256 da sua nova senha.
2. No Mac/Linux: `echo -n "sua_nova_senha" | sha256sum`
3. Execute o comando SQL:

```sql
UPDATE users 
SET password_hash = 'SEU_NOVO_HASH_AQUI'
WHERE username = 'admin';
```

## Troubleshooting

**Erro: "Invalid credentials"**
- Verifique se você digitou `admin` (minúsculo) e a senha `Rifa.Wanderlei` corretamente.
- Se o erro persistir, execute o comando de `INSERT` acima para garantir que o usuário existe.

**Erro: "Database connection failed"**
- Verifique se a variável `DATABASE_URL` está configurada no seu ambiente de hospedagem.
- No Render/Vercel, adicione a variável `DATABASE_URL` apontando para o seu banco de dados Supabase.
