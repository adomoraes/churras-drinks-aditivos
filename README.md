# Churras, drinks e aditivos - Carnavral 2026 🎊

Aplicação para acompanhar os blocos de carnaval de São Paulo em 2026 com os amigos.

## Funcionalidades

- **Lista de Blocos:** Veja os blocos programados, com horários e locais.
- **Check-in Social:** Marque "Tenho Interesse" nos blocos que quer ir e faça "Check-in" quando estiver no local.
- **Ranking:** Um ranking gamificado mostra quem são os maiores foliões do grupo.
- **GPS Check-in:** A confirmação de presença só é permitida se você estiver a 300m do bloco, usando a geolocalização do seu navegador.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.io/) (Banco de dados e autenticação)
- [Tailwind CSS](https://tailwindcss.com/)

## Começando

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/churras-drinks-aditivos.git
cd churras-drinks-aditivos
```

### 2. Instalar as Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um ficheiro chamado `.env.local` na raiz do projeto e adicione as seguintes variáveis. Pode obter estes valores no seu painel do Supabase.

```
# URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
# Chave anónima (pública) do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyyyyyyyyy

# Código secreto para o grupo de utilizadores
GROUP_ACCESS_CODE=seu-codigo-secreto
```

### 4. Rodar a Aplicação

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm run start`: Inicia o servidor de produção.
- `npm run lint`: Executa o linter (ESLint).
