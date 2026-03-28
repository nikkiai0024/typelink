import React, { useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import ViewShot from "react-native-view-shot";
import type { MBTIType } from "../data/types";
import ShareButtons from "./ShareButtons";

interface Props {
  type: MBTIType;
  locked?: boolean;
  onLockedPress?: () => void;
  previewOnly?: boolean;
}

const CARD_SIZE = 340;

const DESIGN_IDS = [
  "gradient",
  "minimal",
  "pastel",
  "neon",
  "washi",
  "kpop",
  "watercolor",
  "frame",
] as const;

const DESIGN_NAMES: Record<string, string> = {
  gradient: "グラデーション",
  minimal: "ミニマル",
  pastel: "パステル",
  neon: "ネオン",
  washi: "和風",
  kpop: "K-POP風",
  watercolor: "水彩",
  frame: "フォトフレーム",
};

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round((255 * percent) / 100));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round((255 * percent) / 100));
  const b = Math.min(255, (num & 0xff) + Math.round((255 * percent) / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darken(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round((255 * percent) / 100));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round((255 * percent) / 100));
  const b = Math.max(0, (num & 0xff) - Math.round((255 * percent) / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ── Individual card renderers ──

function GradientCard({ type }: { type: MBTIType }) {
  const c1 = type.color;
  const c2 = lighten(c1, 25);
  const c3 = darken(c1, 15);
  return (
    <View style={[cardBase, { backgroundColor: c1 }]}>
      {/* 3-color diagonal gradient effect with overlapping translucent shapes */}
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        <View style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, borderRadius: 140, backgroundColor: c2 + "55" }} />
        <View style={{ position: "absolute", bottom: -40, right: -40, width: 240, height: 240, borderRadius: 120, backgroundColor: c3 + "66" }} />
        <View style={{ position: "absolute", top: 80, right: -20, width: 160, height: 160, borderRadius: 80, backgroundColor: c2 + "44" }} />
      </View>
      {/* Subtle grid pattern */}
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={`h${i}`} style={{ position: "absolute", top: i * (CARD_SIZE / 8), left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={`v${i}`} style={{ position: "absolute", left: i * (CARD_SIZE / 8), top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
      ))}
      {/* Content: top-left aligned */}
      <View style={{ flex: 1, justifyContent: "space-between", padding: 28 }}>
        <View>
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: "600", letterSpacing: 1 }}>TypeLink</Text>
        </View>
        <View>
          <Text style={{ fontSize: 44, marginBottom: 4 }}>{type.emoji}</Text>
          <Text style={{ fontSize: 42, fontWeight: "900", color: "#FFF", letterSpacing: 4 }}>{type.code}</Text>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "rgba(255,255,255,0.9)", marginTop: 4 }}>{type.name}</Text>
          <View style={{ width: 40, height: 3, backgroundColor: "rgba(255,255,255,0.5)", marginVertical: 10, borderRadius: 2 }} />
          <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 18 }}>{type.shareCaption}</Text>
        </View>
      </View>
    </View>
  );
}

function MinimalCard({ type }: { type: MBTIType }) {
  return (
    <View style={[cardBase, { backgroundColor: "#0A0A0A" }]}>
      {/* Single thin white border - Bauhaus inspired */}
      <View style={{ ...StyleSheet.absoluteFillObject, margin: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)", borderRadius: 18 }} />
      {/* Huge type code centered */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 72, fontWeight: "900", color: "#FFF", letterSpacing: 8 }}>{type.code}</Text>
        <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 12, fontWeight: "500", letterSpacing: 3, textTransform: "uppercase" }}>{type.name}</Text>
      </View>
      {/* Minimal info at bottom */}
      <View style={{ position: "absolute", bottom: 28, left: 28, right: 28, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontWeight: "600" }}>TYPELINK</Text>
        <Text style={{ fontSize: 20 }}>{type.emoji}</Text>
      </View>
    </View>
  );
}

