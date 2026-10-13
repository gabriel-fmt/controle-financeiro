create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  position integer not null check (position > 0),
  prompt text not null check (char_length(trim(prompt)) >= 10),
  explanation text not null check (char_length(trim(explanation)) >= 10),
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 3),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists quiz_questions_position_active_idx
on public.quiz_questions (position) where active;

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique,
  participant_first_name text not null check (char_length(trim(participant_first_name)) between 2 and 50),
  participant_last_name text not null check (char_length(trim(participant_last_name)) between 2 and 50),
  result text not null check (result in ('verde', 'amarelo', 'vermelho')),
  score integer not null check (score >= 0),
  max_score integer not null check (max_score > 0),
  green_count integer not null check (green_count >= 0),
  yellow_count integer not null check (yellow_count >= 0),
  red_count integer not null check (red_count >= 0),
  answers jsonb not null,
  duration_seconds integer not null check (duration_seconds between 1 and 7200),
  completed_at timestamptz not null default now()
);

alter table public.quiz_questions enable row level security;
alter table public.quiz_results enable row level security;

create policy "admins can manage quiz questions"
on public.quiz_questions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins can read quiz results"
on public.quiz_results for select
to authenticated
using (public.is_admin());

insert into public.quiz_questions (id, position, prompt, explanation, options) values
('00000000-0000-4000-8000-000000000001', 1,
 'Você recebeu seu salário. O que deve fazer primeiro?',
 'Organizar o orçamento ajuda a priorizar necessidades e evitar dívidas.',
 '[{"id":"A","text":"Comprar algo que deseja há muito tempo.","color":"vermelho"},{"id":"B","text":"Pagar as contas e organizar o orçamento.","color":"verde"},{"id":"C","text":"Gastar o dinheiro e depois ver o que sobra.","color":"vermelho"}]'),
('00000000-0000-4000-8000-000000000002', 2,
 'Você tem R$ 1.000 guardados para emergências e encontra um celular por R$ 900. Seu celular atual ainda funciona, mas está lento. O que faz?',
 'Preservar a reserva e planejar a compra ajuda a evitar dificuldades diante de imprevistos.',
 '[{"id":"A","text":"Compra o celular porque a promoção pode não aparecer novamente.","color":"vermelho"},{"id":"B","text":"Mantém a reserva e planeja a compra depois de avaliar suas prioridades.","color":"verde"},{"id":"C","text":"Usa R$ 700 da reserva e parcela o restante sem calcular os juros.","color":"vermelho"}]'),
('00000000-0000-4000-8000-000000000003', 3,
 'Você viu uma promoção que acaba hoje. Qual é a melhor atitude?',
 'Uma promoção só vale a pena se a compra fizer sentido e couber no orçamento.',
 '[{"id":"A","text":"Comprar imediatamente para não perder a oferta.","color":"vermelho"},{"id":"B","text":"Pegar dinheiro emprestado para aproveitar a promoção.","color":"vermelho"},{"id":"C","text":"Verificar se precisa do produto, comparar o preço e analisar se pode pagar.","color":"verde"}]'),
('00000000-0000-4000-8000-000000000004', 4,
 'Você recebeu um aumento de R$ 300, mas tem dívidas no cartão de crédito. O que faz?',
 'É importante equilibrar o pagamento das dívidas, as necessidades atuais e a reserva financeira.',
 '[{"id":"A","text":"Aumenta os gastos porque agora ganha mais.","color":"vermelho"},{"id":"B","text":"Guarda todo o aumento, mesmo que as dívidas tenham juros altos.","color":"amarelo"},{"id":"C","text":"Avalia os juros, as despesas essenciais e usa parte do aumento para organizar a situação.","color":"verde"}]'),
('00000000-0000-4000-8000-000000000005', 5,
 'No fim do mês, sobrou dinheiro. Qual decisão pode ajudar no futuro?',
 'Uma reserva financeira ajuda a enfrentar imprevistos.',
 '[{"id":"A","text":"Guardar uma parte para emergências e objetivos futuros.","color":"verde"},{"id":"B","text":"Gastar tudo porque sobrou.","color":"vermelho"},{"id":"C","text":"Emprestar todo o dinheiro sem combinar quando será devolvido.","color":"amarelo"}]'),
('00000000-0000-4000-8000-000000000006', 6,
 'Uma loja oferece um produto por R$ 1.200 à vista ou 12 parcelas de R$ 120. Você tem o dinheiro, mas ele é quase toda a sua reserva. O que faz?',
 'O parcelamento custa R$ 1.440 no total, mas a decisão também depende da reserva, dos juros e das condições de pagamento.',
 '[{"id":"A","text":"Compara o custo total e o impacto de cada opção na reserva antes de decidir.","color":"verde"},{"id":"B","text":"Paga à vista automaticamente, porque à vista sempre é melhor.","color":"amarelo"},{"id":"C","text":"Parcela automaticamente, porque parcelas pequenas não pesam no orçamento.","color":"amarelo"}]'),
('00000000-0000-4000-8000-000000000007', 7,
 'Você quer fazer uma compra parcelada. O que precisa analisar?',
 'É importante avaliar o custo total e se as parcelas cabem no orçamento.',
 '[{"id":"A","text":"Somente o valor da primeira parcela.","color":"vermelho"},{"id":"B","text":"O valor total, os juros, as parcelas e o impacto no orçamento.","color":"verde"},{"id":"C","text":"Se a loja aprovou o crédito, já é suficiente.","color":"amarelo"}]'),
