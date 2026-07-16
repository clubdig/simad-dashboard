# Passo a Passo - Configuração do App Meta

Baseado na tela que você enviou, aqui está exatamente o que fazer:

---

## Status Atual
✅ App criado no Meta Developer
✅ Tipo: Negócios

---

## Próximo Passo: Adicionar Instagram Graph API

### 1. Adicionar o Produto

1. No menu lateral esquerdo, clique em **"Ações necessárias"** (já está marcado com ✅)
2. Vá em **"Casos de uso"** no menu lateral
3. Clique em **"Adicionar casos de uso"** (botão no canto superior direito)

### 2. Selecionar os Casos de Uso

Selecione estes casos de uso:
- ✅ **Criar e gerenciar anúncios com a API de Marketing**
- ✅ **Mensurar dados de desempenho do anúncio com a API de Marketing**
- ✅ **Capturar e gerenciar leads de anúncios com a API de Marketing**

### 3. Adicionar Instagram Graph API

1. No menu lateral, vá em **"Configurações do app"**
2. Clique em **"Adicionar produto"**
3. Procure por **"Instagram Graph API"**
4. Clique em **"Configurar"**

### 4. Configurar Permissões

Após adicionar o Instagram Graph API:

1. Vá em **"Configurações do app"** → **"Permissões e features"**
2. Ative as seguintes permissões:
   - ✅ `instagram_basic`
   - ✅ `instagram_manage_insights`
   - ✅ `pages_show_list`
   - ✅ `pages_read_engagement`

### 5. Gerar o Access Token

1. No menu superior, vá em **"Ferramentas"** → **"Explorador da Graph API"**
2. No campo **"App da Meta"**, selecione o app que criou
3. Em **"Usuário ou Página"**, selecione **"Obter token de usuário"**
4. No campo de **Permissões**, marque as 4 permissões acima
5. Clique em **"Gerar Access Token"**
6. Autorize o acesso selecionando sua conta do Facebook/Instagram

### 6. Copiar o Token

1. O token aparecerá no campo **"Access Token"**
2. Copie **TODO** o token (ele é longo)
3. Volte ao SIMAD e cole no campo de Access Token

---

## Dicas Importantes

### Token de Curta Duração vs Longa Duração

| Tipo | Validade | Como obter |
|------|----------|------------|
| **Curta duração** | 1 hora | Gerado normalmente |
| **Longa duração** | 60 dias | Clicar em "Estender token de acesso" |

**Recomendação:** Após gerar o token, clique em **"Estender token de acesso"** para ter validade de 60 dias.

### Para estender o token:

1. No Explorador da Graph API, após gerar o token
2. Clique no botão **"Estender token de acesso"** (azul)
3. Confirme sua senha
4. Pronto! Token com validade de 60 dias

---

## Checklist

- [ ] App criado no Meta Developer
- [ ] Tipo: Negócios
- [ ] Instagram Graph API adicionado
- [ ] Permissões ativas (4 permissões)
- [ ] Token gerado
- [ ] Token estendido (60 dias)
- [ ] Token copiado
- [ ] Token colado no SIMAD
- [ ] Conexão testada

---

## Problemas Comuns

### "Permissão negada"
- Verifique se todas as 4 permissões estão ativas
- Confirme que sua conta do Instagram é Profissional ou Negócios

### "App não aprovado"
- Para uso pessoal, não precisa de aprovação
- Apenas para uso de terceiros que precisa de revisão

### "Token inválido"
- Gere um novo token
- Verifique se copiou todo o token

---

## Próximo Passo Após Conectar

Assim que conectar o token no SIMAD:

1. O dashboard atualiza automaticamente
2. Dados aparecem em tempo real
3. Gráficos são preenchidos com dados reais
4. Relatórios mostram métricas reais do Instagram

---

**Precisa de ajuda?** Me envie prints de qualquer tela que aparecer!
