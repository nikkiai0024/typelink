import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { typeList, mbtiTypes } from "../data/types";
import TypeCard from "../components/TypeCard";
import { usePurchase } from "../hooks/usePurchase";
import AdBanner from "../components/AdBanner";

type LastResult = { type: string; date: string; mode: "quick" | "detail" } | null;

export default function HomeScreen() {
  const router = useRouter();
  const { isPurchased, isAdFree, refresh } = usePurchase();
  const hasDetailed = isPurchased("com.nikkiai.typelink.detailed_diagnosis");
  const [lastResult, setLastResult] = useState<LastResult>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
      AsyncStorage.getItem("@typelink_last_result").then((val) => {
        if (val) setLastResult(JSON.parse(val));
      });
      return () => {};
    }, [refresh])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.logo}>TypeLink</Text>
        <Text style={styles.subtitle}>クイック性格タイプ診断</Text>
        <Text style={styles.description}>
          たった20問であなたの性格タイプがわかる。{"\n"}
          結果をシェアして、友達との相性もチェック！
        </Text>

        {lastResult && (() => {
          const t = mbtiTypes[lastResult.type];
          if (!t) return null;
          return (
            <Pressable
              style={({ pressed }) => [styles.lastResultCard, { opacity: pressed ? 0.85 : 1 }]}
              onPress={() => router.push(`/result?type=${lastResult.type}`)}
            >
              <Text style={styles.lastResultEmoji}>{t.emoji}</Text>
              <View style={styles.lastResultText}>
                <Text style={styles.lastResultLabel}>前回の結果</Text>
                <Text style={[styles.lastResultType, { color: t.color }]}>{t.code} {t.name}</Text>
                <Text style={styles.lastResultDate}>{lastResult.date} · {lastResult.mode === "detail" ? "ガチ診断" : "クイック診断"}</Text>
              </View>
              <Text style={styles.lastResultArrow}>›</Text>
            </Pressable>
          );
        })()}

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.push("/quiz?mode=quick")}
        >
          <Text style={styles.startButtonText}>クイック診断（20問）</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.detailedButton,
            !hasDetailed && styles.lockedButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => {
            if (hasDetailed) {
              router.push("/quiz?mode=detailed");
            } else {
              router.push("/pro");
            }
          }}
        >
          <Text style={[styles.detailedButtonText, !hasDetailed && styles.lockedButtonText]}>
            {hasDetailed ? "🔬 ガチ診断（60問）" : "🔒 ガチ診断（60問）"}
          </Text>
          {!hasDetailed && (
            <Text style={styles.priceTag}>¥320</Text>
          )}
        </Pressable>
      </View>

      {/* Pro への導線 */}
      <Pressable
        style={({ pressed }) => [styles.proCard, { opacity: pressed ? 0.9 : 1 }]}
        onPress={() => router.push("/pro")}
      >
        <Text style={styles.proCardEmoji}>👑</Text>
        <View style={styles.proCardInfo}>
          <Text style={styles.proCardTitle}>TypeLink Pro</Text>
          <Text style={styles.proCardDesc}>全機能アンロック ¥480〜</Text>
        </View>
        <Text style={styles.proCardArrow}>→</Text>
      </Pressable>

      <AdBanner hidden={isAdFree} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>全16タイプ一覧</Text>
        {typeList.map((t) => (
          <TypeCard
            key={t.code}
            type={t}
            onPress={() => router.push(`/types/${t.code}`)}
          />
        ))}
      </View>

      <Text style={styles.disclaimer}>
        ※ この診断は心理学的な指標に基づく性格傾向の参考であり、{"\n"}
        医学的・臨床的な診断ではありません。
      </Text>
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
  },
  hero: {
    alignItems: "center",
    paddingVertical: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: "800",
    color: "#7B5EA7",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#9B8AB8",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 16,
  },
  lastResultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E8E0F4",
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  lastResultEmoji: { fontSize: 32, marginRight: 12 },
  lastResultText: { flex: 1 },
  lastResultLabel: { fontSize: 11, color: "#9B8AB8", marginBottom: 2 },
  lastResultType: { fontSize: 16, fontWeight: "700" },
  lastResultDate: { fontSize: 11, color: "#BBB", marginTop: 2 },
  lastResultArrow: { fontSize: 22, color: "#C0B0D8", fontWeight: "300" },
  startButton: {
    marginTop: 20,
    backgroundColor: "#7B5EA7",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  detailedButton: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#7B5EA7",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  detailedButtonText: {
    color: "#7B5EA7",
    fontSize: 18,
    fontWeight: "700",
  },
  lockedButton: {
    borderColor: "#C4B5D9",
    backgroundColor: "#F9F5FF",
  },
  lockedButtonText: {
    color: "#9B8AB8",
  },
  priceTag: {
    backgroundColor: "#7B5EA7",
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E0D4F0",
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  proCardEmoji: { fontSize: 28, marginRight: 12 },
  proCardInfo: { flex: 1 },
  proCardTitle: { fontSize: 16, fontWeight: "700", color: "#4A3870" },
  proCardDesc: { fontSize: 13, color: "#9B8AB8", marginTop: 2 },
  proCardArrow: { fontSize: 18, color: "#9B8AB8" },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A3870",
    marginBottom: 16,
  },
  disclaimer: {
    marginTop: 32,
    fontSize: 11,
    color: "#AAA",
    textAlign: "center",
    lineHeight: 18,
  },
});