function PastelCard({ type }: { type: MBTIType }) {
  const base = lighten(type.color, 55);
  const blob1 = lighten(type.color, 45) + "88";
  const blob2 = lighten("#FF69B4", 40) + "66";
  const blob3 = lighten("#87CEEB", 35) + "77";
  return (
    <View style={[cardBase, { backgroundColor: base }]}>
      {/* Soft floating blob shapes */}
      <View style={{ position: "absolute", top: -30, right: 20, width: 140, height: 140, borderRadius: 70, backgroundColor: blob1 }} />
      <View style={{ position: "absolute", bottom: 40, left: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: blob2 }} />
      <View style={{ position: "absolute", top: 100, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: blob3 }} />
      <View style={{ position: "absolute", bottom: -20, right: 60, width: 90, height: 90, borderRadius: 45, backgroundColor: blob1 }} />
      <View style={{ position: "absolute", top: 40, left: 40, width: 60, height: 60, borderRadius: 30, backgroundColor: blob2 }} />
      {/* Content centered with soft shadow feel */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 10, color: "#9B7EC0", fontWeight: "600", letterSpacing: 2, marginBottom: 16 }}>TYPELINK</Text>
        <Text style={{ fontSize: 52, marginBottom: 6 }}>{type.emoji}</Text>
        <Text style={{ fontSize: 32, fontWeight: "800", color: "#4A3870", letterSpacing: 3 }}>{type.code}</Text>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#6B5290", marginTop: 6 }}>{type.name}</Text>
        <View style={{ width: 30, height: 2, backgroundColor: "#B8A0D4", marginVertical: 12, borderRadius: 1 }} />
        <Text style={{ fontSize: 12, color: "#8B72AE", textAlign: "center", lineHeight: 18 }}>{type.shareCaption}</Text>
      </View>
    </View>
  );
}

function NeonCard({ type }: { type: MBTIType }) {
  return (
    <View style={[cardBase, { backgroundColor: "#0D0D0D" }]}>
      {/* Glowing neon border - multiple layered shadows */}
      <View style={{
        ...StyleSheet.absoluteFillObject, margin: 10, borderWidth: 2, borderColor: "#00FF88", borderRadius: 18,
        shadowColor: "#00FF88", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 12, elevation: 8,
      }} />
      <View style={{
        ...StyleSheet.absoluteFillObject, margin: 8, borderWidth: 1, borderColor: "#FF00AA33", borderRadius: 20,
        shadowColor: "#FF00AA", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 4,
      }} />
      {/* Neon glow spots */}
      <View style={{ position: "absolute", top: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: "#00FF8810",
        shadowColor: "#00FF88", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20 }} />
      <View style={{ position: "absolute", bottom: 50, left: 30, width: 40, height: 40, borderRadius: 20, backgroundColor: "#FF00AA10",
        shadowColor: "#FF00AA", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 15 }} />
      {/* Content - left aligned, cyberpunk style */}
      <View style={{ flex: 1, justifyContent: "flex-end", padding: 32 }}>
        <Text style={{ fontSize: 10, color: "#00FF8899", letterSpacing: 4, fontWeight: "700", marginBottom: 8 }}>TYPELINK://</Text>
        <Text style={{ fontSize: 48, marginBottom: 4 }}>{type.emoji}</Text>
        <Text style={{ fontSize: 40, fontWeight: "900", color: "#00FF88", letterSpacing: 5,
          textShadowColor: "#00FF88", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }}>{type.code}</Text>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#FF00AA", marginTop: 4,
          textShadowColor: "#FF00AA", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 }}>{type.name}</Text>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 10, lineHeight: 17 }}>{type.shareCaption}</Text>
      </View>
      <Text style={{ position: "absolute", top: 20, right: 20, fontSize: 10, color: "#00FF8844", fontWeight: "600" }}>NEON</Text>
    </View>
  );
}

function WashiCard({ type }: { type: MBTIType }) {
  return (
    <View style={[cardBase, { backgroundColor: "#F5E6D3" }]}>
      {/* Washi paper texture - subtle wave/circle pattern */}
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={`wave${i}`} style={{
          position: "absolute", top: 20 + i * 55, left: -40, right: -40, height: 50,
          borderRadius: 25, borderWidth: 1, borderColor: "rgba(91,58,41,0.06)",
        }} />
      ))}
      {/* Small circle pattern like washi texture */}
      {Array.from({ length: 12 }).map((_, i) => (
        <View key={`dot${i}`} style={{
          position: "absolute",
          top: (i * 73) % CARD_SIZE,
          left: (i * 97 + 30) % CARD_SIZE,
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: "rgba(91,58,41,0.05)",
        }} />
      ))}
      {/* Content - vertical Japanese style layout */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 28 }}>
        <Text style={{ fontSize: 12, color: "#8B6F5E", letterSpacing: 6, fontWeight: "500", marginBottom: 20 }}>性格診断</Text>
        <Text style={{ fontSize: 48, marginBottom: 8 }}>{type.emoji}</Text>
        <Text style={{ fontSize: 34, fontWeight: "800", color: "#5B3A29", letterSpacing: 4 }}>{type.code}</Text>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#7A5C4B", marginTop: 6 }}>{type.name}</Text>
        <View style={{ width: 1, height: 30, backgroundColor: "#5B3A2940", marginVertical: 10 }} />
        <Text style={{ fontSize: 12, color: "#8B6F5E", textAlign: "center", lineHeight: 20 }}>{type.shareCaption}</Text>
      </View>
      {/* 印 (seal/stamp) in corner */}
      <View style={{
        position: "absolute", top: 20, right: 20,
        width: 40, height: 40, borderRadius: 20,
        borderWidth: 2, borderColor: "#C41E3A",
        alignItems: "center", justifyContent: "center",
      }}>
        <Text style={{ fontSize: 14, color: "#C41E3A", fontWeight: "900" }}>印</Text>
      </View>
      <Text style={{ position: "absolute", bottom: 16, left: 20, fontSize: 10, color: "#B8A090", fontWeight: "500" }}>TypeLink</Text>
    </View>
  );
}

