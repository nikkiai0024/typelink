import React from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import PurchaseButton from "../components/PurchaseButton";
import { usePurchase, products } from "../hooks/usePurchase";

export default function ProScreen() {
  const router = useRouter();
  const { purchase, restore, isPurchased } = usePurchase();

  const handlePurchase = async (productId: string) => {
    try {
      await purchase(productId as any);
    } catch {
      // Errors are handled in usePurchase's onPurchaseError callback
    }
  };

  const handleRestore = async () => {
    const restored = await restore();
    if (restored) {
      Alert.alert("リストア完了", "購入履歴を復元しました。");
    } else {
      Alert.alert("リストア", "復元できる購入履歴が見つかりませんでした。");
    }
  };

  const bundle = products.find((p) => p.id === "com.nikkiai.typelink.pro_bundle")!;
  const individual = products.filter((p) => p.id !== "com.nikkiai.typelink.pro_bundle");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.proIcon}>👑</Text>
        <Text style={styles.title}>TypeLink Pro</Text>
        <Text style={styles.subtitle}>
          全機能をアンロックして、{"\n"}より深い自己理解を
        </Text>
      </View>

      {/* バンドル（おすすめ） */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>おすすめプラン</Text>
        <PurchaseButton
          title={bundle.title}
          price={bundle.price}
          description={bundle.description}
          purchased={isPurchased(bundle.id)}
          featured
          onPress={() => handlePurchase(bundle.id)}
        />
        <Text style={styles.bundleNote}>
          個別購入合計 ¥640 → バンドル ¥480（25%お得！）
        </Text>
      </View>

      {/* 個別購入 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>個別購入</Text>
        {individual.map((product) => (
          <PurchaseButton
            key={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
            purchased={isPurchased(product.id)}
            onPress={() => handlePurchase(product.id)}
          />
        ))}
      </View>

      {/* 機能一覧 */}
      <View style={styles.featureSection}>
        <Text style={styles.sectionTitle}>各機能の詳細</Text>

        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>🔬</Text>
          <Text style={styles.featureTitle}>ガチ診断</Text>
          <Text style={styles.featureDesc}>
            60問の詳細な診断で精密な結果を取得。{"\n"}
            認知機能（Ti/Te/Fi/Fe/Ni/Ne/Si/Se）のスコアをレーダーチャートで可視化。{"\n"}
            恋愛傾向・仕事適性・成長アドバイスの詳細レポート付き。
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>🎨</Text>
          <Text style={styles.featureTitle}>プレミアムカード</Text>
          <Text style={styles.featureDesc}>
            グラデーション、ミニマル、パステル、ネオン、{"\n"}
            和風、K-POP風、水彩、フォトフレームの{"\n"}
            8種類のおしゃれなシェアカードデザイン。
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>💞</Text>
          <Text style={styles.featureTitle}>ディープ相性分析</Text>
          <Text style={styles.featureDesc}>
            友達・恋人との深い相性を分析。{"\n"}
            全16タイプとの相性マップつき。
          </Text>
        </View>
      </View>

      {/* リストア */}
      <Pressable
        style={({ pressed }) => [styles.restoreButton, { opacity: pressed ? 0.7 : 1 }]}
        onPress={handleRestore}
      >
        <Text style={styles.restoreText}>購入を復元する</Text>
      </Pressable>

      <Text style={styles.disclaimer}>
        ※ 購入はApp Store経由で安全に処理されます。{"\n"}
        購入履歴は「購入を復元する」からいつでも復元できます。
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F5FB" },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: "center", paddingVertical: 32 },
  proIcon: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 28, fontWeight: "800", color: "#7B5EA7", letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15, color: "#9B8AB8", textAlign: "center", marginTop: 8, lineHeight: 22,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18, fontWeight: "700", color: "#4A3870", marginBottom: 14,
  },
  bundleNote: {
    textAlign: "center", fontSize: 13, color: "#E74C3C", fontWeight: "600", marginTop: 4,
  },
  featureSection: { marginBottom: 24 },
  featureCard: {
    backgroundColor: "#FFF", borderRadius: 16, padding: 20, marginBottom: 12,
    shadowColor: "#7B5EA7", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  featureEmoji: { fontSize: 32, marginBottom: 8 },
  featureTitle: { fontSize: 16, fontWeight: "700", color: "#4A3870", marginBottom: 8 },
  featureDesc: { fontSize: 13, color: "#666", lineHeight: 20 },
  restoreButton: {
    alignItems: "center", paddingVertical: 14,
  },
  restoreText: {
    fontSize: 14, color: "#9B8AB8", textDecorationLine: "underline",
  },
  disclaimer: {
    marginTop: 16, fontSize: 11, color: "#AAA", textAlign: "center", lineHeight: 18,
  },
});
