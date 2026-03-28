import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Polygon, Line, Circle, Text as SvgText } from "react-native-svg";
import type { CognitiveFunctionScores } from "../utils/cognitive";
import { cognitiveFunctionLabels } from "../utils/cognitive";
import type { CognitiveFunction } from "../data/detailed-questions";

interface Props {
  scores: CognitiveFunctionScores;
}

const FUNCTIONS: CognitiveFunction[] = ["Ni", "Ne", "Ti", "Te", "Si", "Se", "Fi", "Fe"];
const SHORT_LABELS = ["Ni", "Ne", "Ti", "Te", "Si", "Se", "Fi", "Fe"];
const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 100;
const LEVELS = 5;

function polarToCartesian(angle: number, radius: number): { x: number; y: number } {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

export default function CognitiveChart({ scores }: Props) {
  const angleStep = 360 / FUNCTIONS.length;

  // グリッドの多角形
  const gridPolygons = Array.from({ length: LEVELS }, (_, level) => {
    const r = (RADIUS / LEVELS) * (level + 1);
    const points = FUNCTIONS.map((_, i) => {
      const p = polarToCartesian(i * angleStep, r);
      return `${p.x},${p.y}`;
    }).join(" ");
    return points;
  });

  // データの多角形
  const dataPoints = FUNCTIONS.map((fn, i) => {
    const value = scores[fn] / 100;
    const r = RADIUS * value;
    const p = polarToCartesian(i * angleStep, r);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>認知機能チャート</Text>
      <View style={styles.chartWrapper}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* グリッド線 */}
          {gridPolygons.map((points, i) => (
            <Polygon
              key={`grid-${i}`}
              points={points}
              fill="none"
              stroke="#E0D4F0"
              strokeWidth={1}
            />
          ))}

          {/* 軸線 */}
          {FUNCTIONS.map((_, i) => {
            const p = polarToCartesian(i * angleStep, RADIUS);
            return (
              <Line
                key={`axis-${i}`}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                stroke="#E0D4F0"
                strokeWidth={1}
              />
            );
          })}

          {/* データ */}
          <Polygon
            points={dataPoints}
            fill="rgba(123, 94, 167, 0.25)"
            stroke="#7B5EA7"
            strokeWidth={2}
          />

          {/* データポイント */}
          {FUNCTIONS.map((fn, i) => {
            const value = scores[fn] / 100;
            const r = RADIUS * value;
            const p = polarToCartesian(i * angleStep, r);
            return (
              <Circle
                key={`dot-${i}`}
                cx={p.x}
                cy={p.y}
                r={4}
                fill="#7B5EA7"
              />
            );
          })}

          {/* ラベル */}
          {FUNCTIONS.map((_, i) => {
            const p = polarToCartesian(i * angleStep, RADIUS + 22);
            return (
              <SvgText
                key={`label-${i}`}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={12}
                fontWeight="600"
                fill="#4A3870"
              >
                {SHORT_LABELS[i]}
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* 凡例 */}
      <View style={styles.legend}>
        {FUNCTIONS.map((fn) => (
          <View key={fn} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#7B5EA7" }]} />
            <Text style={styles.legendLabel}>
              {fn}: {cognitiveFunctionLabels[fn]}
            </Text>
            <Text style={styles.legendValue}>{scores[fn]}%</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>
        ※ 認知機能スコアは参考値です。学術的な正確性を保証するものではありません。
      </Text>
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
    marginBottom: 12,
  },
  chartWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  legend: {
    gap: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: "#555",
  },
  legendValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7B5EA7",
  },
  note: {
    marginTop: 12,
    fontSize: 11,
    color: "#AAA",
    lineHeight: 16,
  },
});
