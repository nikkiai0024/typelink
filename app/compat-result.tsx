import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mbtiTypes } from "../data/types";
import { getCompatibility } from "../data/compatibility";
import { usePurchase } from "../hooks/usePurchase";

export default function CompatResultScreen() {
  const { myType, friendType } = useLocalSearchParams<{
    myType: string;
    friendType: string;
  }>();
  const router = useRouter();
  const { isPurchased, purchase } = usePurchase();

  const my = mbtiTypes[myType ?? ""] ?? mbtiTypes.INFJ;
  const friend = mbtiTypes[friendType ?? ""] ?? mbtiTypes.ENTP;
  const result = getCompatibility(myType ?? "INFJ", friendType ?? "ENTP");
  const hasDeep = isPurchased("com.nikkiai.typelink.deep_compatibility");

  const scoreColor =
    result.score >= 85 ? "#E74C3C" : result.score >= 70 ? "#F39C12" : "#7B5EA7";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.matchup}>
        <View style={styles.typeBox}>
          <Text style={styles.emoji}>{my.emoji}</Text>
          <Text style={[styles.code, { color: my.color }]}>{my.code}</Text>
          <Text style={styles.name}>{my.name}</Text>
        </View>

        <Text style={styles.times}>×</Text>

        <View style={styles.typeBox}>
          <Text style={styles.emoji}>{friend.emoji}</Text>
          <Text style={[styles.code, { color: friend.color }]}>{friend.code}</Text>
          <Text style={styles.name}>{friend.name}</Text>
        </View>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>相性スコア</Text>
        <Text style={[styles.score, { color: scoreColor }]}>
          {result.score}
          <Text style={styles.scoreUnit}>%</Text>
        </Text>
        <View style={[styles.labelBadge, { backgroundColor: scoreColor + "20" }]}>
          <Text style={[styles.labelText, { color: scoreColor }]}>
            {result.label}
          </Text>
        </View>
      </View>

      <View style={styles.commentCard}>
        <Text style={styles.commentText}>{result.comment}</Text>
      </View>

      {/* ディープ分析セクション */}
      {hasDeep && result.deep ? (
        <>
          <View style={styles.deepSection}>
            <Text style={styles.deepSectionTitle}>💡 関係性のアドバイス</Text>
            <Text style={styles.deepText}>{result.deep.advice}</Text>
          </View>

          <View style={styles.deepSection}>
            <Text style={styles.deepSectionTitle}>⚠️ 注意すべきポイント</Text>
            <Text style={styles.deepText}>{result.deep.caution}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.mapButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.push({ pathname: "/compat-map", params: { myType: myType ?? "INFJ" } })}
          >
            <Text style={styles.mapButtonText}>🗺️ 全16タイプ相性マップを見る</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.lockedCard}>
          <View style={styles.lockedPreview}>
            <Text style={styles.lockedPreviewTitle}>💎 ディープ相性分析</Text>
            <Text style={styles.lockedPreviewItem}>・関係性のアドバイス</Text>
            <Text style={styles.lockedPreviewItem}>・注意すべきポイント</Text>
            <Text style={styles.lockedPreviewItem}>・全16タイプ相性マップ</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.unlockButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => purchase("com.nikkiai.typelink.deep_compatibility")}
          >
            <Text style={styles.unlockButtonText}>🔒 ディープ分析をアンロック ¥160</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: "#7B5EA7", opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>他の友達もチェック</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.replace("/")}
        >
          <Text style={[styles.buttonText, { color: "#7B5EA7" }]}>
            ホームに戻る
          </Text>
        </Pressable>
      </View>
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
  matchup: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 28,
  },
  typeBox: {
    alignItems: "center",
    width: 120,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  code: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
  name: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  times: {
    fontSize: 28,
    fontWeight: "300",
    color: "#CCC",
    marginHorizontal: 16,
  },
  scoreCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#9B8AB8",
    marginBottom: 8,
  },
  score: {
    fontSize: 64,
    fontWeight: "800",
  },
  scoreUnit: {
    fontSize: 24,
    fontWeight: "600",
  },
  labelBadge: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "700",
  },
  commentCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 16,
  },
  commentText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
    textAlign: "center",
  },
  deepSection: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#7B5EA7",
  },
  deepSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4A3870",
    marginBottom: 10,
  },
  deepText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  mapButton: {
    backgroundColor: "#F0EAF7",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7B5EA7",
  },
  lockedCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 24,
    opacity: 0.85,
    borderWidth: 1,
    borderColor: "#E8E0F0",
  },
  lockedPreview: {
    marginBottom: 16,
  },
  lockedPreviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A3870",
    marginBottom: 12,
  },
  lockedPreviewItem: {
    fontSize: 14,
    color: "#9B8AB8",
    marginBottom: 4,
    lineHeight: 22,
  },
  unlockButton: {
    backgroundColor: "#7B5EA7",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  unlockButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#7B5EA7",
  },
});
