import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { questions, type Dimension } from "../data/questions";
import { detailedQuestions } from "../data/detailed-questions";
import { calculateDetailedResult } from "../utils/cognitive";
import ProgressBar from "../components/ProgressBar";

type Scores = Record<Dimension, number>;

export default function QuizScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isDetailed = mode === "detailed";

  const quizQuestions = isDetailed ? detailedQuestions : questions;
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Scores>({ EI: 0, SN: 0, TF: 0, JP: 0 });
  const [detailedAnswers, setDetailedAnswers] = useState<("a" | "b")[]>([]);

  // Guard: out-of-bounds index would crash
  const question = quizQuestions[index] ?? quizQuestions[0];

  const handleAnswer = useCallback(
    (choice: "a" | "b") => {
      if (isDetailed) {
        // Use functional setState to avoid stale closure
        setDetailedAnswers(prev => {
          const newAnswers = [...prev, choice];
          if (index + 1 >= detailedQuestions.length) {
            const result = calculateDetailedResult(detailedQuestions, newAnswers);
            router.replace(
              `/detailed-result?type=${result.type}&axisScores=${encodeURIComponent(
                JSON.stringify(result.axisScores)
              )}&cognitiveScores=${encodeURIComponent(
                JSON.stringify(result.cognitiveScores)
              )}`
            );
          } else {
            setIndex(i => i + 1);
          }
          return newAnswers;
        });
      } else {
        // Use functional setState to avoid stale closure
        setScores(prev => {
          const dimension = (question as typeof questions[0]).dimension;
          const newScores = choice === "b"
            ? { ...prev, [dimension]: prev[dimension] + 1 }
            : { ...prev };

          if (index + 1 >= questions.length) {
            const type = calculateType(newScores);
            router.replace(`/result?type=${type}`);
          } else {
            setIndex(i => i + 1);
          }
          return newScores;
        });
      }
    },
    [index, question, router, isDetailed]
  );

  const questionText = isDetailed
    ? (question as typeof detailedQuestions[0]).text
    : (question as typeof questions[0]).text;
  const optionAText = isDetailed
    ? (question as typeof detailedQuestions[0]).optionA
    : (question as typeof questions[0]).optionA;
  const optionBText = isDetailed
    ? (question as typeof detailedQuestions[0]).optionB
    : (question as typeof questions[0]).optionB;

  return (
    <View style={styles.container}>
      <ProgressBar current={index + 1} total={quizQuestions.length} />

      {isDetailed && (
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>ガチ診断モード</Text>
        </View>
      )}

      <View style={styles.questionCard}>
        <Text style={styles.questionNumber}>Q{question.id}</Text>
        <Text style={styles.questionText}>{questionText}</Text>
      </View>

      <View style={styles.options}>
        <Pressable
          style={({ pressed }) => [
            styles.option,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => handleAnswer("a")}
        >
          <Text style={styles.optionLabel}>A</Text>
          <Text style={styles.optionText}>{optionAText}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.option,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => handleAnswer("b")}
        >
          <Text style={styles.optionLabel}>B</Text>
          <Text style={styles.optionText}>{optionBText}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function calculateType(scores: Scores): string {
  const threshold = 3;
  const e_i = scores.EI >= threshold ? "I" : "E";
  const s_n = scores.SN >= threshold ? "N" : "S";
  const t_f = scores.TF >= threshold ? "F" : "T";
  const j_p = scores.JP >= threshold ? "P" : "J";
  return `${e_i}${s_n}${t_f}${j_p}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5FB",
    padding: 20,
    justifyContent: "center",
  },
  modeBadge: {
    alignSelf: "center",
    backgroundColor: "#7B5EA7",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 16,
  },
  modeBadgeText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    marginBottom: 32,
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    alignItems: "center",
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7B5EA7",
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    lineHeight: 28,
  },
  options: {
    gap: 14,
  },
  option: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0EAF7",
    color: "#7B5EA7",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 32,
    marginRight: 14,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
});
