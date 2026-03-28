import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  message?: string;
  onPress: () => void;
}

export default function LockedOverlay({ message = "この機能をアンロック", onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.overlay, { opacity: pressed ? 0.9 : 1 }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.button}>
          <Text style={styles.buttonText}>アンロックする</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(247, 245, 251, 0.85)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  lockIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A3870",
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#7B5EA7",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
