import React, { useRef, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import ViewShot from "react-native-view-shot";
import type { MBTIType } from "../data/types";
import ShareButtons from "./ShareButtons";

interface Props {
  type: MBTIType;
}

export default function ShareCard({ type }: Props) {
  const viewShotRef = useRef<ViewShot>(null);

  const captureImage = useCallback(async () => {
    return await viewShotRef.current?.capture?.();
  }, []);

  return (
    <View style={styles.wrapper}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1, width: 1080, height: 1080 }}
      >
        <View style={[styles.card, { backgroundColor: type.color }]}>
          <Text style={styles.appName}>TypeLink</Text>
          <Text style={styles.emoji}>{type.emoji}</Text>
          <Text style={styles.code}>{type.code}</Text>
          <Text style={styles.name}>{type.name}</Text>
          <Text style={styles.nickname}>{type.nickname}</Text>
          <View style={styles.divider} />
          <Text style={styles.caption}>{type.shareCaption}</Text>
          <Text style={styles.disclaimer}>性格タイプ診断</Text>
        </View>
      </ViewShot>

      <ShareButtons
        captureImage={captureImage}
        typeCode={type.code}
        typeName={type.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginVertical: 20,
  },
  card: {
    width: 320,
    height: 320,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  appName: {
    position: "absolute",
    top: 16,
    left: 20,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  code: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
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
  divider: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginVertical: 12,
    borderRadius: 1,
  },
  caption: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  disclaimer: {
    position: "absolute",
    bottom: 16,
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
  },
});
