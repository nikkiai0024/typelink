import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { MBTIType } from "../data/types";

interface Props {
  type: MBTIType;
  onPress?: () => void;
}

export default function TypeCard({ type, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: type.color, opacity: pressed ? 0.85 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{type.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.code, { color: type.color }]}>{type.code}</Text>
          <Text style={styles.name}>{type.name}</Text>
        </View>
      </View>
      <Text style={styles.nickname}>{type.nickname}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  code: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  name: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  nickname: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
});
