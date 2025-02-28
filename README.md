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

## Deployment na Vercel

A aplicação está configurada para deploy na Vercel com suporte ao domínio personalizado www.ruasegura.pt.

### Pré-requisitos para Deployment

- Conta na [Vercel](https://vercel.com)
- Acesso ao GitHub para conectar o repositório
- Domínio registrado (para configurar www.ruasegura.pt)

### Passos para Deployment

1. **Preparação do Repositório**

   Certifique-se de que todas as alterações estão commitadas e enviadas para o GitHub:

   ```bash
   git add .
   git commit -m "Preparação para deployment"
   git push origin main
   ```

2. **Configuração na Vercel**

   a. Faça login na sua conta Vercel e clique em "New Project"
   
   b. Importe o repositório do GitHub
   
   c. Configure as variáveis de ambiente:
   
   ```
   # Database
   DATABASE_URL=<sua-url-do-postgres-vercel>
   
   # Admin credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<senha-segura>
   NEXT_PUBLIC_ADMIN_USERNAME=admin
   NEXT_PUBLIC_ADMIN_PASSWORD=<senha-segura>
   ```
   
   d. Na seção "Build and Output Settings", mantenha as configurações padrão:
   
   - Build Command: `npm run build`
   - Output Directory: `.next`
   
   e. Clique em "Deploy"

3. **Configuração do Domínio Personalizado**

   a. Após o deployment inicial, vá para a aba "Domains" do seu projeto na Vercel
   
   b. Clique em "Add Domain" e insira `www.ruasegura.pt`
   
   c. Siga as instruções da Vercel para configurar os registros DNS:
   
   - Adicione um registro CNAME apontando `www` para `cname.vercel-dns.com`
   - Ou, se preferir configurar o domínio raiz (ruasegura.pt), adicione registros A e AAAA conforme instruções da Vercel
   
   d. Aguarde a propagação do DNS (pode levar até 48 horas, mas geralmente é mais rápido)

4. **Verificação SSL**

   A Vercel configura automaticamente certificados SSL para seu domínio. Verifique se o status do SSL está "Secure" na aba Domains.

5. **Atualizações Futuras**

   Para futuras atualizações, basta fazer push das alterações para o repositório no GitHub:

   ```bash
   git add .
   git commit -m "Descrição das alterações"
   git push origin main
   ```

   A Vercel detectará automaticamente as alterações e fará um novo deployment.

### Monitoramento e Logs

- Acesse a aba "Deployments" para ver o histórico de deployments
- Utilize a aba "Logs" para verificar logs de execução e depurar problemas
- Configure alertas em "Settings > Notifications" para ser notificado sobre falhas no deployment

### Otimizações de Performance

A aplicação já está configurada com otimizações para produção:

- Headers de segurança configurados no `next.config.js`
- Compressão de assets habilitada
- Configurações de cache otimizadas

## Manutenção do Banco de Dados

Para gerenciar o banco de dados PostgreSQL na Vercel:

1. Acesse o dashboard da Vercel e navegue até "Storage"
2. Selecione sua instância PostgreSQL
3. Use a interface para visualizar tabelas, executar consultas e monitorar o uso

Para aplicar migrações do Prisma após alterações no schema:

```bash
npx prisma migrate deploy
```

## Licença

Este projeto está licenciado sob a licença MIT. 