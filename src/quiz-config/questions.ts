import type { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "00000000-0000-4000-8000-000000000001", position: 1, active: true,
    prompt: "Você recebeu seu salário. O que deve fazer primeiro?",
    explanation: "Organizar o orçamento ajuda a priorizar necessidades e evitar dívidas.",
    options: [
      { id: "A", text: "Comprar algo que deseja há muito tempo.", color: "vermelho" },
      { id: "B", text: "Pagar as contas e organizar o orçamento.", color: "verde" },
      { id: "C", text: "Gastar o dinheiro e depois ver o que sobra.", color: "vermelho" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000002", position: 2, active: true,
    prompt: "Você tem R$ 1.000 guardados para emergências e encontra um celular por R$ 900. Seu celular atual ainda funciona, mas está lento. O que faz?",
    explanation: "Preservar a reserva e planejar a compra ajuda a evitar dificuldades diante de imprevistos.",
    options: [
      { id: "A", text: "Compra o celular porque a promoção pode não aparecer novamente.", color: "vermelho" },
      { id: "B", text: "Mantém a reserva e planeja a compra depois de avaliar suas prioridades.", color: "verde" },
      { id: "C", text: "Usa R$ 700 da reserva e parcela o restante sem calcular os juros.", color: "vermelho" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000003", position: 3, active: true,
    prompt: "Você viu uma promoção que acaba hoje. Qual é a melhor atitude?",
    explanation: "Uma promoção só vale a pena se a compra fizer sentido e couber no orçamento.",
    options: [
      { id: "A", text: "Comprar imediatamente para não perder a oferta.", color: "vermelho" },
      { id: "B", text: "Pegar dinheiro emprestado para aproveitar a promoção.", color: "vermelho" },
      { id: "C", text: "Verificar se precisa do produto, comparar o preço e analisar se pode pagar.", color: "verde" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000004", position: 4, active: true,
    prompt: "Você recebeu um aumento de R$ 300, mas tem dívidas no cartão de crédito. O que faz?",
    explanation: "É importante equilibrar o pagamento das dívidas, as necessidades atuais e a reserva financeira.",
    options: [
      { id: "A", text: "Aumenta os gastos porque agora ganha mais.", color: "vermelho" },
      { id: "B", text: "Guarda todo o aumento, mesmo que as dívidas tenham juros altos.", color: "amarelo" },
      { id: "C", text: "Avalia os juros, as despesas essenciais e usa parte do aumento para organizar a situação.", color: "verde" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000005", position: 5, active: true,
    prompt: "No fim do mês, sobrou dinheiro. Qual decisão pode ajudar no futuro?",
    explanation: "Uma reserva financeira ajuda a enfrentar imprevistos.",
    options: [
      { id: "A", text: "Guardar uma parte para emergências e objetivos futuros.", color: "verde" },
      { id: "B", text: "Gastar tudo porque sobrou.", color: "vermelho" },
      { id: "C", text: "Emprestar todo o dinheiro sem combinar quando será devolvido.", color: "amarelo" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000006", position: 6, active: true,
    prompt: "Uma loja oferece um produto por R$ 1.200 à vista ou 12 parcelas de R$ 120. Você tem o dinheiro, mas ele é quase toda a sua reserva. O que faz?",
    explanation: "O parcelamento custa R$ 1.440 no total, mas a decisão também depende da reserva, dos juros e das condições de pagamento.",
    options: [
      { id: "A", text: "Compara o custo total e o impacto de cada opção na reserva antes de decidir.", color: "verde" },
      { id: "B", text: "Paga à vista automaticamente, porque à vista sempre é melhor.", color: "amarelo" },
      { id: "C", text: "Parcela automaticamente, porque parcelas pequenas não pesam no orçamento.", color: "amarelo" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000007", position: 7, active: true,
    prompt: "Você quer fazer uma compra parcelada. O que precisa analisar?",
    explanation: "É importante avaliar o custo total e se as parcelas cabem no orçamento.",
    options: [
      { id: "A", text: "Somente o valor da primeira parcela.", color: "vermelho" },
      { id: "B", text: "O valor total, os juros, as parcelas e o impacto no orçamento.", color: "verde" },
      { id: "C", text: "Se a loja aprovou o crédito, já é suficiente.", color: "amarelo" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000008", position: 8, active: true,
    prompt: "Você está economizando para um curso profissionalizante, mas aparece uma viagem com amigos. A viagem atrasaria sua meta em quatro meses. O que faz?",
    explanation: "Uma boa decisão considera objetivos de longo prazo e qualidade de vida.",
    options: [
      { id: "A", text: "Compara a importância da viagem com a meta e avalia o impacto antes de decidir.", color: "verde" },
      { id: "B", text: "Vai à viagem porque experiências devem ser aproveitadas independentemente dos objetivos.", color: "amarelo" },
      { id: "C", text: "Recusa sempre qualquer lazer até alcançar todas as metas financeiras.", color: "amarelo" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000009", position: 9, active: true,
    prompt: "Você recebeu uma mensagem prometendo dobrar seu dinheiro em poucos dias, mas precisa investir hoje. O que faz?",
    explanation: "Promessas de ganhos altos e rápidos e pressão para decidir podem indicar fraude.",
    options: [
      { id: "A", text: "Investe imediatamente para não perder a oportunidade.", color: "vermelho" },
      { id: "B", text: "Investe apenas R$ 100, porque assim não existe risco importante.", color: "amarelo" },
      { id: "C", text: "Verifica a oferta, a empresa e os riscos antes de enviar qualquer dinheiro.", color: "verde" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000010", position: 10, active: true,
    prompt: "Você está endividado e recebeu um dinheiro extra. Qual é a melhor atitude?",
    explanation: "Conhecer as dívidas e planejar o pagamento ajuda a recuperar o controle financeiro.",
    options: [
      { id: "A", text: "Comprar um item desejado antes que o dinheiro acabe.", color: "vermelho" },
      { id: "B", text: "Analisar as dívidas, priorizar as mais urgentes e avaliar como usar o dinheiro para quitá-las.", color: "verde" },
      { id: "C", text: "Ignorar as dívidas e continuar gastando normalmente.", color: "vermelho" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000011", position: 11, active: true,
    prompt: "Você quer comprar algo caro, mas não tem dinheiro suficiente. O que faz?",
    explanation: "Planejar a compra reduz o risco de endividamento.",
    options: [
      { id: "A", text: "Planeja e economiza até conseguir comprar sem comprometer as contas essenciais.", color: "verde" },
      { id: "B", text: "Usa todo o dinheiro destinado às contas da casa.", color: "vermelho" },
      { id: "C", text: "Faz vários empréstimos sem calcular o custo.", color: "vermelho" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000012", position: 12, active: true,
    prompt: "Você tem duas dívidas: uma pequena, com juros baixos, e outra maior, com juros muito altos. Qual estratégia merece ser avaliada?",
    explanation: "A dívida com juros altos pode aumentar mais rapidamente, mas as consequências dos atrasos também precisam ser consideradas.",
    options: [
      { id: "A", text: "Pagar a menor primeiro, porque isso é sempre melhor.", color: "amarelo" },
      { id: "B", text: "Comparar juros, multas e consequências dos atrasos para definir a estratégia.", color: "verde" },
      { id: "C", text: "Dividir o dinheiro igualmente entre as duas, sem olhar as condições.", color: "amarelo" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000013", position: 13, active: true,
    prompt: "Você recebeu um bônus inesperado, está com as contas em dia, não tem reserva de emergência e deseja comprar algo de que gosta. O que faz?",
    explanation: "Planejar o uso do bônus pode equilibrar segurança financeira e desejos pessoais.",
    options: [
      { id: "A", text: "Gasta tudo porque o bônus não fazia parte do salário.", color: "vermelho" },
      { id: "B", text: "Investe tudo em uma aplicação de alto risco para tentar multiplicar o dinheiro.", color: "amarelo" },
      { id: "C", text: "Começa a formar uma reserva e separa uma quantia compatível com o orçamento para o desejo pessoal.", color: "verde" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000014", position: 14, active: true,
    prompt: "Você precisa escolher entre comprar um lanche todos os dias ou economizar para um curso. O que deve fazer?",
    explanation: "Definir prioridades ajuda a equilibrar os gastos atuais e os objetivos futuros.",
    options: [
      { id: "A", text: "Compra o lanche diariamente sem pensar no objetivo.", color: "amarelo" },
      { id: "B", text: "Desiste do curso porque economizar é impossível.", color: "amarelo" },
      { id: "C", text: "Avalia suas prioridades e define um valor para o curso sem deixar de atender às necessidades básicas.", color: "verde" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000015", position: 15, active: true,
    prompt: "Um amigo oferece o cartão de crédito dele para você comprar roupas. Qual é a atitude mais segura?",
    explanation: "É importante considerar a capacidade de pagamento e os riscos de usar crédito emprestado.",
    options: [
      { id: "A", text: "Aceitar porque depois você dá um jeito de pagar.", color: "vermelho" },
      { id: "B", text: "Avaliar se consegue pagar e combinar claramente as condições antes de assumir o compromisso.", color: "verde" },
      { id: "C", text: "Comprar tudo o que quiser porque o limite está disponível.", color: "vermelho" },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000016", position: 16, active: true,
    prompt: "Você precisa reduzir R$ 400 dos gastos mensais da família. Qual é a primeira atitude mais consciente?",
    explanation: "Analisar o orçamento permite reduzir gastos com critério e preservar o que é essencial.",
    options: [
      { id: "A", text: "Cancelar imediatamente qualquer lazer sem analisar as outras despesas.", color: "amarelo" },
      { id: "B", text: "Pegar um empréstimo para manter o mesmo padrão de vida.", color: "vermelho" },
      { id: "C", text: "Mapear as despesas, separar necessidades de desejos e comparar alternativas de redução.", color: "verde" },
    ],
  },
];