('00000000-0000-4000-8000-000000000008', 8,
 'Você está economizando para um curso profissionalizante, mas aparece uma viagem com amigos. A viagem atrasaria sua meta em quatro meses. O que faz?',
 'Uma boa decisão considera objetivos de longo prazo e qualidade de vida.',
 '[{"id":"A","text":"Compara a importância da viagem com a meta e avalia o impacto antes de decidir.","color":"verde"},{"id":"B","text":"Vai à viagem porque experiências devem ser aproveitadas independentemente dos objetivos.","color":"amarelo"},{"id":"C","text":"Recusa sempre qualquer lazer até alcançar todas as metas financeiras.","color":"amarelo"}]'),
('00000000-0000-4000-8000-000000000009', 9,
 'Você recebeu uma mensagem prometendo dobrar seu dinheiro em poucos dias, mas precisa investir hoje. O que faz?',
 'Promessas de ganhos altos e rápidos e pressão para decidir podem indicar fraude.',
 '[{"id":"A","text":"Investe imediatamente para não perder a oportunidade.","color":"vermelho"},{"id":"B","text":"Investe apenas R$ 100, porque assim não existe risco importante.","color":"amarelo"},{"id":"C","text":"Verifica a oferta, a empresa e os riscos antes de enviar qualquer dinheiro.","color":"verde"}]'),
('00000000-0000-4000-8000-000000000010', 10,
 'Você está endividado e recebeu um dinheiro extra. Qual é a melhor atitude?',
 'Conhecer as dívidas e planejar o pagamento ajuda a recuperar o controle financeiro.',
 '[{"id":"A","text":"Comprar um item desejado antes que o dinheiro acabe.","color":"vermelho"},{"id":"B","text":"Analisar as dívidas, priorizar as mais urgentes e avaliar como usar o dinheiro para quitá-las.","color":"verde"},{"id":"C","text":"Ignorar as dívidas e continuar gastando normalmente.","color":"vermelho"}]'),
('00000000-0000-4000-8000-000000000011', 11,
 'Você quer comprar algo caro, mas não tem dinheiro suficiente. O que faz?',
 'Planejar a compra reduz o risco de endividamento.',
 '[{"id":"A","text":"Planeja e economiza até conseguir comprar sem comprometer as contas essenciais.","color":"verde"},{"id":"B","text":"Usa todo o dinheiro destinado às contas da casa.","color":"vermelho"},{"id":"C","text":"Faz vários empréstimos sem calcular o custo.","color":"vermelho"}]'),
('00000000-0000-4000-8000-000000000012', 12,
 'Você tem duas dívidas: uma pequena, com juros baixos, e outra maior, com juros muito altos. Qual estratégia merece ser avaliada?',
 'A dívida com juros altos pode aumentar mais rapidamente, mas as consequências dos atrasos também precisam ser consideradas.',
 '[{"id":"A","text":"Pagar a menor primeiro, porque isso é sempre melhor.","color":"amarelo"},{"id":"B","text":"Comparar juros, multas e consequências dos atrasos para definir a estratégia.","color":"verde"},{"id":"C","text":"Dividir o dinheiro igualmente entre as duas, sem olhar as condições.","color":"amarelo"}]'),
('00000000-0000-4000-8000-000000000013', 13,
 'Você recebeu um bônus inesperado, está com as contas em dia, não tem reserva de emergência e deseja comprar algo de que gosta. O que faz?',
 'Planejar o uso do bônus pode equilibrar segurança financeira e desejos pessoais.',
 '[{"id":"A","text":"Gasta tudo porque o bônus não fazia parte do salário.","color":"vermelho"},{"id":"B","text":"Investe tudo em uma aplicação de alto risco para tentar multiplicar o dinheiro.","color":"amarelo"},{"id":"C","text":"Começa a formar uma reserva e separa uma quantia compatível com o orçamento para o desejo pessoal.","color":"verde"}]'),
('00000000-0000-4000-8000-000000000014', 14,
 'Você precisa escolher entre comprar um lanche todos os dias ou economizar para um curso. O que deve fazer?',
 'Definir prioridades ajuda a equilibrar os gastos atuais e os objetivos futuros.',
 '[{"id":"A","text":"Compra o lanche diariamente sem pensar no objetivo.","color":"amarelo"},{"id":"B","text":"Desiste do curso porque economizar é impossível.","color":"amarelo"},{"id":"C","text":"Avalia suas prioridades e define um valor para o curso sem deixar de atender às necessidades básicas.","color":"verde"}]'),
('00000000-0000-4000-8000-000000000015', 15,
 'Um amigo oferece o cartão de crédito dele para você comprar roupas. Qual é a atitude mais segura?',
 'É importante considerar a capacidade de pagamento e os riscos de usar crédito emprestado.',
 '[{"id":"A","text":"Aceitar porque depois você dá um jeito de pagar.","color":"vermelho"},{"id":"B","text":"Avaliar se consegue pagar e combinar claramente as condições antes de assumir o compromisso.","color":"verde"},{"id":"C","text":"Comprar tudo o que quiser porque o limite está disponível.","color":"vermelho"}]'),
('00000000-0000-4000-8000-000000000016', 16,
 'Você precisa reduzir R$ 400 dos gastos mensais da família. Qual é a primeira atitude mais consciente?',
 'Analisar o orçamento permite reduzir gastos com critério e preservar o que é essencial.',
 '[{"id":"A","text":"Cancelar imediatamente qualquer lazer sem analisar as outras despesas.","color":"amarelo"},{"id":"B","text":"Pegar um empréstimo para manter o mesmo padrão de vida.","color":"vermelho"},{"id":"C","text":"Mapear as despesas, separar necessidades de desejos e comparar alternativas de redução.","color":"verde"}]')
on conflict (id) do nothing;
