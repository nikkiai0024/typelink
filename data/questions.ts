export type Dimension = "EI" | "SN" | "TF" | "JP";

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
  /** "a" が左側の指標 (E, S, T, J)、"b" が右側 (I, N, F, P) */
  optionA: string;
  optionB: string;
}

export const questions: Question[] = [
  // ── E / I（外向 vs 内向）──────────────────
  {
    id: 1,
    text: "休日の過ごし方として、より魅力的なのは？",
    dimension: "EI",
    optionA: "友達と賑やかに過ごす",
    optionB: "ひとりでゆっくり過ごす",
  },
  {
    id: 2,
    text: "新しい環境に入ったとき、あなたは？",
    dimension: "EI",
    optionA: "自分から積極的に話しかける",
    optionB: "相手から話しかけてくれるのを待つ",
  },
  {
    id: 3,
    text: "エネルギーを充電する方法は？",
    dimension: "EI",
    optionA: "人と会って話すこと",
    optionB: "ひとりの時間を確保すること",
  },
  {
    id: 4,
    text: "グループでのミーティングで、あなたは？",
    dimension: "EI",
    optionA: "思いついたらすぐ発言する",
    optionB: "考えがまとまってから発言する",
  },
  {
    id: 5,
    text: "電話がかかってきたとき、あなたの気持ちは？",
    dimension: "EI",
    optionA: "すぐ出たい、話すのが楽しい",
    optionB: "できればLINEで済ませたい",
  },

  // ── S / N（感覚 vs 直感）──────────────────
  {
    id: 6,
    text: "旅行の計画を立てるとき、重視するのは？",
    dimension: "SN",
    optionA: "具体的なスケジュールと観光地リスト",
    optionB: "全体の雰囲気やテーマ",
  },
  {
    id: 7,
    text: "仕事や勉強で得意なのは？",
    dimension: "SN",
    optionA: "データや事実に基づく分析",
    optionB: "新しいアイデアの発想",
  },
  {
    id: 8,
    text: "説明を受けるとき、わかりやすいのは？",
    dimension: "SN",
    optionA: "具体的な例やステップ",
    optionB: "全体像やコンセプト",
  },
  {
    id: 9,
    text: "買い物をするとき、あなたは？",
    dimension: "SN",
    optionA: "スペックやレビューをしっかり調べる",
    optionB: "直感やフィーリングで選ぶ",
  },
  {
    id: 10,
    text: "会話の中で、あなたがよく話すのは？",
    dimension: "SN",
    optionA: "実際に起きた出来事や体験談",
    optionB: "将来の可能性や「もしも」の話",
  },

  // ── T / F（思考 vs 感情）──────────────────
  {
    id: 11,
    text: "友達が悩みを相談してきたとき、あなたは？",
    dimension: "TF",
    optionA: "解決策やアドバイスを考える",
    optionB: "まず気持ちに寄り添い共感する",
  },
  {
    id: 12,
    text: "大切な決断をするとき、優先するのは？",
    dimension: "TF",
    optionA: "論理的に正しいかどうか",
    optionB: "関係者の気持ちへの影響",
  },
  {
    id: 13,
    text: "映画やドラマの感想を聞かれたら？",
    dimension: "TF",
    optionA: "ストーリーの構成や矛盾点を語る",
    optionB: "感動したシーンや感情を語る",
  },
  {
    id: 14,
    text: "チームで意見が対立したとき、あなたは？",
    dimension: "TF",
    optionA: "客観的な事実で議論を整理する",
    optionB: "全員が納得できる落としどころを探す",
  },
  {
    id: 15,
    text: "褒められるとき、嬉しいのは？",
    dimension: "TF",
    optionA: "「すごく優秀だね」と能力を認められる",
    optionB: "「あなたがいてくれて嬉しい」と存在を認められる",
  },

  // ── J / P（判断 vs 知覚）──────────────────
  {
    id: 16,
    text: "締め切りがあるタスク、あなたのスタイルは？",
    dimension: "JP",
    optionA: "早めに計画を立てて着実に進める",
    optionB: "ギリギリにならないとエンジンがかからない",
  },
  {
    id: 17,
    text: "予定が急に変わったとき、あなたは？",
    dimension: "JP",
    optionA: "ストレスを感じる、予定通りがいい",
    optionB: "むしろワクワクする、柔軟に対応できる",
  },
  {
    id: 18,
    text: "デスクやカバンの中は？",
    dimension: "JP",
    optionA: "きちんと整理されている",
    optionB: "少し散らかっているが自分なりの秩序がある",
  },
  {
    id: 19,
    text: "旅行先での過ごし方は？",
    dimension: "JP",
    optionA: "事前に決めたプランに沿って動く",
    optionB: "その場のノリで行き先を決める",
  },
  {
    id: 20,
    text: "やることリストを作ったとき、あなたは？",
    dimension: "JP",
    optionA: "全部チェックを入れないと気が済まない",
    optionB: "リストはあくまで参考、臨機応変に動く",
  },
];
