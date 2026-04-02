# Como Criar Usuário Admin

## Opção 1: Via SQL no Supabase (Recomendado)

1. Acesse [supabase.com](https://supabase.com) e vá para seu projeto
2. Clique em **SQL Editor** (lado esquerdo)
3. Clique em **New Query**
4. Cole o SQL abaixo:

```sql
INSERT INTO users (username, passwordHash, name, role, loginMethod, lastSignedIn, createdAt, updatedAt)
VALUES (
  'admin',
  'SHA256_HASH_AQUI',
  'Administrador',
  'admin',
  'password',
  NOW(),
  NOW(),
  NOW()
);
```

5. **Substitua `SHA256_HASH_AQUI`** pelo hash SHA-256 da sua senha

### Como gerar o hash SHA-256:

**No Windows (PowerShell):**
```powershell
$password = "sua_senha_aqui"
$hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($password))
[System.BitConverter]::ToString($hash).Replace("-","").ToLower()
```

**No Mac/Linux:**
```bash
echo -n "sua_senha_aqui" | sha256sum
```

**Online (não recomendado para produção):**
- Acesse [sha256.online](https://sha256.online)
- Digite sua senha
- Copie o hash

### Exemplo Completo:

Se sua senha é `admin123`, o hash SHA-256 é:
```
240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f1979c67f
```

Então o SQL fica:
```sql
INSERT INTO users (username, passwordHash, name, role, loginMethod, lastSignedIn, createdAt, updatedAt)
VALUES (
  'admin',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f1979c67f',
  'Administrador',
  'admin',
  'password',
  NOW(),
  NOW(),
  NOW()
);
```

6. Clique em **Run** (ou Ctrl+Enter)
7. Pronto! Usuário criado

## Opção 2: Via Aplicação (Quando estiver rodando)

1. Abra a aplicação em produção/desenvolvimento
2. Vá para `/login`
3. Use:
   - **Usuário**: `admin`
   - **Senha**: A senha que você definiu

## Testando o Login

1. Acesse a página de login: `/login`
2. Digite:
   - **Usuário**: `admin`
   - **Senha**: A senha que você criou
3. Clique em "Entrar"
4. Você será redirecionado para `/admin`

## Alterando a Senha

Para alterar a senha do admin no Supabase:

```sql
UPDATE users 
SET passwordHash = 'NOVO_HASH_SHA256'
WHERE username = 'admin';
```

Gere o novo hash SHA-256 da sua nova senha e substitua `NOVO_HASH_SHA256`.

## Troubleshooting

**Erro: "Invalid credentials"**
- Verifique se o hash SHA-256 está correto
- Confirme que o usuário foi criado (execute `SELECT * FROM users WHERE username = 'admin';`)

**Erro: "Database connection failed"**
- Verifique se a `DATABASE_URL` está correta no `.env`
- Confirme que o Supabase está ativo

**Esqueci a senha**
- Acesse o Supabase SQL Editor
- Execute: `UPDATE users SET passwordHash = 'NOVO_HASH' WHERE username = 'admin';`
- Gere um novo hash e atualize

---

**Pronto!** Agora você pode fazer login como admin e começar a criar rifas! 🎉
