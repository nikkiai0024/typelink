export interface DeepAnalysis {
  detail: string;
  advice: string;
  caution: string;
}

export interface CompatibilityResult {
  score: number;
  label: string;
  comment: string;
  deep?: DeepAnalysis;
}

type CompatKey = string;

/**
 * 相性マトリクス生成
 * 各タイプペアにスコア(0-100)・ラベル・コメントを割り当てる
 */

const TYPES = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
] as const;

function key(a: string, b: string): CompatKey {
  return `${a}_${b}`;
}

// 相性の基本ルール:
// - 同じタイプ同士: 中〜高（理解し合える）
// - 補完関係（I/E入れ替え）: 高め
// - NF同士, NT同士, SJ同士, SP同士: 高め（気質が近い）
// - 黄金ペア（INFJ-ENTP等）: 最高

const manualEntries: Record<CompatKey, CompatibilityResult> = {
  // ── 黄金ペア ──
  [key("INFJ","ENTP")]: { score: 95, label: "最強コンビ", comment: "お互いの弱点を補い合える黄金コンビ。深い知的なつながりが生まれる。", deep: { detail: "INFJの深い洞察力とENTPの発想力が化学反応を起こす最高の組み合わせ。INFJは直感でENTPのアイデアの本質を見抜き、ENTPはINFJの世界を外に広げてくれる。知的な会話が尽きることがない。", advice: "お互いの違いを強みとして活かそう。INFJは構造と深さを、ENTPは可能性と柔軟性を提供できる。定期的に深い対話の時間を設けると関係がさらに深まる。", caution: "INFJの繊細さにENTPが無頓着になりがち。ENTPの変わりやすさにINFJが不安を感じることも。お互いのペースを尊重し、感情面でも対話を。" } },
  [key("ENTP","INFJ")]: { score: 95, label: "最強コンビ", comment: "お互いの弱点を補い合える黄金コンビ。深い知的なつながりが生まれる。", deep: { detail: "ENTPの自由な発想とINFJの深い理解力が共鳴する。ENTPは多くの人の中でもINFJだけが自分を本当に理解してくれると感じ、INFJはENTPのエネルギーに刺激を受ける。", advice: "ENTPは時にペースを落としてINFJの世界に寄り添おう。INFJはENTPの冒険心を制限しすぎないように。二人の知的な探求を共有の趣味にすると最高。", caution: "ENTPの議論好きがINFJを疲れさせることがある。INFJの理想主義がENTPに窮屈に感じることも。距離感の調整が大切。" } },
  [key("INTJ","ENFP")]: { score: 95, label: "最強コンビ", comment: "互いの世界を広げ合う最高の組み合わせ。違いが魅力に変わる。", deep: { detail: "INTJの戦略的思考とENFPの創造的エネルギーが見事に補完し合う。ENFPがINTJの硬い殻を破り、INTJがENFPのアイデアに構造を与える。お互いにない世界を見せてくれる存在。", advice: "INTJは感情面でもっとオープンになる努力を。ENFPはINTJの独りの時間を尊重しよう。週末は一緒にクリエイティブな活動を楽しんでみて。", caution: "INTJの批判的な言葉がENFPを傷つけることがある。ENFPの感情の波にINTJが困惑することも。コミュニケーションスタイルの違いを理解し合おう。" } },
  [key("ENFP","INTJ")]: { score: 95, label: "最強コンビ", comment: "互いの世界を広げ合う最高の組み合わせ。違いが魅力に変わる。", deep: { detail: "ENFPの温かさと情熱がINTJの知性と戦略性と出会うとき、最高のシナジーが生まれる。ENFPはINTJに感情の豊かさを、INTJはENFPに深い分析力を与える。", advice: "ENFPはINTJが黙っていても怒っているわけではないことを理解して。INTJはENFPの感情に寄り添う時間を意識的に作ろう。", caution: "ENFPのペースの変化にINTJがストレスを感じることがある。お互いの基本的なニーズを理解し、歩み寄ることが大切。" } },
  [key("INTP","ENFJ")]: { score: 90, label: "理想的パートナー", comment: "論理と共感が絶妙にマッチ。一緒にいると成長できる関係。", deep: { detail: "INTPの論理性とENFJの共感力が互いを補完する。ENFJがINTPを社会とつなぎ、INTPがENFJに客観的な視点を提供する。一緒にいると成長を実感できる関係。", advice: "INTPは感情表現を少し頑張ってみよう。ENFJはINTPの「一人の時間」を批判せず尊重して。知的な活動を一緒に楽しむとさらに絆が深まる。", caution: "ENFJの社交性にINTPがエネルギーを消耗することがある。INTPの冷静さがENFJに冷たく感じられることも。" } },
  [key("ENFJ","INTP")]: { score: 90, label: "理想的パートナー", comment: "論理と共感が絶妙にマッチ。一緒にいると成長できる関係。", deep: { detail: "ENFJの人を導く力とINTPの知的深さが融合する。ENFJはINTPの知性に魅了され、INTPはENFJの温かさに安心感を覚える。", advice: "ENFJはINTPに「考える時間」を与えよう。INTPは時にはENFJのイベントに参加してあげて。お互いの世界を尊重することが鍵。", caution: "ENFJが感情的なサポートを求めすぎると、INTPはプレッシャーを感じる。バランスが大切。" } },
  [key("INFP","ENTJ")]: { score: 88, label: "引き合う正反対", comment: "真逆だからこそ惹かれ合う。お互いにない視点を与え合える。", deep: { detail: "INFPの繊細な感性とENTJの力強いリーダーシップは真逆だが、だからこそ強い引力がある。INFPがENTJに人間的な温かさを教え、ENTJがINFPに行動力を与える。", advice: "ENTJはINFPの感情を軽視しないで。INFPはENTJの率直さを個人攻撃と受け取らないように。お互いの強みを認め合おう。", caution: "ENTJの支配的な態度がINFPを委縮させることがある。INFPの優柔不断がENTJをイライラさせることも。歩み寄りの姿勢が不可欠。" } },
  [key("ENTJ","INFP")]: { score: 88, label: "引き合う正反対", comment: "真逆だからこそ惹かれ合う。お互いにない視点を与え合える。", deep: { detail: "ENTJの決断力とINFPの共感力は最高の補完関係。ENTJはINFPから感性の豊かさを学び、INFPはENTJから実行力を学ぶ。成長し合える組み合わせ。", advice: "ENTJはペースを落としてINFPの気持ちに耳を傾けて。INFPは自分の意見をしっかり伝える練習をしよう。", caution: "力関係のバランスに注意。対等なパートナーシップを意識的に築くことが大切。" } },
  [key("ISTP","ESFJ")]: { score: 85, label: "補い合う関係", comment: "正反対の強みが噛み合うとき、最高のチームワークが生まれる。", deep: { detail: "ISTPの実践力とESFJの社交力は対照的だが、互いに足りないものを補い合える。ESFJがISTPを社会とつなぎ、ISTPがESFJに冷静な判断力を提供する。", advice: "ISTPは感情表現を少し増やしてみよう。ESFJはISTPの自由な時間を大切にしてあげて。お互いの得意分野を認め合うことが鍵。", caution: "ESFJの感情的なアプローチにISTPが困惑することがある。ISTPの無口さがESFJを不安にさせることも。" } },
  [key("ESFJ","ISTP")]: { score: 85, label: "補い合う関係", comment: "正反対の強みが噛み合うとき、最高のチームワークが生まれる。", deep: { detail: "ESFJの温かさとISTPのクールさが絶妙なバランスを生む。ESFJが人間関係を潤滑にし、ISTPが実際的な問題を解決する。", advice: "ESFJはISTPの行動で示す愛情を読み取ろう。ISTPはESFJの気持ちに言葉で応えてあげて。", caution: "コミュニケーションスタイルの違いが衝突を生みやすい。お互いの表現方法を理解し受け入れよう。" } },
  [key("ISFP","ESTJ")]: { score: 82, label: "バランスの取れた関係", comment: "計画と自由のバランスが取れた二人。お互いに学ぶことが多い。", deep: { detail: "ISFPの芸術的感性とESTJの組織力は対照的。ISFPがESTJに美的センスと柔軟性を教え、ESTJがISFPに計画性と実行力を与える。", advice: "ESTJはISFPのペースを尊重し、管理しすぎないように。ISFPは時にはESTJの計画に従ってみよう。", caution: "ESTJの厳格さがISFPの自由を制限しがち。ISFPの気まぐれさがESTJを困らせることも。" } },
  [key("ESTJ","ISFP")]: { score: 82, label: "バランスの取れた関係", comment: "計画と自由のバランスが取れた二人。お互いに学ぶことが多い。", deep: { detail: "ESTJの責任感とISFPの感受性が組み合わさると、安定しつつも彩りのある関係に。お互いにない視点を提供し合える。", advice: "ESTJは感情面でもっと柔軟に。ISFPは約束やスケジュールを大切にする努力を。", caution: "価値観の違いで対立しやすい場面がある。「正しさ」より「お互いの気持ち」を優先しよう。" } },
  [key("ISTJ","ESFP")]: { score: 80, label: "刺激し合う関係", comment: "安定と冒険のミックス。お互いの世界を広げてくれる存在。", deep: { detail: "ISTJの安定感とESFPの冒険心は真逆。しかし、ISTJがESFPに安心できる基盤を、ESFPがISTJに人生の楽しさを教えてくれる。", advice: "ISTJはたまにはESFPの冒険に付き合ってみて。ESFPはISTJの計画性を尊重しよう。バランスの取れた週末プランがおすすめ。", caution: "ISTJがESFPを退屈と感じたり、ESFPがISTJを堅すぎると感じることがある。忍耐力と理解が必要。" } },
  [key("ESFP","ISTJ")]: { score: 80, label: "刺激し合う関係", comment: "安定と冒険のミックス。お互いの世界を広げてくれる存在。", deep: { detail: "ESFPの明るさがISTJの日常に彩りを添え、ISTJの信頼性がESFPに安心感を与える。一見真逆だが、惹かれ合う魅力がある。", advice: "ESFPはISTJの静かな時間を邪魔しないで。ISTJはESFPのエネルギーを楽しんでみよう。", caution: "生活リズムの違いが摩擦を生むことがある。お互いのライフスタイルを尊重し、妥協点を見つけよう。" } },
  [key("ISFJ","ESTP")]: { score: 78, label: "新鮮な組み合わせ", comment: "穏やかさと行動力のコンビ。意外と上手くいく関係。", deep: { detail: "ISFJの穏やかな献身とESTPの行動力が組み合わさると、予想外にバランスの良い関係に。ISFJが安定した家庭を守り、ESTPが刺激と冒険を持ち込む。", advice: "ISFJはESTPの行動力を制限しすぎないように。ESTPはISFJの気持ちにもっと敏感になって。小さな感謝を伝えることが大切。", caution: "ESTPの衝動性にISFJが不安を感じることがある。ISFJの慎重さがESTPに窮屈に感じることも。" } },
  [key("ESTP","ISFJ")]: { score: 78, label: "新鮮な組み合わせ", comment: "穏やかさと行動力のコンビ。意外と上手くいく関係。", deep: { detail: "ESTPのアクティブさとISFJの温かさが互いを補完する。ESTPが世界を広げ、ISFJが心の拠り所になる。", advice: "ESTPはISFJの献身に甘えすぎないこと。ISFJはESTPと一緒に新しい体験を楽しんでみよう。", caution: "コミュニケーションスタイルの違いに注意。直接的なESTPと控えめなISFJの間で誤解が生じやすい。" } },
};

