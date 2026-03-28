import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

interface Props {
  title: string;
  price: string;
  description: string;
  purchased: boolean;
  featured?: boolean;
  onPress: () => void;
}

export default function PurchaseButton({
  title,
  price,
  description,
  purchased,
  featured,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        featured && styles.featured,
        purchased && styles.purchased,
        { opacity: pressed && !purchased ? 0.85 : 1 },
      ]}
      onPress={purchased ? undefined : onPress}
      disabled={purchased}
    >
      {featured && !purchased && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>おすすめ</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.title, purchased && styles.purchasedText]}>
          {purchased ? "✓ " : ""}{title}
        </Text>
        <Text style={[styles.description, purchased && styles.purchasedText]}>
          {description}
        </Text>
      </View>
      <Text style={[styles.price, purchased && styles.purchasedText]}>
        {purchased ? "購入済み" : price}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  featured: {
    borderColor: "#7B5EA7",
    backgroundColor: "#F9F5FF",
  },
  purchased: {
    backgroundColor: "#F0EAF7",
    borderColor: "#C4B5D9",
  },
  badge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: "#7B5EA7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A3870",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7B5EA7",
  },
  purchasedText: {
    color: "#9B8AB8",
  },
});
