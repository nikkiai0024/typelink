import { useState, useEffect, useCallback, useRef } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useIAP,
  ErrorCode,
  type Purchase,
  type ExpoPurchaseError,
} from "expo-iap";

export type ProductId =
  | "com.nikkiai.typelink.detailed_diagnosis"
  | "com.nikkiai.typelink.premium_cards"
  | "com.nikkiai.typelink.deep_compatibility"
  | "com.nikkiai.typelink.pro_bundle";

export interface ProductInfo {
  id: ProductId;
  title: string;
  description: string;
  price: string;
  priceValue: number;
}

export const PRODUCT_IDS: ProductId[] = [
  "com.nikkiai.typelink.detailed_diagnosis",
  "com.nikkiai.typelink.premium_cards",
  "com.nikkiai.typelink.deep_compatibility",
  "com.nikkiai.typelink.pro_bundle",
];

export const products: ProductInfo[] = [
  {
    id: "com.nikkiai.typelink.detailed_diagnosis",
    title: "ガチ診断",
    description: "60問の詳細診断 + 認知機能分析",
    price: "¥320",
    priceValue: 320,
  },
  {
    id: "com.nikkiai.typelink.premium_cards",
    title: "プレミアムカード",
    description: "8種類のシェアカードデザイン",
    price: "¥160",
    priceValue: 160,
  },
  {
    id: "com.nikkiai.typelink.deep_compatibility",
    title: "ディープ相性分析",
    description: "詳細な相性コメント + 全タイプ相性マップ",
    price: "¥160",
    priceValue: 160,
  },
  {
    id: "com.nikkiai.typelink.pro_bundle",
    title: "全部入りバンドル",
    description: "全機能アンロック + 広告非表示",
    price: "¥480（25%お得）",
    priceValue: 480,
  },
];

const PURCHASE_STORAGE_KEY = "@typelink_purchases";

type PurchaseState = Record<ProductId, boolean>;

const defaultState: PurchaseState = {
  "com.nikkiai.typelink.detailed_diagnosis": false,
  "com.nikkiai.typelink.premium_cards": false,
  "com.nikkiai.typelink.deep_compatibility": false,
  "com.nikkiai.typelink.pro_bundle": false,
};

const BUNDLE_PRODUCT_IDS: ProductId[] = [
  "com.nikkiai.typelink.detailed_diagnosis",
  "com.nikkiai.typelink.premium_cards",
  "com.nikkiai.typelink.deep_compatibility",
  "com.nikkiai.typelink.pro_bundle",
];

async function savePurchases(state: PurchaseState): Promise<void> {
  await AsyncStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(state));
}

async function loadPurchasesFromStorage(): Promise<PurchaseState> {
  try {
    const stored = await AsyncStorage.getItem(PURCHASE_STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch {}
  return { ...defaultState };
}

function isUserCancelled(error: ExpoPurchaseError): boolean {
  return error.code === ErrorCode.UserCancelled;
}

export function usePurchase() {
  const [purchases, setPurchases] = useState<PurchaseState>(defaultState);
  const [loading, setLoading] = useState(true);
  const purchasesRef = useRef(purchases);
  purchasesRef.current = purchases;

  const {
    connected,
    fetchProducts: iapFetchProducts,
    requestPurchase: iapRequestPurchase,
    finishTransaction,
    getAvailablePurchases,
    availablePurchases,
    restorePurchases: iapRestorePurchases,
  } = useIAP({
    onPurchaseSuccess: async (purchaseItem: Purchase) => {
      const productId = purchaseItem.productId as ProductId;
      if (PRODUCT_IDS.includes(productId)) {
        const newPurchases = { ...purchasesRef.current };

        if (productId === "com.nikkiai.typelink.pro_bundle") {
          for (const id of BUNDLE_PRODUCT_IDS) {
            newPurchases[id] = true;
          }
        } else {
          newPurchases[productId] = true;
        }

        setPurchases(newPurchases);
        await savePurchases(newPurchases);
      }

      // Non-consumable: finish transaction
      await finishTransaction({
        purchase: purchaseItem,
        isConsumable: false,
      });
    },
    onPurchaseError: (error: ExpoPurchaseError) => {
      if (isUserCancelled(error)) {
        // User cancelled - silent, no alert
        return;
      }
      Alert.alert(
        "購入エラー",
        error.message || "購入処理中にエラーが発生しました。"
      );
    },
  });

  // Load purchases from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const stored = await loadPurchasesFromStorage();
      setPurchases(stored);
      setLoading(false);
    })();
  }, []);

  // Fetch store products once connected
  useEffect(() => {
    if (connected && !__DEV__) {
      iapFetchProducts({ skus: PRODUCT_IDS, type: "in-app" }).catch(() => {});
    }
  }, [connected, iapFetchProducts]);

  const purchase = useCallback(
    async (productId: ProductId) => {
      if (__DEV__) {
        // DEV mode: mock purchase without StoreKit
        const newPurchases = { ...purchasesRef.current };

        if (productId === "com.nikkiai.typelink.pro_bundle") {
          for (const id of BUNDLE_PRODUCT_IDS) {
            newPurchases[id] = true;
          }
        } else {
          newPurchases[productId] = true;
        }

        setPurchases(newPurchases);
        await savePurchases(newPurchases);
        return;
      }

      // Production: real StoreKit purchase
      await iapRequestPurchase({
        request: {
          apple: { sku: productId },
          google: { skus: [productId] },
        },
        type: "in-app",
      });
    },
    [iapRequestPurchase]
  );

  const restore = useCallback(async (): Promise<boolean> => {
    if (__DEV__) {
      // DEV mode: just reload from AsyncStorage
      const stored = await loadPurchasesFromStorage();
      setPurchases(stored);
      return Object.values(stored).some(Boolean);
    }

    try {
      await iapRestorePurchases();
      await getAvailablePurchases();
      // availablePurchases state will update via useEffect
      return availablePurchases.length > 0;
    } catch (error) {
      Alert.alert("リストアエラー", "購入履歴の復元に失敗しました。");
      return false;
    }
  }, [iapRestorePurchases, getAvailablePurchases, availablePurchases]);

  // Sync restored purchases to local state
  useEffect(() => {
    if (!availablePurchases || availablePurchases.length === 0) return;

    (async () => {
      const newPurchases = { ...purchasesRef.current };
      let changed = false;

      for (const p of availablePurchases) {
        const pid = p.productId as ProductId;
        if (PRODUCT_IDS.includes(pid) && !newPurchases[pid]) {
          if (pid === "com.nikkiai.typelink.pro_bundle") {
            for (const id of BUNDLE_PRODUCT_IDS) {
              newPurchases[id] = true;
            }
          } else {
            newPurchases[pid] = true;
          }
          changed = true;
        }
      }

      if (changed) {
        setPurchases(newPurchases);
        await savePurchases(newPurchases);
      }
    })();
  }, [availablePurchases]);

  const refresh = useCallback(async () => {
    const stored = await loadPurchasesFromStorage();
    setPurchases(stored);
  }, []);

  const isPurchased = useCallback(
    (productId: ProductId): boolean => {
      if (purchases["com.nikkiai.typelink.pro_bundle"]) return true;
      return purchases[productId] ?? false;
    },
    [purchases]
  );

  const isAdFree = purchases["com.nikkiai.typelink.pro_bundle"];

  return { purchases, loading, purchase, restore, refresh, isPurchased, isAdFree };
}
