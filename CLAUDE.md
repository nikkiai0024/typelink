# CLAUDE.md - MBTI TypeLink

## アプリ概要
**TypeLink** - クイックMBTI診断 × シェアカード × 友達相性 × ティアード課金

## 解決する問題（競合の弱点）

1. **既存最強アプリ（MBTIテスト 4.5★ 5,808件）** の不満
   - 96問で途中離脱が多い → クイック20問モードで解決
   - 結果をSNSにシェアするための画像がない → シェアカード自動生成
   - 友達との相性を確認する場がない → 友達相性診断
   - 深い分析がない → ガチ診断（有料）で認知機能分析

2. **日本市場特有の需要**
   - K-POPカルチャーの影響でMBTIブーム継続中（特にZ世代）
   - 診断結果カードをシェアする文化が定着

## 収益化: ティアード買い切りモデル

### 無料（広告あり）
- クイック診断（20問）
- 基本結果画面（タイプ名 + 概要）
- シェアカード 1デザイン（ベーシック）
- 相性診断（スコアのみ）
- タイプ一覧

### 有料アンロック（個別購入）
| 機能 | 価格 | プロダクトID |
|------|------|-------------|
| ガチ診断（60問 + 認知機能分析） | ¥320 | `com.typelink.detailed_diagnosis` |
| プレミアムシェアカード（8種デザイン） | ¥160 | `com.typelink.premium_cards` |
| ディープ相性分析 | ¥160 | `com.typelink.deep_compatibility` |
| **全部入りバンドル** | **¥480** | `com.typelink.pro_bundle` |

- 個別合計 ¥640 → バンドル ¥480（25%お得）
- 全購入で広告も非表示になる

### 実装方法
- **expo-iap** または **react-native-iap** を使用
- Non-Consumable In-App Purchase（買い切り型）
- 購入状態は AsyncStorage + StoreKit のレシート検証で管理
- リストア購入ボタン必須（App Store審査要件）

## 広告
- **expo-ads-admob** または **react-native-google-mobile-ads**
- バナー広告: 結果画面下部 + タイプ一覧画面下部
- インタースティシャル: 診断完了→結果表示の間（頻度制限: 3回に1回）
- Pro全部入り購入後は全広告非表示

## 機能詳細

### クイック診断（無料・20問）
- I/E、N/S、T/F、J/P の各5問ずつ
- 1問ずつ表示 + プログレスバー
- 即結果表示、ログイン不要

### ガチ診断（有料・60問）
- 4軸の各15問（精度向上）
- 認知機能8つ（Ti/Te/Fi/Fe/Ni/Ne/Si/Se）のスコアも算出
- 結果画面に追加:
  - 各軸の%バー（例: I 72% / E 28%）
  - 認知機能レーダーチャート
  - 詳細レポート: 恋愛傾向 / 仕事適性 / 成長アドバイス
  - 有名人との比較

### シェアカード
**無料**: ベーシック（白背景 + タイプカラーアクセント）
**プレミアム（¥160）**: 8種デザイン
  1. グラデーション（タイプ別カラーグラデ）
  2. ミニマル（黒背景 + 白文字）
  3. パステル（淡い色合い）
  4. ネオン（ダーク + 蛍光アクセント）
  5. 和風（和紙テクスチャ風）
  6. K-POP風（キラキラエフェクト）
  7. 水彩（水彩画風背景）
  8. フォトフレーム（写真を入れられる枠）

### 相性診断
**無料**: スコア（0-100）+ 一言ラベル
**ディープ（¥160）**: 
  - 詳細コメント（3-4文）
  - 関係性のアドバイス
  - 注意すべきポイント
  - 全16タイプとの相性マップ（自分を中心としたチャート）

## 技術スタック

- **React Native + Expo** (TypeScript)
- **expo-router** - ナビゲーション
- **react-native-iap** - In-App Purchase
- **react-native-google-mobile-ads** - 広告
- **react-native-view-shot** - シェアカード画像生成
- **expo-sharing** - シェア機能
- **@react-native-async-storage/async-storage** - 購入状態・診断結果保存
- **ローカルデータのみ** - バックエンド不要

## 画面一覧（更新）

1. **ホーム画面** - 「クイック診断」「ガチ診断」ボタン + タイプ一覧
2. **診断画面** - 1問ずつ（クイック20問 or ガチ60問）
3. **結果画面** - タイプ表示 + シェア + 相性へのリンク
4. **詳細結果画面**（有料）- 認知機能チャート + 詳細レポート
5. **相性選択画面** - 16タイプグリッド
6. **相性結果画面** - スコア + コメント（+ ディープ分析）
7. **タイプ詳細画面** - 各タイプの情報
8. **Pro画面** - 購入オプション一覧 + リストア

