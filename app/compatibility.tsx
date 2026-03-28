import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { typeList } from "../data/types";
import { usePurchase } from "../hooks/usePurchase";

export default function CompatibilityScreen() {
  const { myType } = useLocalSearchParams<{ myType: string }>();
  const router = useRouter();
  const { isPurchased, purchase } = usePurchase();
  const hasDeep = isPurchased("com.nikkiai.typelink.deep_compatibility");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>友達のタイプを選んでね</Text>
      <Text style={styles.subheading}>
        あなた（{myType}）と友達の相性をチェック！
      </Text>

      {/* 相性マップボタン */}
      <Pressable
        style={({ pressed }) => [styles.mapButton, { opacity: pressed ? 0.85 : 1 }]}
        onPress={() => {
          if (hasDeep) {
            router.push(`/compat-map?myType=${myType}`);
          } else {
            purchase("com.nikkiai.typelink.deep_compatibility");
          }
        }}
      >
        <Text style={styles.mapButtonIcon}>{hasDeep ? "🗺️" : "🔒"}</Text>
        <View style={styles.mapButtonTextWrap}>
          <Text style={styles.mapButtonTitle}>全16タイプ相性マップ</Text>
          <Text style={styles.mapButtonSub}>
            {hasDeep ? "一覧でチェック" : "ディープ相性分析で解放 ¥160"}
          </Text>
        </View>
        <Text style={styles.mapButtonArrow}>›</Text>
      </Pressable>

      <View style={styles.grid}>
        {typeList.map((t) => (
          <Pressable
            key={t.code}
            style={({ pressed }) => [
              styles.typeButton,
              { borderColor: t.color, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() =>
              router.push(
                `/compat-result?myType=${myType}&friendType=${t.code}`
              )
            }
          >
            <Text style={styles.typeEmoji}>{t.emoji}</Text>
            <Text style={[styles.typeCode, { color: t.color }]}>{t.code}</Text>
            <Text style={styles.typeName}>{t.name}</Text>
          </Pressable>
        ))}
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
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4A3870",
    textAlign: "center",
    marginTop: 8,
  },
  subheading: {
    fontSize: 14,
    color: "#9B8AB8",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#7B5EA7",
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  mapButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  mapButtonTextWrap: {
    flex: 1,
  },
  mapButtonTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4A3870",
  },
  mapButtonSub: {
    fontSize: 12,
    color: "#9B8AB8",
    marginTop: 2,
  },
  mapButtonArrow: {
    fontSize: 22,
    color: "#7B5EA7",
    fontWeight: "300",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  typeButton: {
    width: "47%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  typeEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  typeCode: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  typeName: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
