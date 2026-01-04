# 🚀 Guia Passo a Passo - Enviar Código para GitHub

## 📋 Verificação Inicial

✅ VS Code instalado
✅ Extensão Remote - SSH instalada
✅ Repositório GitHub criado: https://github.com/MO196931/documentosZai
✅ Vai usar Vercel para deploy

---

## 🎯 PRÓXIMO: Conectar ao Servidor via VS Code Remote SSH

### PASSO 1: Abrir VS Code

1. Pressiona `Win + R`
2. Digita: `code`
3. Enter

**VS Code deve abrir** ✅

---

### PASSO 2: Abrir Configuração de SSH

No VS Code:

1. Pressiona `F1` (ou `Ctrl + Shift + P`)
2. Digita: `Remote-SSH: Connect to Host...`
3. Clica em: `+ Add New SSH Host`

---

### PASSO 3: Configurar Host SSH

**Vais ver estes campos:**

**Host:**
```
IP_DO_SERVIDOR
```
*(Substitui pelo IP real do teu servidor)*

**User:**
```
root
```

*(Se o teu usuário for outro, usa esse)*

---

### PASSO 4: Salvar Configuração

1. Depois de preencher Host e User
2. Clica em: `Add`
3. Vais ver um prompt para selecionar o config file
4. Escolhe o primeiro (padrão)
5. Clica em: `Select`

---

### PASSO 5: Conectar ao Servidor

Agora VS Code vai pedir password:

1. Insere a password do servidor
2. Pressiona Enter

**Vai aparecer um terminal:** `root@server:~$`

---

### PASSO 6: Abrir o Projeto

Depois de conectado, no VS Code:

1. Pressiona `F1` (ou `Ctrl + Shift + P`)
2. Digita: `Remote-SSH: Open Folder...`
3. Navega até: `/home/z/my-project`
4. Clica em: `OK`

**Vais ver:** Todos os arquivos do projeto na barra esquerda!

---

### PASSO 7: Abrir Terminal Integrado

No VS Code:

1. Pressiona: `Ctrl + ~` (til à esquerda do Enter)
2. OU clica em: `Terminal` → `New Terminal`

**Vais ver:**
```
root@server:/home/z/my-project$
```

---

### PASSO 8: Enviar Código Para GitHub

No terminal do VS Code, executa:

```bash
cd /home/z/my-project
```

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Sistema de Gestão de Documentos - Z.ai"
```

```bash
git remote add origin https://github.com/MO196931/documentosZai.git
```

```bash
git push -u origin main
```

**Vai pedir:**
- Username: teu usuário GitHub
- Password: usa **Personal Access Token** (não a password normal)

---

### PASSO 9: Verificar No GitHub

1. Acede a: https://github.com/MO196931/documentosZai
2. Vais ver todos os arquivos do projeto lá

**✅ Código no GitHub!**

---

### PASSO 10: Fazer Deploy No Vercel

1. Acede a: https://vercel.com
2. Log in na tua conta
3. Clica em: `Add New...` → `Project`
4. Clica em: `Import Git Repository`
5. Seleciona: `documentosZai`
6. O Vercel detecta Next.js automaticamente
7. Configura:
   - Framework: Next.js
   - Root Directory: `.`
   - (Opcional) Environment Variables:
     - Name: `DATABASE_URL`
     - Value: `file:./db/custom.db`
8. Clica em: `Deploy`

**🎉 Sistema Online!**
URL: `https://documentosZai.vercel.app`

---

## ✅ Checklists de Verificação

### Depois do Passo 1-5:
- [ ] VS Code aberto
- [ ] Configuração SSH adicionada
- [ ] Password inserida
- [ ] Conectado ao servidor (vês `root@server:~$`)

### Depois do Passo 6-7:
- [ ] Projeto aberto: `/home/z/my-project`
- [ ] Terminal aberto: `root@server:/home/z/my-project$`

### Depois do Passo 8:
- [ ] Git inicializado
- [ ] Commit feito
- [ ] Remote adicionado
- [ ] Push para GitHub concluído
- [ ] Arquivos visíveis no GitHub

### Depois do Passo 10:
- [ ] Vercel logado
- [ ] Repositório importado
- [ ] Framework detectado: Next.js
- [ ] Deploy iniciado
- [ ] Sistema online

---

## 💡 Dicas Importantes

**Para o IP do servidor:**
- DigitalOcean: está em Droplets → IP
- AWS: está em EC2 → IPv4 Public IP
- Linode: está em Linodes → IPv4
- Hetzner: está em Servers → IPv4
- cPanel/Plesk: verificar no painel

**Para o password do servidor:**
- Primeira vez: enviado no email
- Pode mudar no painel do provedor
- Lembra-te da password!

**Para o git push:**
- Usa Personal Access Token, não a password normal
- Token criado em: GitHub Settings → Developer Settings → Personal Access Tokens → Generate New Token (repo, workflow)

**Para o Vercel:**
- Importa sempre o repositório do GitHub
- Não precisa de fazer upload manual
- Deploy automático após configurado

---

## 📞 Em Caso de Erro

**Erro: "Connection refused"**
- Verifica se o IP está correto
- Verifica se a porta é 22
- Verifica se o servidor está online

**Erro: "Authentication failed"**
- Verifica username (geralmente "root")
- Verifica password
- Pede um novo password ao provedor

**Erro: "Permission denied"**
- Verifica se tens acesso de SSH
- Usa username/password corretos

**Erro: "fatal: repository not found"**
- Verifica se o URL do GitHub está correto
- Verifica se o repositório existe

**Erro: Vercel build falha**
- Verifica se o framework está como Next.js
- Verifica se root directory é `.`
- Verifica os logs no Vercel

---

## 🎉 Conclusão

Após concluir todos os passos:
- ✅ Código enviado para GitHub
- ✅ Sistema online no Vercel
- ✅ Acessível em: https://documentosZai.vercel.app

**Parabéns!** 🎊
