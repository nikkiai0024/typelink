import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Dimension } from "../data/questions";
import { getAxisPercentage } from "../utils/cognitive";

interface Props {
  axisScores: Record<Dimension, { a: number; b: number }>;
}

const AXIS_LABELS: Record<Dimension, { left: string; right: string; leftLetter: string; rightLetter: string }> = {
  EI: { left: "外向", right: "内向", leftLetter: "E", rightLetter: "I" },
  SN: { left: "感覚", right: "直感", leftLetter: "S", rightLetter: "N" },
  TF: { left: "思考", right: "感情", leftLetter: "T", rightLetter: "F" },
  JP: { left: "判断", right: "知覚", leftLetter: "J", rightLetter: "P" },
};

const DIMENSIONS: Dimension[] = ["EI", "SN", "TF", "JP"];

export default function AxisBar({ axisScores }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>各軸のスコア</Text>
      {DIMENSIONS.map((dim) => {
        const pct = getAxisPercentage(axisScores[dim]);
        const labels = AXIS_LABELS[dim];
        const leftActive = pct.left >= pct.right;
        return (
          <View key={dim} style={styles.axisRow}>
            <View style={styles.labelRow}>
              <Text style={[styles.axisLabel, leftActive && styles.activeLabel]}>
                {labels.leftLetter} {labels.left}
              </Text>
              <Text style={[styles.axisLabel, !leftActive && styles.activeLabel]}>
                {labels.right} {labels.rightLetter}
              </Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { width: `${pct.left}%` },
                  leftActive ? styles.barActive : styles.barInactive,
                ]}
              />
            </View>
            <View style={styles.percentRow}>
              <Text style={[styles.percent, leftActive && styles.activePercent]}>
                {pct.left}%
              </Text>
              <Text style={[styles.percent, !leftActive && styles.activePercent]}>
                {pct.right}%
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A3870",
    marginBottom: 16,
  },
  axisRow: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  axisLabel: {
    fontSize: 13,
    color: "#AAA",
    fontWeight: "500",
  },
  activeLabel: {
    color: "#7B5EA7",
    fontWeight: "700",
  },
  barBackground: {
    height: 10,
    backgroundColor: "#F0EAF7",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  barActive: {
    backgroundColor: "#7B5EA7",
  },
  barInactive: {
    backgroundColor: "#C4B5D9",
  },
  percentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  percent: {
    fontSize: 12,
    color: "#AAA",
  },
  activePercent: {
    color: "#7B5EA7",
    fontWeight: "600",
  },
});