## デザイン方針

- **カラー**: メイン `#7B5EA7`（紫）+ 背景 `#F7F5FB`
- **トーン**: ミニマル + おしゃれ。韓国系UIの清潔感
- **フォント**: システムフォント
- **カード**: 角丸・シャドウ・グラデーション
- **有料機能**: ロック状態では半透明 + 🔒アイコン + タップで購入シートへ

## データ設計

### クイック質問（20問）: `data/questions.ts`（既存）
### ガチ質問（60問）: `data/detailed-questions.ts`（新規）
各軸15問。認知機能ごとの重み付けあり。

### 認知機能スコア算出ロジック
```typescript
// 各質問に認知機能の重み付け
interface DetailedQuestion {
  text: string;
  axis: 'EI' | 'SN' | 'TF' | 'JP';
  cognitiveWeights: Partial<Record<CognitiveFunction, number>>;
  optionA: string;
  optionB: string;
}

type CognitiveFunction = 'Ti' | 'Te' | 'Fi' | 'Fe' | 'Ni' | 'Ne' | 'Si' | 'Se';
```

### タイプデータ: `data/types.ts`（拡張）
既存データ + 詳細レポート（恋愛/仕事/成長）を追加

### 相性データ: `data/compatibility.ts`（拡張）
既存スコア + ディープ分析テキストを追加

## ディレクトリ構成（更新）
```
mbti-app/
├── app/
│   ├── index.tsx              # ホーム
│   ├── quiz.tsx               # 診断（クイック/ガチ共用）
│   ├── result.tsx             # 結果
│   ├── detailed-result.tsx    # 詳細結果（有料）
│   ├── compatibility.tsx      # 相性選択
│   ├── compat-result.tsx      # 相性結果
│   ├── types/[id].tsx         # タイプ詳細
│   └── pro.tsx                # 購入画面
├── data/
│   ├── questions.ts           # クイック20問
│   ├── detailed-questions.ts  # ガチ60問（新規）
│   ├── types.ts               # 16タイプ情報（拡張）
│   └── compatibility.ts       # 相性データ（拡張）
├── components/
│   ├── ShareCard.tsx          # シェアカード
│   ├── PremiumShareCards.tsx   # プレミアムデザイン8種（新規）
│   ├── TypeCard.tsx           # タイプカード
│   ├── ProgressBar.tsx        # 進捗バー
│   ├── CognitiveChart.tsx     # 認知機能レーダーチャート（新規）
│   ├── AxisBar.tsx            # 軸別%バー（新規）
│   ├── AdBanner.tsx           # 広告バナー（新規）
│   ├── PurchaseButton.tsx     # 購入ボタン（新規）
│   └── LockedOverlay.tsx      # ロック表示（新規）
├── hooks/
│   └── usePurchase.ts         # IAP管理フック（新規）
├── utils/
│   └── cognitive.ts           # 認知機能算出ロジック（新規）
└── CLAUDE.md
```

## 実装タスク（今回）

### Phase 1: ティアード課金基盤
1. `react-native-iap` インストール + 設定
2. `hooks/usePurchase.ts` 作成（購入状態管理）
3. `app/pro.tsx` 購入画面（3つの個別 + バンドル表示）
4. `components/PurchaseButton.tsx` + `LockedOverlay.tsx`

### Phase 2: ガチ診断
5. `data/detailed-questions.ts` 60問作成（日本語、日常シナリオ）
6. `utils/cognitive.ts` 認知機能スコア算出
7. `app/quiz.tsx` 拡張（クイック/ガチモード切替）
8. `app/detailed-result.tsx` 詳細結果画面
9. `components/CognitiveChart.tsx` レーダーチャート
10. `components/AxisBar.tsx` 軸別%バー

### Phase 3: プレミアムコンテンツ
11. `components/PremiumShareCards.tsx` 8種デザイン
12. 相性データ拡張（ディープ分析テキスト追加）
13. 相性マップ画面

### Phase 4: 広告
14. `react-native-google-mobile-ads` インストール
15. `components/AdBanner.tsx` バナー広告
16. インタースティシャル広告（診断完了時）
17. Pro購入後の広告非表示ロジック

## 注意事項

- MBTI商標: 「性格タイプ診断」と表記
- 医療診断ではないDisclaimer追加
- In-App Purchase: リストアボタン必須
- 広告: GDPR/ATT対応（App Tracking Transparencyダイアログ）
- 認知機能は「参考値」として表示（学術的正確性の保証はしない旨を明記）
