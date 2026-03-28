import type { CognitiveFunction, DetailedQuestion } from "../data/detailed-questions";
import type { Dimension } from "../data/questions";

export type CognitiveFunctionScores = Record<CognitiveFunction, number>;

export interface DetailedResult {
  type: string;
  axisScores: Record<Dimension, { a: number; b: number }>;
  cognitiveScores: CognitiveFunctionScores;
}

// MBTI各タイプの認知機能スタック
export const cognitiveFunctionStacks: Record<string, CognitiveFunction[]> = {
  INTJ: ["Ni", "Te", "Fi", "Se"],
  INTP: ["Ti", "Ne", "Si", "Fe"],
  ENTJ: ["Te", "Ni", "Se", "Fi"],
  ENTP: ["Ne", "Ti", "Fe", "Si"],
  INFJ: ["Ni", "Fe", "Ti", "Se"],
  INFP: ["Fi", "Ne", "Si", "Te"],
  ENFJ: ["Fe", "Ni", "Se", "Ti"],
  ENFP: ["Ne", "Fi", "Te", "Si"],
  ISTJ: ["Si", "Te", "Fi", "Ne"],
  ISFJ: ["Si", "Fe", "Ti", "Ne"],
  ESTJ: ["Te", "Si", "Ne", "Fi"],
  ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ISTP: ["Ti", "Se", "Ni", "Fe"],
  ISFP: ["Fi", "Se", "Ni", "Te"],
  ESTP: ["Se", "Ti", "Fe", "Ni"],
  ESFP: ["Se", "Fi", "Te", "Ni"],
};

export function calculateDetailedResult(
  questions: DetailedQuestion[],
  answers: ("a" | "b")[]
): DetailedResult {
  const axisScores: Record<Dimension, { a: number; b: number }> = {
    EI: { a: 0, b: 0 },
    SN: { a: 0, b: 0 },
    TF: { a: 0, b: 0 },
    JP: { a: 0, b: 0 },
  };

  const cognitiveScores: CognitiveFunctionScores = {
    Ti: 0, Te: 0, Fi: 0, Fe: 0,
    Ni: 0, Ne: 0, Si: 0, Se: 0,
  };

  const cognitiveCount: CognitiveFunctionScores = {
    Ti: 0, Te: 0, Fi: 0, Fe: 0,
    Ni: 0, Ne: 0, Si: 0, Se: 0,
  };

  questions.forEach((q, i) => {
    const answer = answers[i];
    if (!answer) return;

    // 軸スコア
    if (answer === "a") {
      axisScores[q.axis].a += 1;
    } else {
      axisScores[q.axis].b += 1;
    }

    // 認知機能スコア
    for (const [fn, weight] of Object.entries(q.cognitiveWeights)) {
      const cf = fn as CognitiveFunction;
      cognitiveCount[cf] += weight!;
      if (answer === "b") {
        // b = I, N, F, P 寄り → 内向的・直感的・感情的・知覚的な認知機能にプラス
        if (["Fi", "Ti", "Ni", "Si"].includes(cf)) {
          cognitiveScores[cf] += weight!;
        }
      } else {
        // a = E, S, T, J 寄り → 外向的・感覚的・思考的・判断的な認知機能にプラス
        if (["Fe", "Te", "Ne", "Se"].includes(cf)) {
          cognitiveScores[cf] += weight!;
        }
      }
    }
  });

  // 認知機能スコアを0-100に正規化
  for (const fn of Object.keys(cognitiveScores) as CognitiveFunction[]) {
    if (cognitiveCount[fn] > 0) {
      cognitiveScores[fn] = Math.round((cognitiveScores[fn] / cognitiveCount[fn]) * 100);
    }
    // ベースライン補正（最低20、最大95）
    cognitiveScores[fn] = Math.max(20, Math.min(95, cognitiveScores[fn] + 20));
  }

  // タイプ判定（15問中の閾値 = 8）
  const threshold = 8;
  const e_i = axisScores.EI.b >= threshold ? "I" : "E";
  const s_n = axisScores.SN.b >= threshold ? "N" : "S";
  const t_f = axisScores.TF.b >= threshold ? "F" : "T";
  const j_p = axisScores.JP.b >= threshold ? "P" : "J";
  const type = `${e_i}${s_n}${t_f}${j_p}`;

  return { type, axisScores, cognitiveScores };
}

export function getAxisPercentage(axis: { a: number; b: number }): { left: number; right: number } {
  const total = axis.a + axis.b;
  if (total === 0) return { left: 50, right: 50 };
  return {
    left: Math.round((axis.a / total) * 100),
    right: Math.round((axis.b / total) * 100),
  };
}

export const cognitiveFunctionLabels: Record<CognitiveFunction, string> = {
  Ti: "内向的思考",
  Te: "外向的思考",
  Fi: "内向的感情",
  Fe: "外向的感情",
  Ni: "内向的直感",
  Ne: "外向的直感",
  Si: "内向的感覚",
  Se: "外向的感覚",
};