function sharedLetters(a: string, b: string): number {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (a[i] === b[i]) count++;
  }
  return count;
}

function temperament(t: string): string {
  const n = t[1]; // S or N
  const last2 = t.slice(2);
  if (n === "N" && (last2 === "FJ" || last2 === "FP")) return "NF";
  if (n === "N" && (last2 === "TJ" || last2 === "TP")) return "NT";
  if (n === "S" && (last2 === "TJ" || last2 === "FJ")) return "SJ";
  return "SP";
}

function generateDeep(a: string, b: string, shared: number): DeepAnalysis {
  if (a === b) {
    return {
      detail: `${a}同士の関係は、まるで鏡を見ているよう。お互いの考え方や価値観が手に取るように分かるため、安心感のある関係を築ける。しかし、似すぎているがゆえに成長が停滞したり、同じ弱点を共有して問題が増幅されることも。`,
      advice: "似た者同士だからこそ、意識的に新しい視点を取り入れよう。一緒に新しい体験をしたり、異なる意見を持つ人との交流を増やすと良い刺激になる。",
      caution: "お互いの弱点が共鳴して、ネガティブなループに陥りやすい。同じ問題にハマったときは第三者の視点を借りることが大切。",
    };
  }
  if (shared >= 3) {
    return {
      detail: `${a}と${b}は多くの共通点を持ち、自然体で過ごせる相性。価値観や物事の進め方が似ているため、大きな衝突は少ない。安定感のある心地よい関係を築きやすい。`,
      advice: "共通点を活かしつつ、違う部分を互いの成長の機会として捉えよう。定期的に新しいことに一緒にチャレンジすると、関係がマンネリ化しない。",
      caution: "似ている部分が多いため、互いの違いが目立ったときに予想以上にショックを受けることがある。小さな違いを受け入れる心の余裕を。",
    };
  }
  if (shared === 2) {
    return {
      detail: `${a}と${b}はバランスの取れた組み合わせ。共通点があるため理解し合える部分と、違いがあるため学び合える部分が程よく混在している。`,
      advice: "共通点を絆の土台にしつつ、違いから積極的に学ぶ姿勢を持とう。お互いの得意分野を活かした役割分担がうまくいく秘訣。",
      caution: "中途半端に似ているため、「なぜここが違うの？」とフラストレーションを感じることがある。違いは個性として尊重しよう。",
    };
  }
  if (shared === 1) {
    return {
      detail: `${a}と${b}は違いが多い分、互いに新鮮な刺激を与え合える関係。最初は戸惑うこともあるが、理解が深まると視野が大きく広がる。`,
      advice: "違いを「間違い」と捉えず、「別の視点」として受け入れよう。お互いの強みを認め合い、弱みを補い合う関係を意識的に築くことが大切。",
      caution: "コミュニケーションの行き違いが起きやすい。「言わなくても分かる」は通用しないので、こまめに気持ちを伝え合おう。",
    };
  }
  return {
    detail: `${a}と${b}は正反対のタイプ。世界の見方や価値観が大きく異なるため、最初は理解し合うのに時間がかかる。しかし、その違いこそが最大の魅力となり得る。`,
    advice: "急いで理解しようとせず、時間をかけてお互いを知っていこう。違いを楽しむ余裕を持つことが、この関係を豊かにする最大の鍵。",
    caution: "根本的な価値観の違いが衝突を生みやすい。相手を変えようとせず、ありのままを受け入れる姿勢が重要。歩み寄りの気持ちを忘れずに。",
  };
}

