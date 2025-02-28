# Rua Segura Porto

Uma aplicação para reportar e acompanhar incidentes de segurança na cidade do Porto.

## Tecnologias

- Next.js 14
- TypeScript
- Tailwind CSS
- PostgreSQL (Vercel Postgres)
- Radix UI
- Axios

## Funcionalidades

- Visualização de incidentes reportados
- Filtragem por freguesia e severidade
- Submissão de novos incidentes
- Painel de administração para aprovação/rejeição de incidentes
- Autenticação básica para área administrativa

## Desenvolvimento

### Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou remoto)

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/rua-segura-porto.git
cd rua-segura-porto
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
# Admin credentials
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=safestreet
ADMIN_USERNAME=admin
ADMIN_PASSWORD=safestreet

# Development PostgreSQL configuration
DEV_POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/safestreet
DEV_POSTGRES_SSL=false
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
/app                  # Diretório principal do Next.js App Router
  /api                # API routes
    /incidents        # Endpoints para incidentes
    /admin            # Endpoints administrativos
  /components         # Componentes React reutilizáveis
  /lib                # Utilitários e funções auxiliares
  /public             # Arquivos estáticos
  /styles             # Estilos globais
```

## Deployment

A aplicação está configurada para deploy na Vercel. Basta conectar o repositório à sua conta Vercel e configurar as variáveis de ambiente necessárias.

## Licença

Este projeto está licenciado sob a licença MIT. 