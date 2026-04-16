import { useEffect, useRef } from "react";
import { Platform, AppState, AppStateStatus } from "react-native";
import { Stack } from "expo-router";
import mobileAds from "react-native-google-mobile-ads";
import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from "expo-tracking-transparency";

async function initializeAdsWithATT() {
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
  await mobileAds()
    .initialize()
    .catch((e) => console.warn("AdMob init error:", e));
}

export default function RootLayout() {
  const attRequested = useRef(false);

  useEffect(() => {
    // Request ATT when AppState becomes active.
    // This ensures the root view is fully rendered and the app is in foreground,
    // which is required for the ATT dialog to appear on iOS 17+ and iOS 26.
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active" && !attRequested.current) {
        attRequested.current = true;
        initializeAdsWithATT();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // Also trigger immediately if already active (handles fresh launch)
    if (AppState.currentState === "active" && !attRequested.current) {
      attRequested.current = true;
      initializeAdsWithATT();
    }

    return () => subscription.remove();
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
