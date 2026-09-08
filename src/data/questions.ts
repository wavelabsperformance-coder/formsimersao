export type Answers = Record<string, string | string[]>;

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "longtext"
  | "scale"
  | "multi"
  | "single";

export type Field = {
  id: string;
  label: string;
  hint?: string;
  placeholder?: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  optionalNote?: string;
  showIf?: (answers: Answers) => boolean;
};

export type Step = {
  n: number;
  title: string;
  note?: string;
  /** Editorial transition text shown above the question */
  transition?: string[];
  image?: "desire";
  fields: Field[];
};

export const STEPS: Step[] = [
  {
    n: 1,
    title: "Quem é você e qual é o seu momento atual?",
    fields: [
      { id: "nome", label: "Nome completo", type: "text", required: true },
      { id: "idade", label: "Idade", type: "number", required: true },
      {
        id: "profissao",
        label: "O que você faz profissionalmente hoje?",
        type: "text",
        required: true,
      },
      {
        id: "realidade_profissional",
        label: "Conte brevemente como é sua realidade profissional atual.",
        type: "textarea",
        required: true,
      },
      {
        id: "momento_frase",
        label: "Como você descreveria o momento da sua vida em uma frase?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    n: 2,
    title: "Por que você decidiu viver a Imersão que Transforma agora?",
    fields: [
      {
        id: "porque_agora",
        label:
          "O que aconteceu, mudou ou despertou em você a necessidade de viver essa experiência justamente neste momento?",
        type: "longtext",
        required: true,
      },
    ],
  },
  {
    n: 3,
    title: "O que você mais precisa transformar neste momento?",
    fields: [
      {
        id: "transformar",
        label:
          "Se pudesse resolver ou transformar uma única coisa na sua vida hoje, o que seria?",
        type: "longtext",
        required: true,
      },
    ],
  },
  {
    n: 4,
    title:
      "De 0 a 10, quanto você está satisfeita com a vida que construiu até aqui?",
    fields: [
      { id: "satisfacao", label: "Sua nota", type: "scale", required: true },
      {
        id: "satisfacao_porque",
        label: "O que faz essa nota não ser maior?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    n: 5,
    title: "Quais áreas da sua vida mais precisam de atenção hoje?",
    note: "Você pode escolher mais de uma.",
    fields: [
      {
        id: "areas",
        label: "Áreas que pedem atenção",
        type: "multi",
        required: true,
        options: [
          "Eu mesma / identidade",
          "Corpo e autocuidado",
          "Saúde emocional",
          "Espiritualidade",
          "Relacionamento",
          "Família / maternidade",
          "Trabalho / carreira",
          "Negócio / empreendedorismo",
          "Dinheiro",
          "Posicionamento e comunicação",
          "Rotina e organização",
          "Propósito / direção",
          "Outra",
        ],
      },
      {
        id: "area_impacto",
        label:
          "Entre as áreas que você escolheu, qual delas teria maior impacto sobre as outras se começasse a mudar agora? Por quê?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    n: 6,
    title:
      "Existe algo que você sabe que precisa mudar, mas continua adiando, tolerando ou evitando?",
    fields: [
      {
        id: "adiando",
        label: "O que é e por que você acredita que ainda não conseguiu mudar?",
        type: "longtext",
        required: true,
      },
    ],
  },
  {
    n: 7,
    title: "Quando você pensa em si mesma hoje, quem você enxerga?",
    fields: [
      {
        id: "tres_palavras",
        label: "Quais três palavras aparecem primeiro?",
        type: "textarea",
        required: true,
      },
      {
        id: "confianca",
        label:
          "De 0 a 10, quanto você confia na sua capacidade de construir a vida que deseja?",
        type: "scale",
        required: true,
      },
    ],
  },
  {
    n: 8,
    title: "O que você sabe que é capaz de fazer, mas ainda não está fazendo?",
    fields: [
      { id: "capaz", label: "Sua resposta", type: "longtext", required: true },
      {
        id: "bloqueio",
        label: "O que você acredita que está bloqueando essa expansão?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    n: 9,
    title:
      "Como seu corpo e sua energia têm respondido à vida que você está vivendo?",
    note: "Fale a partir da sua percepção pessoal e corporal. Isto não é um diagnóstico médico.",
    fields: [
      {
        id: "corpo",
        label: "Como você tem sentido seu corpo",
        type: "multi",
        required: true,
        options: [
          "Cansaço frequente",
          "Tensão muscular",
          "Dificuldade para relaxar",
          "Sono ruim",
          "Sensação de estar sempre acelerada",
          "Falta de disposição",
          "Ansiedade / agitação",
          "Sensação de peso",
          "Estou me sentindo bem fisicamente",
          "Outro",
        ],
      },
      {
        id: "drena",
        label: "O que mais tem drenado sua energia?",
        type: "textarea",
        required: true,
      },
      {
        id: "viva",
        label:
          "O que faz você se sentir viva, presente e conectada consigo mesma?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    n: 10,
    title:
      "Se ninguém fosse julgar sua resposta e você não precisasse explicar como faria acontecer: o que você realmente quer para a sua vida agora?",
    transition: [
      "Agora eu quero que você pare de pensar somente naquilo que precisa consertar.",
      "Quero saber o que você quer.",
    ],
    image: "desire",
    fields: [
      { id: "desejo", label: "Sua resposta", type: "longtext", required: true },
      {
        id: "doze_meses",
        label: "Como você gostaria que sua vida estivesse daqui a 12 meses?",
        type: "longtext",
        required: true,
      },
    ],
  },
  {
    n: 11,
    title:
      "Para viver essa realidade, que mulher você acredita que precisa se tornar?",
    fields: [
      { id: "mulher", label: "Sua resposta", type: "longtext", required: true },
      {
        id: "parar_sustentar",
        label:
          "O que a mulher que você é hoje precisa parar de sustentar para dar espaço a essa nova versão?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    n: 12,
    title: "Como está sua relação com trabalho, dinheiro e expansão?",
    fields: [
      {
        id: "dinheiro_relacao",
        label: "Como você definiria sua relação com dinheiro hoje?",
        type: "single",
        required: true,
        options: [
          "Tranquila e organizada",
          "Ganho, mas tenho dificuldade para administrar",
          "Vivo preocupada com dinheiro",
          "Sinto que ganho menos do que sou capaz",
          "Tenho medo de investir",
          "Quero ganhar mais, mas não sei como",
          "Estou em fase de expansão financeira",
          "Outro",
        ],
      },
      {
        id: "renda_atual",
        label: "Qual é aproximadamente a sua renda mensal atual?",
        type: "single",
        optionalNote: "Opcional",
        options: [
          "Até R$2 mil",
          "R$2 mil–R$5 mil",
          "R$5 mil–R$10 mil",
          "R$10 mil–R$20 mil",
          "Acima de R$20 mil",
          "Prefiro não informar",
        ],
      },
      {
        id: "renda_desejada",
        label:
          "Quanto você gostaria de estar ganhando mensalmente daqui a 12 meses?",
        type: "text",
        required: true,
      },
    ],
  },
  {
    n: 13,
    title: "Qual dessas opções representa melhor você hoje?",
    fields: [
      {
        id: "perfil",
        label: "Escolha uma opção",
        type: "single",
        required: true,
        options: [
          "Sou empreendedora",
          "Sou profissional autônoma",
          "Trabalho para uma empresa, mas quero empreender",
          "Tenho uma ideia/projeto que ainda não tirei do papel",
          "Não tenho interesse em empreender neste momento",
        ],
      },
      {
        id: "vende",
        label: "O que você vende ou gostaria de vender?",
        type: "textarea",
        required: true,
        showIf: (a) =>
          typeof a['perfil'] === "string" &&
          a['perfil'] !== "" &&
          a['perfil'] !== "Não tenho interesse em empreender neste momento",
      },
      {
        id: "dificuldade_monetizar",
        label:
          "Qual é sua maior dificuldade para transformar o que você sabe ou faz em dinheiro?",
        type: "textarea",
        required: true,
        showIf: (a) =>
          typeof a['perfil'] === "string" &&
          a['perfil'] !== "" &&
          a['perfil'] !== "Não tenho interesse em empreender neste momento",
      },
    ],
  },
  {
    n: 14,
    title:
      "Qual decisão, conversa, limite ou movimento você sabe que precisa fazer e ainda não fez?",
    transition: [
      "As próximas perguntas exigem verdade.",
      "Não para gerar culpa, mas para identificar aquilo que já está nas suas mãos.",
    ],
    fields: [
      { id: "decisao", label: "Sua resposta", type: "longtext", required: true },
      {
        id: "ganho_secundario",
        label:
          "O que você acredita que está ganhando ou protegendo ao permanecer exatamente onde está?",
        type: "longtext",
        required: true,
      },
    ],
  },
  {
    n: 15,
    title:
      "Se você saísse da Imersão que Transforma com UMA resposta, UMA decisão ou UMA mudança de perspectiva capaz de fazer esse encontro valer a pena, qual seria?",
    note: "Compartilhe apenas aquilo que você se sentir confortável em compartilhar.",
    fields: [
      {
        id: "valer_a_pena",
        label: "Sua resposta",
        type: "longtext",
        required: true,
      },
      {
        id: "algo_importante",
        label:
          "Existe alguma coisa importante sobre você, sua história ou seu momento atual que você gostaria que eu soubesse antes do nosso encontro?",
        type: "longtext",
        required: true,
      },
      {
        id: "nao_abordar",
        label:
          "Existe algum assunto que você NÃO deseja abordar durante a Imersão?",
        type: "textarea",
        optionalNote: "Opcional",
      },
    ],
  },
];

export const TOTAL_STEPS = STEPS.length;

export function visibleFields(step: Step, answers: Answers): Field[] {
  return step.fields.filter((f) => !f.showIf || f.showIf(answers));
}
