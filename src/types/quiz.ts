export type DecisionColor = "verde" | "amarelo" | "vermelho";

export type QuizOption = {
  id: "A" | "B" | "C";
  text: string;
  color: DecisionColor;
};

export type QuizQuestion = {
  id: string;
  position: number;
  prompt: string;
  explanation: string;
  active: boolean;
  options: QuizOption[];
};

export type PublicQuizQuestion = Omit<QuizQuestion, "explanation" | "options"> & {
  options: Array<Pick<QuizOption, "id" | "text">>;
};

export type QuizAnswer = { questionId: string; optionId: string };

export type QuizEvaluation = {
  result: DecisionColor;
  score: number;
  maxScore: number;
  percentage: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  totalQuestions: number;
};
