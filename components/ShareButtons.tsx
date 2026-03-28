import React, { useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Linking, Platform } from "react-native";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

interface Props {
  captureImage: () => Promise<string | undefined>;
  typeCode: string;
  typeName: string;
}

export default function ShareButtons({ captureImage, typeCode, typeName }: Props) {
  const saveToMediaLibrary = useCallback(async (uri: string): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("写真ライブラリへのアクセスが必要です", "設定からアクセスを許可してください。");
      return false;
    }
    await MediaLibrary.saveToLibraryAsync(uri);
    return true;
  }, []);

  const handleShareX = useCallback(async () => {
    try {
      const uri = await captureImage();
      if (!uri) return;

      const saved = await saveToMediaLibrary(uri);
      if (!saved) return;

      const text = `私の性格タイプは${typeCode}（${typeName}）でした！\n#TypeLink #性格タイプ診断 #MBTI`;
      const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
      const canOpen = await Linking.canOpenURL(xUrl);
      if (canOpen) {
        Alert.alert("画像を保存しました", "Xの投稿画面を開きます。保存した画像を添付してください。", [
          { text: "OK", onPress: () => Linking.openURL(xUrl) },
        ]);
      } else {
        Alert.alert("画像を保存しました", "Xアプリを開けませんでした。カメラロールから画像を共有してください。");
      }
    } catch {
      Alert.alert("シェアに失敗しました");
    }
  }, [captureImage, typeCode, typeName, saveToMediaLibrary]);

  const handleShareInstagram = useCallback(async () => {
    try {
      const uri = await captureImage();
      if (!uri) return;

      const saved = await saveToMediaLibrary(uri);
      if (!saved) return;

      const igUrl = "instagram://app";
      const canOpen = await Linking.canOpenURL(igUrl);
      if (canOpen) {
        Alert.alert("画像を保存しました", "Instagramを開きます。保存した画像をストーリーズまたは投稿で共有してください。", [
          { text: "OK", onPress: () => Linking.openURL(igUrl) },
        ]);
      } else {
        Alert.alert("画像を保存しました", "Instagramアプリがインストールされていません。カメラロールから画像を共有してください。");
      }
    } catch {
      Alert.alert("シェアに失敗しました");
    }
  }, [captureImage, saveToMediaLibrary]);

  const handleShareOther = useCallback(async () => {
    try {
      const uri = await captureImage();
      if (!uri) return;

      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "性格タイプ診断の結果をシェア",
        });
      } else {
        Alert.alert("シェア機能はこのデバイスでは利用できません");
      }
    } catch {
      Alert.alert("シェアに失敗しました");
    }
  }, [captureImage]);

  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.button, styles.xButton, { opacity: pressed ? 0.85 : 1 }]}
        onPress={handleShareX}
      >
        <Text style={styles.xIcon}>𝕏</Text>
        <Text style={styles.xLabel}>Xでシェア</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.button, styles.igButton, { opacity: pressed ? 0.85 : 1 }]}
        onPress={handleShareInstagram}
      >
        <View style={styles.igIconWrap}>
          <View style={styles.igLens} />
          <View style={styles.igFlash} />
        </View>
        <Text style={styles.igLabel}>Instagramでシェア</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.button, styles.otherButton, { opacity: pressed ? 0.85 : 1 }]}
        onPress={handleShareOther}
      >
        <Text style={styles.otherIcon}>↗</Text>
        <Text style={styles.otherLabel}>その他</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    justifyContent: "center",
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    gap: 4,
  },
  xButton: {
    backgroundColor: "#000",
  },
  xIcon: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
  },
  xLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFF",
  },
  igButton: {
    backgroundColor: "#C13584",
  },
  igIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  igLens: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  igFlash: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#FFF",
  },
  igLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFF",
  },
  otherButton: {
    backgroundColor: "#7B5EA7",
  },
  otherIcon: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  otherLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFF",
  },
});