function KpopCard({ type }: { type: MBTIType }) {
  return (
    <View style={[cardBase, { backgroundColor: "#7B2D8E" }]}>
      {/* Bold pink-purple gradient bg */}
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "#FF69B4", opacity: 0.4 }} />
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: CARD_SIZE * 0.6, backgroundColor: "#7B2D8E88", borderBottomLeftRadius: 200, borderBottomRightRadius: 200 }} />
      {/* Sparkle/star decorations scattered */}
      <Text style={{ position: "absolute", top: 16, left: 20, fontSize: 20 }}>✨</Text>
      <Text style={{ position: "absolute", top: 50, right: 30, fontSize: 16 }}>⭐</Text>
      <Text style={{ position: "absolute", top: 14, right: 80, fontSize: 12 }}>💫</Text>
      <Text style={{ position: "absolute", bottom: 80, left: 16, fontSize: 18 }}>💖</Text>
      <Text style={{ position: "absolute", bottom: 30, right: 20, fontSize: 14 }}>✨</Text>
      <Text style={{ position: "absolute", top: 90, left: 30, fontSize: 10 }}>⭐</Text>
      <Text style={{ position: "absolute", bottom: 120, right: 16, fontSize: 12 }}>💫</Text>
      {/* Heart shapes */}
      <Text style={{ position: "absolute", top: 30, left: 100, fontSize: 22 }}>♡</Text>
      <Text style={{ position: "absolute", bottom: 60, right: 70, fontSize: 18, color: "rgba(255,255,255,0.4)" }}>♡</Text>
      {/* Content - photo card aesthetic, centered */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View style={{
          backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, padding: 20, alignItems: "center",
          borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
        }}>
          <Text style={{ fontSize: 52, marginBottom: 6 }}>{type.emoji}</Text>
          <Text style={{ fontSize: 36, fontWeight: "900", color: "#FFF", letterSpacing: 3,
            textShadowColor: "#FF69B4", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 }}>{type.code}</Text>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "rgba(255,255,255,0.95)", marginTop: 4 }}>{type.name}</Text>
        </View>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 14, textAlign: "center", lineHeight: 17 }}>{type.shareCaption}</Text>
      </View>
      <Text style={{ position: "absolute", bottom: 14, fontSize: 10, color: "rgba(255,255,255,0.4)", alignSelf: "center" }}>TypeLink ♡ K-POP</Text>
    </View>
  );
}

function WatercolorCard({ type }: { type: MBTIType }) {
  const c1 = lighten(type.color, 40) + "55";
  const c2 = lighten("#6BB5E0", 30) + "44";
  const c3 = lighten("#E0A06B", 30) + "44";
  const c4 = lighten("#B06BE0", 30) + "55";
  const c5 = lighten("#6BE0A0", 35) + "44";
  return (
    <View style={[cardBase, { backgroundColor: "#FAFBFD" }]}>
      {/* Soft organic blob shapes - watercolor-like translucent overlapping circles */}
      <View style={{ position: "absolute", top: -30, left: 30, width: 180, height: 180, borderRadius: 90, backgroundColor: c1 }} />
      <View style={{ position: "absolute", top: 60, right: -20, width: 150, height: 150, borderRadius: 75, backgroundColor: c2 }} />
      <View style={{ position: "absolute", bottom: -20, left: -10, width: 160, height: 160, borderRadius: 80, backgroundColor: c3 }} />
      <View style={{ position: "absolute", bottom: 40, right: 30, width: 130, height: 130, borderRadius: 65, backgroundColor: c4 }} />
      <View style={{ position: "absolute", top: 120, left: 80, width: 100, height: 100, borderRadius: 50, backgroundColor: c5 }} />
      <View style={{ position: "absolute", top: 20, right: 60, width: 80, height: 80, borderRadius: 40, backgroundColor: c1 }} />
      {/* Content - right-aligned, artistic */}
      <View style={{ flex: 1, justifyContent: "center", padding: 30, alignItems: "flex-end" }}>
        <Text style={{ fontSize: 44, marginBottom: 6 }}>{type.emoji}</Text>
        <Text style={{ fontSize: 36, fontWeight: "800", color: "#4A3870", letterSpacing: 3 }}>{type.code}</Text>
        <Text style={{ fontSize: 15, fontWeight: "600", color: "#6B5290", marginTop: 4 }}>{type.name}</Text>
        <View style={{ width: 30, height: 2, backgroundColor: "#B8A0D4", marginVertical: 10, borderRadius: 1 }} />
        <Text style={{ fontSize: 12, color: "#8B72AE", textAlign: "right", lineHeight: 18, maxWidth: 200 }}>{type.shareCaption}</Text>
      </View>
      <Text style={{ position: "absolute", top: 18, left: 20, fontSize: 10, color: "#B8A0D480", fontWeight: "600", letterSpacing: 1 }}>TypeLink</Text>
    </View>
  );
}

