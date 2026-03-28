import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { getCompatibility } from "../data/compatibility";
import { usePurchase } from "../hooks/usePurchase";

const TYPE_GRID = [
  ["INTJ", "INTP", "ENTJ", "ENTP"],
  ["INFJ", "INFP", "ENFJ", "ENFP"],
  ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  ["ISTP", "ISFP", "ESTP", "ESFP"],
];

function scoreColor(score: number): string {
  if (score >= 85) return "#FFE4E8";
  if (score >= 70) return "#FFF4E0";
  if (score >= 55) return "#F0F0FF";
  return "#F5F5F5";
}

export default function CompatMapScreen() {
  const { myType } = useLocalSearchParams<{ myType: string }>();
  const router = useRouter();
  const { isPurchased, purchase } = usePurchase();
  const hasDeep = isPurchased("com.nikkiai.typelink.deep_compatibility");
  const type = myType ?? "INFJ";

  if (!hasDeep) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedEmoji}>🔒</Text>
          <Text style={styles.lockedTitle}>全16タイプ相性マップ</Text>
          <Text style={styles.lockedDesc}>
            ディープ相性分析をアンロックすると、{"\n"}
            全タイプとの相性を一覧で確認できます。
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.unlockButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => purchase("com.nikkiai.typelink.deep_compatibility")}
          >
            <Text style={styles.unlockButtonText}>
              ディープ分析をアンロック ¥160
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>戻る</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "相性マップ" }} />
      <Text style={styles.header}>{type}の相性マップ</Text>

      {TYPE_GRID.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((friendType) => {
            const result = getCompatibility(type, friendType);
            const bg = scoreColor(result.score);
            const isSelf = friendType === type;
            return (
              <Pressable
                key={friendType}
                style={({ pressed }) => [
                  styles.cell,
                  { backgroundColor: bg, opacity: pressed ? 0.8 : 1 },
                  isSelf && styles.selfCell,
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/compat-result",
                    params: { myType: type, friendType },
                  })
                }
              >
                <Text
                  style={[styles.cellType, isSelf && styles.selfCellType]}
                >
                  {friendType}
                </Text>
                <Text style={styles.cellScore}>{result.score}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: "#FFE4E8" }]} />
          <Text style={styles.legendText}>85+ 最高の相性</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: "#FFF4E0" }]} />
          <Text style={styles.legendText}>70-84 良い相性</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: "#F0F0FF" }]} />
          <Text style={styles.legendText}>55-69 普通</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: "#F5F5F5" }]} />
          <Text style={styles.legendText}>54以下 要努力</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.homeButton,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.homeButtonText}>戻る</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5FB",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4A3870",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  selfCell: {
    borderWidth: 2,
    borderColor: "#7B5EA7",
  },
  cellType: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A3870",
    letterSpacing: 0.5,
  },
  selfCellType: {
    color: "#7B5EA7",
  },
  cellScore: {
    fontSize: 18,
    fontWeight: "800",
    color: "#555",
    marginTop: 2,
  },
  legend: {
    marginTop: 24,
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: "#666",
  },
  homeButton: {
    marginTop: 20,
    backgroundColor: "#7B5EA7",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  homeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  lockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  lockedEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4A3870",
    marginBottom: 12,
  },
  lockedDesc: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  unlockButton: {
    backgroundColor: "#7B5EA7",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  unlockButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#7B5EA7",
    fontSize: 15,
    fontWeight: "600",
  },
});
