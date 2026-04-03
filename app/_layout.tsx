import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import mobileAds from "react-native-google-mobile-ads";
import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from "expo-tracking-transparency";

export default function RootLayout() {
  const [attDone, setAttDone] = useState(false);

  useEffect(() => {
    // ATT must be requested after the app is fully rendered (not during mount)
    // Using a short delay ensures the root view is visible before the system dialog appears
    const timer = setTimeout(async () => {
      if (Platform.OS === "ios") {
        try {
          const { status } = await getTrackingPermissionsAsync();
          if (status === "undetermined") {
            await requestTrackingPermissionsAsync();
          }
        } catch (e) {
          console.warn("ATT request failed:", e);
        }
      }
      setAttDone(true);

      await mobileAds()
        .initialize()
        .catch((e) => console.warn("AdMob init error:", e));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#F7F5FB" },
        headerTintColor: "#7B5EA7",
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: "#F7F5FB" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "TypeLink" }} />
      <Stack.Screen name="quiz" options={{ title: "診断", headerBackTitle: "戻る" }} />
      <Stack.Screen name="result" options={{ title: "診断結果", headerBackVisible: false }} />
      <Stack.Screen name="compatibility" options={{ title: "相性診断", headerBackTitle: "戻る" }} />
      <Stack.Screen name="compat-result" options={{ title: "相性結果", headerBackTitle: "戻る" }} />
      <Stack.Screen name="types/[id]" options={{ title: "タイプ詳細", headerBackTitle: "戻る" }} />
      <Stack.Screen name="detailed-result" options={{ title: "詳細診断結果", headerBackVisible: false }} />
      <Stack.Screen name="pro" options={{ title: "TypeLink Pro", headerBackTitle: "戻る" }} />
    </Stack>
  );
}