function FrameCard({ type }: { type: MBTIType }) {
  return (
    <View style={[cardBase, { backgroundColor: "#FFFEF9" }]}>
      {/* Elegant double border with gold accent - polaroid aesthetic */}
      <View style={{
        ...StyleSheet.absoluteFillObject, margin: 10,
        borderWidth: 2, borderColor: "#C8A96E", borderRadius: 18,
      }} />
      <View style={{
        ...StyleSheet.absoluteFillObject, margin: 16,
        borderWidth: 1, borderColor: "#C8A96E55", borderRadius: 14,
      }} />
      {/* Polaroid-style layout: content area top, type info strip at bottom */}
      <View style={{ flex: 1, margin: 24 }}>
        {/* Main content area */}
        <View style={{
          flex: 1, backgroundColor: "#F8F5EE", borderRadius: 10,
          alignItems: "center", justifyContent: "center",
          borderWidth: 1, borderColor: "#E8E0D0",
        }}>
          <Text style={{ fontSize: 56, marginBottom: 8 }}>{type.emoji}</Text>
          <Text style={{ fontSize: 38, fontWeight: "900", color: "#333", letterSpacing: 4 }}>{type.code}</Text>
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#666", marginTop: 6 }}>{type.name}</Text>
        </View>
        {/* Bottom strip like polaroid */}
        <View style={{ paddingTop: 10, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: "#999", fontStyle: "italic", textAlign: "center" }}>{type.shareCaption}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 6 }}>
            <Text style={{ fontSize: 9, color: "#C8A96E", fontWeight: "600", letterSpacing: 1 }}>TypeLink</Text>
            <Text style={{ fontSize: 9, color: "#C8A96E88" }}>フォトフレーム</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const cardRenderers: Record<string, React.FC<{ type: MBTIType }>> = {
  gradient: GradientCard,
  minimal: MinimalCard,
  pastel: PastelCard,
  neon: NeonCard,
  washi: WashiCard,
  kpop: KpopCard,
  watercolor: WatercolorCard,
  frame: FrameCard,
};

const cardBase: any = {
  width: CARD_SIZE,
  height: CARD_SIZE,
  borderRadius: 24,
  overflow: "hidden",
  alignSelf: "center",
};

export default function PremiumShareCards({ type, locked, onLockedPress, previewOnly }: Props) {
  const displayIds = previewOnly ? DESIGN_IDS.slice(0, 2) : DESIGN_IDS;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const viewShotRef = useRef<ViewShot>(null);

  const designId = displayIds[selectedIndex];
  const CardRenderer = cardRenderers[designId];

  const captureImage = useCallback(async () => {
    return await viewShotRef.current?.capture?.();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>
        {locked ? "🔒 プレミアムカード" : "プレミアムカード"}
      </Text>

      {/* デザイン選択 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.designPicker}>
        {displayIds.map((id, i) => (
          <Pressable
            key={id}
            style={[styles.designChip, i === selectedIndex && styles.designChipActive]}
            onPress={() => setSelectedIndex(i)}
          >
            <Text style={[styles.designChipText, i === selectedIndex && styles.designChipTextActive]}>
              {DESIGN_NAMES[id]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* カードプレビュー */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1, width: 1080, height: 1080 }}
      >
        <View>
          <CardRenderer type={type} />
          {locked && <View style={styles.lockedOverlay} />}
        </View>
      </ViewShot>

      {locked ? (
        <Pressable
          style={({ pressed }) => [
            styles.unlockButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={onLockedPress}
        >
          <Text style={styles.unlockButtonText}>🔒 全デザインをアンロック ¥160</Text>
        </Pressable>
      ) : (
        <ShareButtons
          captureImage={captureImage}
          typeCode={type.code}
          typeName={type.name}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A3870",
    marginBottom: 12,
  },
  designPicker: {
    marginBottom: 16,
  },
  designChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F0EAF7",
    marginRight: 8,
  },
  designChipActive: {
    backgroundColor: "#7B5EA7",
  },
  designChipText: {
    fontSize: 13,
    color: "#7B5EA7",
    fontWeight: "600",
  },
  designChipTextActive: {
    color: "#FFF",
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 24,
  },
  unlockButton: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#7B5EA7",
  },
  unlockButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
