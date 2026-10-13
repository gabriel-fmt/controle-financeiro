# Seu Dinheiro no Controle

Quiz mobile-first de educação financeira baseado em 16 situações de tomada de decisão. Cada alternativa é classificada como **verde**, **amarela** ou **vermelha**, e o participante recebe uma avaliação final sem cálculos de orçamento ou escolha de perfil financeiro.

## O que está incluído

- Identificação por nome e sobrenome, sem cadastro ou login do participante.
- 16 perguntas e gabarito baseados no material acadêmico fornecido.
- Respostas editáveis antes de avançar.
- Resultado verde, amarelo ou vermelho com pontuação e distribuição das escolhas.
- Validação integral das respostas no servidor.
- Painel administrativo com participantes, resultados, pontuação, tempo e contagem por cor.
- Gerenciador para incluir, editar, ordenar e ativar/desativar perguntas.
- Autenticação administrativa com Supabase Auth, allowlist e Row Level Security.
- Modo de demonstração quando o Supabase ainda não está configurado.

## Executar localmente

Requisito: Node.js 20 ou superior.

Com npm:

```powershell
npm install
npm run dev
```

Ou com pnpm:

```powershell
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`. O painel fica em `http://localhost:3000/admin` e o gerenciador em `http://localhost:3000/admin/questions`.

Sem Supabase, o quiz e o painel funcionam em modo de demonstração, mas resultados e edições não são persistidos.

## Configurar Supabase

1. Crie um projeto no Supabase.
2. No SQL Editor, execute nesta ordem:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/003_quiz_schema.sql`
   - `supabase/migrations/004_participant_attempts.sql`
3. Em **Authentication → Users**, crie o usuário administrador.
4. Adicione o e-mail à allowlist:

```sql
insert into public.admin_users (email) values ('admin@exemplo.com');
```

5. Copie `.env.example` para `.env.local` e preencha:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Reinicie o servidor após alterar `.env.local`. Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no navegador nem faça commit desse arquivo.

Quando o Supabase está configurado, `/admin` e `/admin/questions` exigem login e verificam se o e-mail autenticado está na allowlist. Os participantes não precisam de login.

Cada navegador recebe um identificador anônimo em cookie seguro. As tentativas também são agrupadas pelo nome normalizado do participante: a primeira fica marcada como válida para premiação e as seguintes como repetições. O painel alerta quando o mesmo aparelho aparece associado a nomes diferentes. IP não é armazenado, pois redes escolares e móveis podem compartilhar ou trocar o endereço e gerar falsos positivos.

## Regras do resultado

- Cada escolha verde vale 2 pontos, amarela vale 1 e vermelha vale 0.
- **Verde:** pelo menos 80% das escolhas são verdes e no máximo 10% são vermelhas.
- **Vermelho:** pelo menos 35% são vermelhas ou menos de 40% são verdes.
- Os demais resultados ficam em **amarelo**.

Com 16 perguntas, a pontuação máxima é 32. O painel também registra o tempo para auxiliar em eventuais desempates.

## Publicar na Vercel

1. Importe a pasta `controle-financeiro` como projeto Next.js.
2. Cadastre as três variáveis de ambiente em Production, Preview e Development.
3. Faça o deploy e use a URL pública no QR Code da atividade.

## Onde editar

- `/admin/questions`: edição recomendada após configurar o Supabase.
- `src/quiz-config/questions.ts`: conteúdo padrão usado no modo de demonstração.
- `src/lib/quiz-engine.ts`: regras de pontuação e classificação.
- `src/app/globals.css`: identidade visual e responsividade.

## Verificação

```powershell
npm run build
```

Os endpoints públicos nunca confiam na pontuação enviada pelo navegador: o servidor carrega o gabarito atual, valida a sequência completa e recalcula o resultado antes de salvar.