function generateResult(a: string, b: string): CompatibilityResult {
  const shared = sharedLetters(a, b);
  const sameTemp = temperament(a) === temperament(b);
  const deep = generateDeep(a, b, shared);

  if (a === b) {
    return { score: 85, label: "鏡のような関係", comment: "同じタイプ同士、深く理解し合える。ただし似すぎて成長が停滞することも。", deep };
  }

  if (shared >= 3) {
    return { score: 82, label: "気の合う仲間", comment: "価値観が近く、自然体でいられる心地よい関係。", deep };
  }
  if (sameTemp && shared >= 2) {
    return { score: 78, label: "共感できる相手", comment: "同じ気質を持ち、話が合う。一緒にいて楽しい関係。", deep };
  }
  if (shared === 2) {
    return { score: 70, label: "学び合える関係", comment: "共通点と違いのバランスが良く、お互いから学べることが多い。", deep };
  }
  if (shared === 1) {
    if (a[0] !== b[0]) {
      return { score: 65, label: "刺激的な関係", comment: "内向と外向の違いが新鮮。視野を広げ合える関係。", deep };
    }
    return { score: 60, label: "成長のきっかけ", comment: "違いが多いからこそ新しい発見がある。お互いの視点を尊重しよう。", deep };
  }

  // shared === 0
  return { score: 55, label: "正反対の魅力", comment: "全く違うタイプだけど、だからこそ惹かれることも。理解し合う努力が大切。", deep };
}

// 全256通りを生成
const allCompatibility: Record<CompatKey, CompatibilityResult> = {};

for (const a of TYPES) {
  for (const b of TYPES) {
    const k = key(a, b);
    if (manualEntries[k]) {
      allCompatibility[k] = manualEntries[k];
    } else {
      allCompatibility[k] = generateResult(a, b);
    }
  }
}

export function getCompatibility(typeA: string, typeB: string): CompatibilityResult {
  return allCompatibility[key(typeA, typeB)] ?? {
    score: 50,
    label: "未知の関係",
    comment: "お互いを知ることで、新しい発見があるかも。",
  };
}
