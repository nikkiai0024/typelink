import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mbtiTypes } from "../data/types";
import ShareCard from "../components/ShareCard";
import PremiumShareCards from "../components/PremiumShareCards";
import { usePurchase } from "../hooks/usePurchase";

export default function ResultScreen() {
  const { type: typeCode } = useLocalSearchParams<{ type: string }>();

  useEffect(() => {
    if (typeCode) {
      AsyncStorage.setItem("@typelink_last_result", JSON.stringify({
        type: typeCode,
        date: new Date().toISOString().slice(0, 10),
        mode: "quick",
      }));
    }
  }, [typeCode]);
  const router = useRouter();
  const { isPurchased } = usePurchase();
  const type = mbtiTypes[typeCode ?? ""] ?? mbtiTypes.INFJ;
  const hasPremiumCards = isPurchased("com.nikkiai.typelink.premium_cards");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.resultLabel}>あなたのタイプは…</Text>

      <View style={[styles.typeHeader, { backgroundColor: type.color }]}>
        <Text style={styles.emoji}>{type.emoji}</Text>
        <Text style={styles.typeCode}>{type.code}</Text>
        <Text style={styles.typeName}>{type.name}</Text>
        <Text style={styles.typeNickname}>{type.nickname}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>タイプ説明</Text>
        <Text style={styles.bodyText}>{type.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>有名人の例</Text>
        <View style={styles.tagContainer}>
          {type.celebrities.map((c) => (
            <View key={c} style={[styles.tag, { backgroundColor: type.color + "20" }]}>
              <Text style={[styles.tagText, { color: type.color }]}>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.halfSection, { marginRight: 6 }]}>
          <Text style={styles.sectionTitle}>💪 強み</Text>
          {type.strengths.map((s) => (
            <Text key={s} style={styles.listItem}>• {s}</Text>
          ))}
        </View>
        <View style={[styles.halfSection, { marginLeft: 6 }]}>
          <Text style={styles.sectionTitle}>😅 弱み</Text>
          {type.weaknesses.map((w) => (
            <Text key={w} style={styles.listItem}>• {w}</Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💕 恋愛傾向</Text>
        <Text style={styles.bodyText}>{type.love}</Text>
      </View>

      <ShareCard type={type} />

      <PremiumShareCards
        type={type}
        locked={!hasPremiumCards}
        onLockedPress={() => router.push("/pro")}
        previewOnly={!hasPremiumCards}
      />

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: "#7B5EA7", opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.push(`/compatibility?myType=${type.code}`)}
        >
          <Text style={styles.actionButtonText}>友達との相性をチェック</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.secondaryButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.replace("/")}
        >
          <Text style={[styles.actionButtonText, { color: "#7B5EA7" }]}>
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
  },
  resultLabel: {
    textAlign: "center",
    fontSize: 16,
    color: "#9B8AB8",
    marginBottom: 16,
    fontWeight: "600",
  },
  typeHeader: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  typeCode: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 3,
  },
  typeName: {
    fontSize: 20,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  typeNickname: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A3870",
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  halfSection: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
  },
  listItem: {
    fontSize: 13,
    color: "#666",
    lineHeight: 22,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  actionButtonText: {
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
