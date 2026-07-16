# Como Conectar o Instagram ao SIMAD

Guia passo a passo para conectar diretamente ao Instagram e puxar dados em tempo real.

---

## Pré-requisitos

1. Conta **Profissional** ou **Negócios** no Instagram
2. Página do Facebook conectada ao Instagram
3. Conta de Desenvolvedor do Facebook

---

## Passo 1: Criar App no Facebook Developer

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Clique em **"Meus Apps"** → **"Criar App"**
3. Selecione o tipo: **"Negócios"**
4. Preencha:
   - **Nome do App:** SIMAD Dashboard
   - **E-mail de contato:** seu@email.com
5. Clique em **"Criar App"**

---

## Passo 2: Adicionar Instagram Graph API

1. No painel do app criado, clique em **"Adicionar Produto"**
2. Procure por **"Instagram Graph API"**
3. Clique em **"Configurar"**
4. Pronto! O produto será adicionado ao seu app

---

## Passo 3: Gerar Access Token

1. Vá em **Ferramentas** → **Explorador da Graph API**
2. No campo **"App da Meta"**, selecione o app que criou
3. Em **"Usuário ou Página"**, selecione **"Obter token de usuário"**
4. No campo **"Permissões"**, marque:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_show_list`
   - `pages_read_engagement`
5. Clique em **"Gerar Access Token"**
6. Autorize o acesso selecionando sua conta do Facebook/Instagram

---

## Passo 4: Obter ID da Conta do Instagram

O token gerado pode ser usado para obter o ID da sua conta:

```
https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=SEU_TOKEN
```

---

## Passo 5: Conectar no SIMAD

1. Abra o SIMAD
2. Vá em **Importar Dados**
3. Clique em **"Conectar Direto"** no card do Instagram
4. Cole o Access Token
5. Clique em **"Testar Conexão"**
6. Se funcionar, clique em **"Conectar Instagram"**

---

## Dados que o SIMAD puxa automaticamente

| Dado | Descrição |
|------|-----------|
| **Seguidores** | Total de seguidores atuais |
| **Alcance** | Pessoas que viram seus posts |
| **Impressões** | Total de vezes que foram vistos |
| **Visitas ao Perfil** | Quantas vezes acessaram seu perfil |
| **Cliques no Site** | Links clicados na bio |
| **Posts Recentes** | Últimas publicações com métricas |

---

## Atualização Automática

O SIMAD atualiza os dados **a cada 5 minutos** automaticamente quando a conexão está ativa.

---

## Solução de Problemas

### "Token inválido"
- Verifique se copiou o token completo
- Tokens expiram em 1 hora (gere um novo)
- Para token de longa duração (60 dias), use o Facebook Login

### "Conta não encontrada"
- Verifique se sua conta do Instagram é **Profissional** ou **Negócios**
- Confirme se está conectada a uma página do Facebook

### "Sem dados"
- Aguarde alguns minutos após a primeira conexão
- Verifique se tem posts e insights disponíveis

---

## Segurança

- O token é armazenado **apenas no seu navegador** (localStorage)
- Nada é enviado para servidores externos
- Você pode desconectar a qualquer momento

---

**Dúvidas?** Consulte a [documentação oficial do Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
