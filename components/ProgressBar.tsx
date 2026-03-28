import React from "react";
import { View, StyleSheet, Text } from "react-native";

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const progress = current / total;

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.label}>
        {current} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  barBackground: {
    height: 8,
    backgroundColor: "#E8E0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#7B5EA7",
    borderRadius: 4,
  },
  label: {
    marginTop: 6,
    textAlign: "right",
    fontSize: 13,
    color: "#9B8AB8",
  },
});
