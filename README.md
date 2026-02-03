# brev.ly

Este projeto é uma aplicação web para criação, gerenciamento e acompanhamento de links, permitindo registrar URLs encurtadas, monitorar acessos, exportar dados e gerenciar os registros de forma simples.

A aplicação é dividida em backend (API) e frontend (web), rodando de forma independente.

---

## Funcionalidades

### Gerenciamento de links

- Criar novos links informando:
  - URL original
  - URL encurtada
- Listar todos os links cadastrados
- Excluir links existentes
- Copiar rapidamente a URL original para a área de transferência

### Monitoramento de acessos

- Cada link possui um contador de acessos
- Ao clicar em um link, o sistema registra o acesso automaticamente
- A contagem é atualizada na listagem

### Exportação de dados

- Exportar os links cadastrados em formato CSV
- O arquivo CSV contém:
  - URL Original
  - URL Encurtada
  - Quantidade de acessos
  - Data de criação
- Compatível com Excel, Google Sheets e ferramentas similares

---

## Estrutura do projeto

```
/
├── server/        # Backend (Node.js)
│   ├── docker-compose.yml
│   └── ...
├── web/           # Frontend (Next.js)
│   └── ...
```

---

## Backend

- Desenvolvido em Node.js
- Responsável por:
  - Persistência dos links
  - Contagem de acessos
  - Exclusão de registros
  - Fornecer os dados consumidos pelo frontend
- Expõe uma API HTTP utilizada pelo frontend

### Como executar o backend

1. Acesse a pasta do backend:

   ```bash
   cd server
   ```

2. Suba os serviços necessários com Docker:

   ```bash
   docker-compose up -d
   ```

3. Instale as dependências:

   ```bash
   pnpm i
   ```

4. Inicie o servidor:
   ```bash
   pnpm dev
   ```

O backend ficará disponível em:

```
http://localhost:3333
```

---

## Frontend

- Desenvolvido em Next.js
- Responsável pela interface do usuário
- Consome a API do backend para:
  - Criar links
  - Listar links
  - Atualizar acessos
  - Exportar CSV
  - Excluir registros

### Como executar o frontend

1. Acesse a pasta do frontend:

   ```bash
   cd web
   ```

2. Instale as dependências:

   ```bash
   npm i
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O frontend ficará disponível em:

```
http://localhost:3000
```

---

## Fluxo de uso da aplicação

1. Inicie o backend
2. Inicie o frontend
3. Acesse o sistema pelo navegador
4. Crie novos links através do formulário
5. Visualize e gerencie os links na listagem
6. Clique nos links para registrar acessos
7. Exporte os dados em CSV quando necessário

---

## Observações

- O frontend depende do backend rodando corretamente
- Para desenvolvimento local, o backend deve estar acessível em `localhost:3333`
- O CORS está configurado para permitir comunicação entre frontend e backend em ambiente local
