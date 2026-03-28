import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mbtiTypes } from "../../data/types";

export default function TypeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const type = mbtiTypes[id ?? ""] ?? mbtiTypes.INFJ;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, { backgroundColor: type.color }]}>
        <Text style={styles.emoji}>{type.emoji}</Text>
        <Text style={styles.code}>{type.code}</Text>
        <Text style={styles.name}>{type.name}</Text>
        <Text style={styles.nickname}>{type.nickname}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>概要</Text>
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

      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>戻る</Text>
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
  },
  header: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  code: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  nickname: {
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
  backButton: {
    marginTop: 12,
    backgroundColor: "#7B5EA7",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
