import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Menu, X, Moon, Sun, Copy, CheckCircle, AlertTriangle, 
  Server, Users, Shield, Clock, MessageCircle, MapPin, 
  HelpCircle, ChevronDown, ChevronUp, Gamepad2, Terminal,
  Send, ExternalLink, Home, FileText, List, Bell, BookOpen,
  User, DollarSign, Theater, Lock, Hammer, AlertCircle, Search, Trash2, Zap, Sparkles, ArrowRight, Loader2, Map, Info,
  Youtube, Twitter
} from 'lucide-react';

// --- Custom Styles & Animations ---
const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');

    :root {
      --font-sans: 'Noto Sans JP', "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
    }

    body {
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    @keyframes shine {
      100% { left: 125%; }
    }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes progress {
      0% { width: 0%; margin-left: 0; }
      50% { width: 70%; margin-left: 0; }
      100% { width: 100%; margin-left: 0; }
    }
    
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-blob { animation: blob 7s infinite; }
    .animate-shine { animation: shine 3s infinite; }
    .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
    .animate-progress { animation: progress 1s ease-in-out infinite; }
    
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
    
    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-track { background: transparent; }
    .dark ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #8b5cf6; border-radius: 5px; }
    ::-webkit-scrollbar-thumb:hover { background: #7c3aed; }

    .bg-grid-pattern {
      background-image: radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .dark .bg-grid-pattern {
      background-image: radial-gradient(circle, rgba(139, 92, 246, 0.15) 1px, transparent 1px);
    }
    
    .glass-panel {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    .dark .glass-panel {
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    ::selection { background-color: #8b5cf6; color: white; }
  `}</style>
);

// --- Configuration ---
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_EXAMPLE_KEY/pub?output=csv"; 

// --- i18n Data (Japanese & English) ---

const LANGUAGES = {
  ja: {
    lang_name: "日本語",
    server: {
      ip: "nantetu123.f5.si",
      port: "5346",
      tag: "nantetu5877",
    },
    nav: {
      home: "ホーム",
      join: "参加方法",
      guide: "ガイド",
      commands: "コマンド",
      news: "お知らせ",
    },
    status: {
      loading: "...",
      online: (players) => `${players}人参加中`,
      offline: "オフライン",
    },
    home: {
      hero_title: "「ゆるい」だけじゃない。\n誰もが楽しめる確かな技術。",
      hero_subtitle: "荒らし対策・高機能プラグイン完備。\n安定したサーバー環境で、あなただけの生活を始めよう。",
      join_now: "今すぐ参加する",
      see_details: "詳細を見る",
      what_is_nantetsu: "なんてつサーバーとは",
      description_p1: "統合版で統合版の常識を覆す。",
      description_p2: "Java版級の機能とクオリティを最大の強みとする、サバイバル重視のコミュニティサーバーです。",
      description_p3: "専用プラグインによる強力な監視・保護体制。チートや荒らし行為を未然に防ぎ、安心安全な環境で自由な建築を楽しめます。",
      description_p4: "初心者の方も大歓迎！ Discordコミュニティでいつでも質問や交流が可能です。",
      see_news: "最新のお知らせを見る",
      stats_title: "サーバーの特徴",
      stat_cumulative_players: "累計参加者数",
      stat_retention_rate: "高い定着率",
      stat_uptime: "稼働率",
      stat_max_online: "最大同時接続",
      feature_p1_title: "完璧な土地保護",
      feature_p1_desc: "コマンド一つで建築を完全保護。荒らしを100%防ぐ、統合版最強クラスの安心感を提供します。",
      feature_p2_title: "徹底した監査ログ",
      feature_p2_desc: "全行動ログを完備。万が一のトラブルも、運営がログを追跡し即時ロールバック（復元）対応。",
      feature_p3_title: "Discord連携",
      feature_p3_desc: "サーバー内のチャットとDiscordが連動。ログアウト中もスマホから仲間と会話できます。",
      feature_p4_title: "便利なコマンド",
      feature_p4_desc: "/tpa, /home など便利機能を完備。クリックしてコマンド一覧を確認できます。",
      feature_p5_title: "超低遅延",
      feature_p5_desc: "ハイスペックな環境でストレスフリー。サバイバルも建築もヌルヌル動きます。",
      feature_p6_title: "初心者歓迎",
      feature_p6_desc: "優しいコミュニティで、マルチプレイが初めての方でも安心して参加できます。",
      rules_title: "サーバーのルール",
      rules_subtitle: "みんなが楽しく遊ぶための、最低限の約束事です。",
      quiz_title: "ルール確認クイズ",
      quiz_subtitle: "ルールを理解したことを確認するため、簡単な3問のクイズに挑戦してください。全問正解を目指しましょう！",
      quiz_start: "クイズを始める",
      quiz_done: "お疲れ様でした！",
      quiz_score: (score, total) => `あなたのスコア: ${score} / ${total}`,
      quiz_result_perfect: "完璧です！安心してサーバーに参加してください。",
      quiz_result_retry: "ルールをもう一度確認して、安全なプレイを心がけましょう。",
      quiz_retry: "もう一度挑戦する",
      quiz_correct: "正解！",
      quiz_incorrect: "不正解...",
      contact_title: "お問い合わせ",
      contact_name: "お名前 (Minecraft ID)",
      contact_email: "連絡先 (Discord/Email)",
      contact_message: "メッセージ",
      contact_placeholder_name: "Steve",
      contact_placeholder_email: "name#1234",
      contact_placeholder_msg: "お問い合わせ内容を入力してください...",
      contact_send: "送信する",
    },
    news: {
      title: "ニュース",
      subtitle: "サーバーの最新情報やメンテナンス情報をお届けします。",
      maintenance: "メンテナンス",
      info: "インフォメーション",
      default_data: [
        { id: 1, date: "2025.11.17", title: "お知らせ", content: "軟鉄サーバーのウェブサイトがGoogle検索で表示されるようになりました！！", type: "info" },
        { id: 2, date: "2025.11.17", title: "お問い合わせ機能について", content: "現在何らかの不具合により機能しておりません。そのため、お問い合わせはDiscordにてご報告ください。", type: "info" },
        { id: 3, date: "2025.11.16", title: "新機能のお知らせ", content: "公式サイトに｢なんてつAIアシスタント｣が追加されました！どんな相談でもできます！さらに24時間いつでも対応！", type: "info" }
      ],
    },
    commands: {
      title: "コマンド一覧",
      subtitle: "サーバー生活を便利にするコマンド集です。",
      admin_title: "管理者用コマンド (参考)",
      sections: [
        { category: "移動・テレポート系 (Essentials)", color: "text-purple-600", commands: [
          { cmd: "/tpa <プレイヤー名>", desc: "指定したプレイヤーにテレポートをリクエストします。" },
          { cmd: "/tpaccept", desc: "/tpa のリクエストを承認します。" },
          { cmd: "/tpdeny", desc: "/tpa のリクエストを拒否します。" },
          { cmd: "/back", desc: "最後にテレポートした場所、または死んだ場所に戻ります。" },
          { cmd: "/sethome", desc: "現在地をホームポイントとして設定します。" },
          { cmd: "/home", desc: "設定したホームにテレポートします。" },
          { cmd: "/spawn", desc: "サーバーの初期スポーン地点に戻ります。" },
          { cmd: "/warp", desc: "運営が設定した公共施設へ移動します。" }
        ]},
        { category: "領地・保護・ログ系 (Territory / Tianyan)", color: "text-green-600", commands: [
          { cmd: "/tty", desc: "自分の領地として設定します。(事前に範囲座標のメモが必要)" },
          { cmd: "/tygui", desc: "監査ログをGUIで確認します。荒らし特定に便利です。" },
          { cmd: "/ty x y z <時間> <半径>", desc: "チャットで検索し監査ログを確認します。（上級者向け）" }
        ]},
        { category: "経済・コミュニケーション (UMoney / Essentials)", color: "text-yellow-600", commands: [
          { cmd: "/um", desc: "自分の所持金（マネー）を確認します。" },
          { cmd: "/um → <送金>", desc: "指定したプレイヤーにお金を送金します。" },
          { cmd: "/um → <ランキング>", desc: "所持金のサーバー内ランキングを確認します。" },
          { cmd: "/msg <プレイヤー名> <内容>", desc: "指定したプレイヤーに個人メッセージ（DM）を送ります。" },
          { cmd: "/ping", desc: "サーバーとの接続遅延(Ping値)を確認します。" },
          { cmd: "/notice", desc: "サーバーからのお知らせを確認します。" }
        ]},
        { category: "ロールプレイ系 (RolePlay)", color: "text-pink-600", commands: [
          { cmd: "/e <アクション>", desc: "チャットにアクション（感情表現）を送信します。（例: /e happy）" }
        ]}
      ],
      admin_sections: [
        { category: "サーバー管理 (Essentials / U_Backup)", commands: [
          { cmd: "/broadcast <メッセージ>", desc: "サーバー全体にアナウンスを送信します。" },
          { cmd: "/kick <プレイヤー名> [理由]", desc: "プレイヤーをキックします。" },
          { cmd: "/ban <プレイヤー名> [理由]", desc: "プレイヤーをBANします。" },
          { cmd: "/unban <プレイヤー名>", desc: "プレイヤーのBANを解除します。" },
          { cmd: "/gamemode <モード> [プレイヤー]", desc: "Changes game mode." },
          { cmd: "/tp <対象> [目的地]", desc: "プレイヤーを強制的にテレポートさせます。" },
          { cmd: "/backup", desc: "サーバーデータのバックアップを作成します。" }
        ]},
        { category: "経済・領地管理 (UMoney / Territory)", commands: [
          { cmd: "/um → <admin>", desc: "Manages a player's money." },
          { cmd: "/optty set ...", desc: "Forcefully manages another player's territory." },
          { cmd: "/optty reload", desc: "Reloads the territory plugin configuration." }
        ]}
      ]
    },
    join: {
      title: "サーバー参加情報",
      subtitle: "以下の情報を使用して、Minecraft統合版の「サーバー追加」から参加してください。フレンド申請での参加も可能です。",
      bedrock_tag: "統合版 (Bedrock)",
      status_online: "稼働中",
      status_offline: "オフライン",
      info_title: "サーバー参加情報",
      info_desc: "以下の情報を使用して、Minecraft統合版の「サーバー追加」から参加してください。フレンド申請での参加も可能です。",
      label_gamertag: "ゲーマータグ (フレンド申請用)",
      label_ip: "IPアドレス",
      label_port: "ポート番号",
      btn_discord: "Discordに参加",
      btn_guide: "詳しい接続手順",
      img_alt_text: "Join Screen",
      img_overlay_text: "さあ、冒険の始まりです。",
      copy_success: "クリップボードにコピーしました！"
    },
    guide: {
      title: "初心者ガイド & FAQ",
      subtitle: "サーバー生活の始め方と、よくある質問まとめ。",
      steps_title: "サーバー生活のはじめ方",
      steps: [
        { step: 1, title: "スポーン地点から移動", content: "サーバーに参加すると「スポーン地点」に到着します。看板を読んだら、混雑していない安全な場所へ移動しましょう。`/warp` コマンドで公共施設へ移動も可能です。" },
        { step: 2, title: "自分の拠点を見つける", content: "他のプレイヤーの拠点から最低5ブロック離れた場所を見つけ、自分の土地にします。チャットで「近くに誰かいますか？」と聞くと親切です。" },
        { step: 3, title: "土地保護を行う (重要)", content: "荒らし対策のため、必ず家を保護しましょう。コマンド `/tty` で設定できます。設定後は `/sethome` で地点登録を忘れずに！" },
        { step: 4, title: "Discordに参加", content: "Discordコミュニティに参加して、交流やサポートを受けましょう。最新情報の確認にも必須です。" }
      ],
      faq_title: "よくある質問 (FAQ)",
      faq_data: [
        { q: "Q1: 土地保護はどうなっていますか？", a: "A: 土地保護は、`/tty` コマンドで設定します。この設定により、自動的に指定した座標内が保護されます。保護範囲内では、他のプレイヤーによる破壊やチェストの操作はできません。" },
        { q: "Q2: お金（通貨）は何に使えますか？", a: "A: 現状使い道はないですが、将来的に機能を追加する可能性はあります。" },
        { q: "Q3: /tpa や /warp などのテレポートコマンドは使えますか？", a: "A: はい、使用可能です。`/tpa [プレイヤー名]`でリクエスト、`/warp`で公共施設へ、`/home`で拠点へ移動できます。" },
        { q: "Q4: 荒らし行為があった場合、どうすればいいですか？", a: "A: 証拠（スクショや動画）を確保し、Discordまたはゲーム内で運営に連絡してください。運営はログを確認し、ロールバック機能で被害を修復します。" },
        { q: "Q5: 資源ワールドはいつリセットされますか？", a: "A: 資源ワールドはこのサーバーにはございません。" }
      ],
    },
    terms: {
      title: "利用規約",
      date: "制定日: 2025年11月10日",
      chapters: [
        { title: "第1章 総則", articles: [
          { title: "第1条 (本規約の適用)", content: "本規約は、なんてつサーバーが提供するすべてのサービスの利用に関わる一切の事項に適用されます。ユーザーは本サービスの利用をもって本規約に同意したものとみなされます。" },
          { title: "第2条 (定義)", content: "「ユーザー」とは本サービスを利用する個人、「コンテンツ」とはユーザーが作成・公開したデータを指します。" }
        ]},
        { title: "第2章 利用登録とユーザーの義務", articles: [
          { title: "第3条 (利用登録)", content: "利用希望者は本規約に同意の上で利用登録を行うものとします。未成年者は保護者の同意が必要です。" },
          { title: "第4条 (アカウント情報の管理)", content: "アカウント情報は自己責任で管理し、第三者への譲渡・貸与は禁止します。" }
        ]},
        { title: "第3章 禁止事項と利用停止", articles: [
          { title: "第5条 (禁止事項)", content: "法令違反、権利侵害、ハラスメント、不正アカウント利用、チート・バグ悪用、サーバーへの過度な負荷、妨害行為、無許可の商業・宗教活動等は禁止です。" },
          { title: "第6条 (利用停止)", content: "違反時は事前の通知なく、利用停止（BAN）、コンテンツ削除、アカウント削除等の措置を講じます。" }
        ]},
        { title: "第4章 コンテンツと知的財産権", articles: [
          { title: "第7条 (コンテンツの権利)", content: "ユーザーが作成したコンテンツの著作権はユーザー本人に帰属します。" },
          { title: "第8条 (運営による利用)", content: "ユーザーは運営に対し、プロモーション等のためにコンテンツを無償で利用する権利を許諾するものとします。" }
        ]},
        { title: "第5章 免責事項", articles: [
          { title: "第9条 (免責事項)", content: "運営はサービスの完全性を保証せず、データ消失や停止による損害について責任を負いません。" },
          { title: "第10条 (損害賠償)", content: "規約違反により損害を与えた場合、ユーザーはその損害を賠償する義務を負います。" }
        ]}
      ],
      signature: "なんてつサーバー 運営"
    },
    privacy: {
      title: "プライバシーポリシー",
      date: "制定日: 2025年11月9日",
      intro: "「なんてつサーバー」（以下、「当サーバー」）は、プレイヤーの皆様の個人情報の重要性を認識し、その保護を徹底するために、以下のプライバシーポリシーを定めます。",
      section1_title: "1. 取得する情報とその利用目的",
      subsection1_1_title: "1-1. ゲーム内情報",
      subsection1_1_info: "取得情報:",
      subsection1_1_purpose: "利用目的:",
      subsection1_1_data: ["Minecraft ID、操作ログ、チャットログ、IPアドレス。"],
      subsection1_1_usage: ["荒らし対策、サービス維持、規約違反対応。"],
      subsection1_2_title: "1-2. お問い合わせ情報",
      subsection1_2_data: ["名前、Discordタグ、内容。"],
      subsection1_2_usage: ["サポート対応、本人確認。"],
      section2_title: "2. 情報の第三者提供について",
      section2_content: "法令に基づく場合や緊急時を除き、プレイヤーの同意なく第三者に個人情報を提供することはありません。",
      section3_title: "3. お問い合わせ窓口",
      section3_content: "運営連絡先:",
      email: "nantetu2@gmail.com"
    },
    rules_data: [
      {
        title: "第1条: 荒らし行為・窃盗・チートの禁止",
        content: [
          "他プレイヤーの所有物（建築物、チェスト内のアイテム）の破壊、窃盗、無断使用は永久BANの対象です。",
          "テクスチャパック以外の改造クライアント、チート、BOTの使用は禁止します。",
          "発見したバグやグリッチは悪用せず、速やかに運営に報告してください。"
        ]
      },
      {
        title: "第2条: 迷惑行為・ハラスメントの禁止",
        content: [
          "他プレイヤーへの差別的発言、誹謗中傷、過度なハラスメント行為を禁止します。",
          "サーバーへの過度な負荷をかける行為（クロック回路の放置など）は禁止します。",
          "その他、他のプレイヤーが不快に感じる行為は、運営の判断でペナルティの対象となります。"
        ]
      },
      {
        title: "第3条: 建造物・景観に関するルール",
        content: [
          "景観を著しく損なう建築物（豆腐、巨大な柱など）は、改善を求められる場合があります。",
          "プレイヤーが定住しているエリアから最低5ブロック離れた場所に建築を開始してください。",
          "公序良俗に反するシンボルやメッセージを含む建築物は禁止します。"
        ]
      }
    ],
    quiz_data: [
      { question: "【第1条】他人の建築物を無断で破壊・窃盗した場合、どうなりますか？", options: ["見つからなければ問題ない", "運営が警告する", "永久BANの対象となる"], answer: "永久BANの対象となる" },
      { question: "【第2条】ゲーム内で差別的な発言をしました。これは許可されますか？", options: ["サーバーの負荷にならないので許可される", "他のプレイヤーの不快感に関わるため禁止される", "個人的なやり取りなら問題ない"], answer: "他のプレイヤーの不快感に関わるため禁止される" },
      { question: "【第3条】他のプレイヤーの拠点に近い場合、最低何ブロック離れるべきですか？", options: ["10ブロック", "50ブロック", "100ブロック"], answer: "10ブロック" }
    ],
    footer: {
      terms: "利用規約",
      privacy: "プライバシーポリシー",
      contact: "お問い合わせ",
      sitemap: "サイトマップ",
      promotion: "Discordに参加して最新情報とコミュニティサポートをゲットしよう！",
      promotion_link: "Discordに参加",
      copy_success: "クリップボードにコピーしました！",
      not_found_title: "ページが見つかりません 🚧",
      not_found_btn: "トップページに戻る",
      chat_title: "なんてつAIアシスタント",
      chat_subtitle: "サーバーのルール、コマンド、遊び方について質問してください。",
      chat_input_placeholder: "質問を入力してください...",
      chat_send: "送信",
      chat_loading: "AIが思考中...",
      chat_error: "エラーが発生しました。もう一度お試しください。",
      chat_clear: "会話をクリア",
      search_placeholder: "サイト内を検索...",
      search_results_title: "検索結果",
      search_no_results: (term) => `「${term}」に一致する結果は見つかりませんでした。`,
      search_found: (count) => `${count}件の結果が見つかりました。`,
      search_category_news: "お知らせ",
      search_category_command: "コマンド",
      search_category_guide: "FAQ/ガイド",
      search_category_terms: "利用規約",
      search_category_privacy: "プライバシーポリシー",
      search_result_btn: "詳細を見る",
    }
  },
  en: {
lang_name: "English",
server: {
  ip: "nantetu123.f5.si",
  port: "5346",
  tag: "nantetu5877",
},
nav: {
  home: "Home",
  join: "How to Join",
  guide: "Guide",
  commands: "Commands",
  news: "News",
},
status: {
  loading: "...",
  online: (players) => `${players} players online`,
  offline: "Offline",
},
home: {
  hero_title: "More than just “casual.”\nReliable quality for everyone.",
  hero_subtitle: "Anti-griefing and powerful plugins included.\nEnjoy a stable, community–focused survival world.",
  join_now: "Join Now",
  see_details: "View Details",
  what_is_nantetsu: "What is the Nantetsu Server?",
  description_p1: "A Bedrock server that breaks the limits of Bedrock.",
  description_p2: "A community survival server known for Java-like features and high quality.",
  description_p3: "Powerful plugins offer full protection and monitoring. Prevent griefing and enjoy building safely.",
  description_p4: "New players are always welcome! Feel free to ask questions on our Discord community.",
  see_news: "View Latest News",
  stats_title: "Server Highlights",
  stat_cumulative_players: "Total Players Joined",
  stat_retention_rate: "High Retention Rate",
  stat_uptime: "Uptime",
  stat_max_online: "Max Online Players",
  feature_p1_title: "Perfect Land Protection",
  feature_p1_desc: "Protect your builds with a single command. Offers top-class safety against griefers.",
  feature_p2_title: "Complete Audit Logs",
  feature_p2_desc: "Every action is logged. Staff can track issues and roll back griefing instantly.",
  feature_p3_title: "Discord Integration",
  feature_p3_desc: "In-game chat syncs with Discord. Stay connected even when you're offline.",
  feature_p4_title: "Useful Commands",
  feature_p4_desc: "Commands like /tpa and /home make gameplay easier. Click to view the full list.",
  feature_p5_title: "Ultra Low Latency",
  feature_p5_desc: "Runs smoothly even with many players. Perfect for survival or building.",
  feature_p6_title: "Beginner Friendly",
  feature_p6_desc: "A warm, welcoming community — great even for first-time multiplayer players.",
  rules_title: "Server Rules",
  rules_subtitle: "Basic guidelines so everyone can enjoy the server.",
  quiz_title: "Rules Confirmation Quiz",
  quiz_subtitle: "Answer 3 short questions to confirm you understand the rules. Aim for a perfect score!",
  quiz_start: "Start Quiz",
  quiz_done: "Well done!",
  quiz_score: (score, total) => `Your Score: ${score} / ${total}`,
  quiz_result_perfect: "Perfect! You're ready to join the server.",
  quiz_result_retry: "Please review the rules again and play responsibly.",
  quiz_retry: "Try Again",
  quiz_correct: "Correct!",
  quiz_incorrect: "Incorrect...",
  contact_title: "Contact",
  contact_name: "Name (Minecraft ID)",
  contact_email: "Contact (Discord / Email)",
  contact_message: "Message",
  contact_placeholder_name: "Steve",
  contact_placeholder_email: "name#1234",
  contact_placeholder_msg: "Enter your message...",
  contact_send: "Send",
},
news: {
  title: "News",
  subtitle: "Latest server updates and maintenance information.",
  maintenance: "Maintenance",
  info: "Information",
  default_data: [
    { id: 1, date: "2025.11.10", title: "Server Stability Update", content: "Memory allocation has been adjusted to reduce lag during peak hours.", type: "maintenance" },
    { id: 2, date: "2025.09.01", title: "Nantetsu Server Officially Open!", content: "Our survival Bedrock server is now open to everyone! We look forward to seeing you in-game.", type: "info" },
    { id: 3, date: "2025.08.25", title: "Beta Test Concluded", content: "Thank you for your participation! Final adjustments are now underway for the official release.", type: "info" }
  ],
},
commands: {
  title: "Command List",
  subtitle: "Useful commands for everyday gameplay.",
  admin_title: "Admin Commands (Reference)",
  sections: [
    {
      category: "Movement / Teleport (Essentials)",
      color: "text-purple-600",
      commands: [
        { cmd: "/tpa <player>", desc: "Send a teleport request to a player." },
        { cmd: "/tpaccept", desc: "Accept a /tpa request." },
        { cmd: "/tpdeny", desc: "Deny a /tpa request." },
        { cmd: "/back", desc: "Return to your previous location or death point." },
        { cmd: "/sethome", desc: "Set your home point." },
        { cmd: "/home", desc: "Teleport to your home." },
        { cmd: "/spawn", desc: "Return to the server spawn." },
        { cmd: "/warp", desc: "Teleport to public warp locations." }
      ]
    },
    {
      category: "Land Protection & Logs (Territory / Tianyan)",
      color: "text-green-600",
      commands: [
        { cmd: "/tty", desc: "Set your land claim. (Requires coordinates prepared in advance)" },
        { cmd: "/tygui", desc: "View audit logs in a GUI. Useful for checking griefers." },
        { cmd: "/ty x y z <time> <radius>", desc: "Search audit logs via chat. (Advanced users only)" }
      ]
    },
    {
      category: "Economy & Communication (UMoney / Essentials)",
      color: "text-yellow-600",
      commands: [
        { cmd: "/um", desc: "Check your current money balance." },
        { cmd: "/um → <send>", desc: "Send money to another player." },
        { cmd: "/um → <ranking>", desc: "View server-wide money rankings." },
        { cmd: "/msg <player> <message>", desc: "Send a private message." },
        { cmd: "/ping", desc: "Check your connection latency." },
        { cmd: "/notice", desc: "View server announcements." }
      ]
    },
    {
      category: "Roleplay (RolePlay)",
      color: "text-pink-600",
      commands: [
        { cmd: "/e <action>", desc: "Send an action/emote message. (Example: /e happy)" }
      ]
    }
  ],
  admin_sections: [
    {
      category: "Server Management (Essentials / U_Backup)",
      commands: [
        { cmd: "/broadcast <message>", desc: "Send an announcement to the whole server." },
        { cmd: "/kick <player> [reason]", desc: "Kick a player." },
        { cmd: "/ban <player> [reason]", desc: "Ban a player." },
        { cmd: "/unban <player>", desc: "Unban a player." },
        { cmd: "/gamemode <mode> [player]", desc: "Change a player's game mode." },
        { cmd: "/tp <target> [destination]", desc: "Teleport a player." },
        { cmd: "/backup", desc: "Create a server backup." }
      ]
    },
    {
      category: "Economy & Territory Management (UMoney / Territory)",
      commands: [
        { cmd: "/um → <admin>", desc: "Manage another player's money." },
        { cmd: "/optty set ...", desc: "Force-manage a player's territory." },
        { cmd: "/optty reload", desc: "Reload the Territory plugin configuration." }
      ]
    }
  ]
},
join: {
  title: "How to Join",
  subtitle: "Use the information below to join from the Bedrock Edition \"Add Server\" menu.",
  bedrock_tag: "Bedrock Edition",
  status_online: "Online",
  status_offline: "Offline",
  info_title: "Server Join Information",
  info_desc: "Use the following details to join via Bedrock's “Add Server.” Alternatively, you may join via friend request.",
  label_gamertag: "Gamertag (Friend Request)",
  label_ip: "IP Address",
  label_port: "Port",
  btn_discord: "Join Discord",
  btn_guide: "Connection Guide",
  img_alt_text: "Join Screen",
  img_overlay_text: "Your adventure starts now.",
  copy_success: "Copied to clipboard!",
},
guide: {
  title: "Beginner Guide & FAQ",
  subtitle: "How to start your journey and answers to common questions.",
  steps_title: "Getting Started",
  steps: [
    { step: 1, title: "Move Away From Spawn", content: "You will spawn at the central hub. After reading the signs, move to a safe area. You can also use `/warp` to visit public facilities." },
    { step: 2, title: "Find a Place to Build", content: "Choose a spot at least 5 blocks away from other players' bases. Asking “Anyone nearby?” in chat is helpful." },
    { step: 3, title: "Protect Your Land (Important)", content: "To prevent griefing, make sure to protect your base using `/tty`. After that, don’t forget to set a home with `/sethome`!" },
    { step: 4, title: "Join Discord", content: "Join our Discord community for support and announcements." }
  ],
  faq_title: "Frequently Asked Questions",
  faq_data: [
    { q: "Q1: How does land protection work?", a: "A: Use `/tty` to set up your land protection. The specified coordinates will be protected automatically..." }
  ]
}

};

// --- API Utility ---

const withExponentialBackoff = async (fn, maxRetries = 5) => {
  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

const fetchGeminiResponse = async (chatHistory, currentLang) => {
  const API_ROUTE_URL = '/api/gemini'; 
  try {
    const response = await fetch(API_ROUTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatHistory, currentLang })
    });
    const result = await response.json();
    if (response.ok && result.text) {
      return { text: result.text, error: null };
    } else {
      return { text: null, error: currentLang === 'ja' ? "回答できませんでした。" : "Error fetching response." };
    }
  } catch (error) {
    return { text: null, error: currentLang === 'ja' ? "通信エラー。" : "Network error." };
  }
};

// CSV Parser for Google Sheets
const parseCSV = (text) => {
    const rows = text.split('\n').slice(1); // Skip header
    return rows.map((row, index) => {
        const cols = row.split(','); 
        if (cols.length < 4) return null;
        return {
            id: index + 100, // Offset ID to avoid conflict
            date: cols[0]?.trim() || "",
            title: cols[1]?.trim() || "No Title",
            content: cols[2]?.trim() || "",
            type: cols[3]?.trim() === 'maintenance' ? 'maintenance' : 'info'
        };
    }).filter(item => item !== null);
};

// --- Components ---

const LoadingScreen = ({ onLoaded }) => (
    <div className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col items-center justify-center animate-fade-out pointer-events-none">
        <div className="text-center">
             <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-bounce">
                <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Loading" className="w-16 h-16 rounded-full object-cover" />
             </div>
             <h1 className="text-white text-2xl font-bold tracking-wider mb-4">Nantetsu Server</h1>
             <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
                 <div className="h-full bg-purple-500 animate-progress"></div>
             </div>
        </div>
    </div>
);

const LoadingBar = ({ isLoading }) => (
    <div className={`fixed top-0 left-0 w-full h-1 z-[10000] transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        {isLoading && <div className="h-full bg-purple-600 animate-progress shadow-[0_0_10px_rgba(147,51,234,0.7)]"></div>}
    </div>
);

const Toast = ({ message }) => (
  <div className="fixed bottom-20 right-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up z-50 border-l-4 border-purple-500 ring-1 ring-black/5">
    <CheckCircle size={20} className="text-green-500" />
    <span className="font-bold">{message}</span>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, colorClass, bgClass, onClick }) => (
  <div 
    onClick={onClick}
    className={`glass-panel p-8 rounded-2xl transition-all duration-500 hover:shadow-2xl group relative overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-2' : 'hover:-translate-y-1'}`}
  >
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${bgClass} bg-opacity-20 shadow-inner relative z-10`}>
      <Icon size={32} className={`${colorClass} transform group-hover:scale-110 transition-transform duration-300`} />
    </div>
    <h3 className="text-xl font-black mb-3 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-800 dark:group-hover:text-gray-200">{description}</p>
    {onClick && (
        <div className="mt-4 flex items-center text-sm font-bold text-purple-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Details <ArrowRight size={14} className="ml-1" />
        </div>
    )}
  </div>
);

const CopyBox = ({ label, value, onCopy }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-md">
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
          {label}
      </p>
      <p className="font-mono text-xl font-bold text-gray-800 dark:text-gray-100 select-all break-all group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">{value}</p>
    </div>
    <button 
      onClick={() => onCopy(value)}
      className="flex-shrink-0 flex items-center justify-center gap-2 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 px-4 py-2 rounded-lg transition-all font-bold text-sm whitespace-nowrap active:scale-95"
    >
      <Copy size={16} />
      {LANGUAGES[App.currentLang].footer.copy_success ? 'コピー' : 'Copy'}
    </button>
  </div>
);

const AccordionItem = ({ title, content, isOpen, toggle }) => (
  <div className={`border border-gray-200 dark:border-gray-700 rounded-xl mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg ring-2 ring-purple-500/20 border-purple-500/50' : 'shadow-sm hover:shadow-md bg-white dark:bg-gray-800'}`}>
    <button 
      onClick={toggle}
      className={`w-full flex items-center justify-between p-5 text-left font-bold text-lg transition-colors ${isOpen ? 'bg-purple-600 text-white' : 'text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
    >
      <span className="flex items-center gap-3">
          {isOpen && <Sparkles size={18} className="animate-pulse" />}
          {title}
      </span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
       <div className="p-6 bg-gray-50 dark:bg-gray-900/80 backdrop-blur-sm">
          {Array.isArray(content) ? (
             <ul className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
               {content.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1.5 flex-shrink-0">
                        <CheckCircle size={16} />
                    </span>
                    <span>{item}</span>
                 </li>
               ))}
             </ul>
          ) : (
             <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{content}</div>
          )}
       </div>
    </div>
  </div>
);

// --- Page Content Components ---

const NotFoundPage = ({ L, onNavigateHome }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in-scale">
    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-8 rounded-full mb-8 animate-float">
      <AlertTriangle size={64} className="text-yellow-500" />
    </div>
    <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">404</h2>
    <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">{L.footer.not_found_title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-8">{L.footer.not_found_desc}</p>
    <button onClick={onNavigateHome} className="flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 px-10 rounded-full shadow-2xl hover:scale-105 transition-transform">
      <Home size={20} />
      {L.footer.not_found_btn}
    </button>
  </div>
);

const NewsPage = ({ L, newsData }) => (
  <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black mb-4 dark:text-white flex items-center justify-center gap-3">
          <Bell className="text-purple-500" size={36} />
          {L.news.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg">{L.news.subtitle}</p>
    </div>
    <div className="space-y-8 relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
      
      {newsData.map((news, idx) => (
        <div key={news.id} className="relative md:pl-24 animate-fade-in-up" style={{animationDelay: `${idx * 100}ms`}}>
          <div className={`absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 shadow-sm z-10 hidden md:block ${news.type === 'maintenance' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
          <div className="glass-panel p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
            <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
              <span className="font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  <Clock size={14} /> {news.date}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${news.type === 'maintenance' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                {news.type === 'maintenance' ? L.news.maintenance : L.news.info}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{news.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{news.content}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const JoinSection = ({ L, serverStatus, handleCopy, navigate }) => (
  <section id="join" className="py-24 px-4 relative overflow-hidden animate-fade-in-scale">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-50/50 dark:to-purple-900/10 pointer-events-none"></div>
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
         <span className="inline-block py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-sm font-bold mb-4 animate-bounce">Let's Play Together</span>
         <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white tracking-tight">{L.join.title}</h2>
         <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">{L.join.subtitle}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row">
        <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-purple-500/20">{L.join.bedrock_tag}</span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${serverStatus.online ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400' : 'border-red-200 bg-red-50 text-red-700'}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {serverStatus.online ? L.join.status_online : L.join.status_offline}
            </div>
          </div>
          <h2 className="text-3xl font-black mb-6 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">{L.join.info_title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed text-lg">{L.join.info_desc}</p>
          <div className="space-y-6 mb-10">
            <CopyBox label={L.join.label_gamertag} value={L.server.tag} onCopy={handleCopy} />
            <div className="grid sm:grid-cols-2 gap-4">
              <CopyBox label={L.join.label_ip} value={L.server.ip} onCopy={handleCopy} />
              <CopyBox label={L.join.label_port} value={L.server.port} onCopy={handleCopy} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://discord.gg/your_server_invite" target="_blank" rel="noreferrer" className="flex-1 group relative bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
              <MessageCircle size={20} className="relative z-10" />
              <span className="relative z-10">{L.join.btn_discord}</span>
            </a>
            <button onClick={() => navigate('guide')} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
              <ExternalLink size={20} />
              {L.join.btn_guide}
            </button>
          </div>
        </div>
        <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-0 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2070&auto=format&fit=crop" alt={L.join.img_alt_text} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-8">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white font-bold text-2xl drop-shadow-lg mb-2">{L.join.img_overlay_text}</p>
                <div className="w-16 h-1 bg-yellow-400 rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const JoinPage = ({ L, serverStatus, handleCopy, navigate }) => (
    <div className="pt-24">
        <JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} />
    </div>
);

const CommandsPage = ({ L }) => (
  <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in-scale">
    <div className="text-center mb-20">
      <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-6 text-purple-600 dark:text-purple-400">
         <Terminal size={40} />
      </div>
      <h2 className="text-4xl font-black mb-4 dark:text-white">{L.commands.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">{L.commands.subtitle}</p>
    </div>
    
    <div className="grid gap-16">
      {L.commands.sections.map((section, idx) => {
        const icons = [Gamepad2, Shield, DollarSign, Users];
        const Icon = icons[idx] || HelpCircle;
        return (
          <div key={idx} className="animate-fade-in-up" style={{animationDelay: `${idx * 100}ms`}}>
            <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-xl ${section.color} bg-opacity-10 bg-current`}>
                    <Icon size={24} className={section.color} />
                </div>
                <h3 className={`text-2xl font-bold ${section.color}`}>{section.category}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {section.commands.map((cmd, cIdx) => (
                <div key={cIdx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 transition-all hover:shadow-md group">
                  <div className="flex justify-between items-start gap-4 mb-3">
                      <code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 text-purple-700 dark:text-purple-300 rounded-lg font-mono font-bold text-sm border border-gray-200 dark:border-gray-700 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">{cmd.cmd}</code>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{cmd.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const GuidePage = ({ L, activeAccordion, setActiveAccordion }) => (
  <div className="max-w-5xl mx-auto py-32 px-4 animate-fade-in-scale">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white tracking-tight flex justify-center items-center gap-4">
          <BookOpen className="text-purple-500 hidden sm:block" size={48} />
          {L.guide.title}
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400">{L.guide.subtitle}</p>
    </div>
    <div className="mb-24 relative">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">{L.guide.steps_title}</h3>
        <div className="absolute left-1/2 top-20 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-transparent transform -translate-x-1/2 hidden md:block -z-10"></div>
        <div className="space-y-12">
            {L.guide.steps.map((item, index) => (
                <div key={item.step} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                    <div className="flex-1 w-full">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-purple-400 transition-colors relative group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 rounded-l-3xl"></div>
                            <h4 className="text-xl font-bold mb-3 dark:text-white group-hover:text-purple-600 transition-colors">{item.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p>
                        </div>
                    </div>
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-xl shadow-purple-500/40 z-10 relative ring-4 ring-white dark:ring-gray-900">{item.step}</div>
                    </div>
                    <div className="flex-1 hidden md:block"></div>
                </div>
            ))}
        </div>
    </div>
    <div className="max-w-3xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-10 dark:text-white flex items-center justify-center gap-3"><HelpCircle size={32} className="text-yellow-500" />{L.guide.faq_title}</h3>
        <div className="space-y-4">
            {L.guide.faq_data.map((faq, idx) => (
                <AccordionItem key={idx} title={faq.q} content={faq.a} isOpen={activeAccordion === `faq-${idx}`} toggle={() => setActiveAccordion(activeAccordion === `faq-${idx}` ? null : `faq-${idx}`)} />
            ))}
        </div>
    </div>
  </div>
);

const TermsPage = ({ L }) => (
  <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
    <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><FileText className="text-purple-500" size={40} />{L.terms.title}</h2>
        <p className="text-gray-500 dark:text-gray-400">{L.terms.date}</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-8 md:p-16 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
        {L.terms.chapters.map((chapter, idx) => (
            <div key={idx} className="relative">
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-6 border-b-2 border-purple-100 dark:border-gray-700 pb-3 inline-block">{chapter.title}</h3>
                <div className="grid gap-8">
                    {chapter.articles.map((article, aIdx) => (
                        <div key={aIdx} className="group">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">{article.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-loose pl-4 border-l-2 border-gray-200 dark:border-gray-700 group-hover:border-purple-300 transition-colors">{article.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        ))}
        <div className="text-right pt-12 border-t border-gray-200 dark:border-gray-700">
             <p className="font-bold text-lg text-gray-800 dark:text-gray-200 font-serif italic">{L.terms.signature}</p>
        </div>
    </div>
  </div>
);

const PrivacyPage = ({ L }) => (
  <div className="max-w-3xl mx-auto py-32 px-4 animate-fade-in-scale">
    <div className="text-center mb-16">
        <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4"><Lock size={32} /></div>
        <h2 className="text-4xl font-black mb-4 dark:text-white">{L.privacy.title}</h2>
    </div>
    <div className="glass-panel p-10 md:p-14 rounded-3xl shadow-lg text-gray-700 dark:text-gray-300 leading-loose space-y-8">
        <p className="text-lg">{L.privacy.intro}</p>
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><span className="text-purple-500">1.</span> {L.privacy.section1_title}</h3>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="mb-6">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">{L.privacy.subsection1_1_title}</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex gap-2"><span className="font-bold min-w-[80px]">{L.privacy.subsection1_1_info}</span> {L.privacy.subsection1_1_data[0]}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl flex items-center justify-between">
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{L.privacy.section3_title}</h3>
                <p className="text-sm">{L.privacy.section3_content}</p>
            </div>
            <a href={`mailto:${L.privacy.email}`} className="text-purple-600 font-bold hover:underline bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">{L.privacy.email}</a>
        </div>
    </div>
  </div>
);

const SearchResultsPage = ({ L, searchTerm, searchResults, navigate }) => {
  if (!searchTerm) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center animate-fade-in-scale">
        <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">{L.footer.search_results_title}</h2>
        <p className="text-gray-500">{L.footer.search_placeholder}</p>
      </div>
    );
  }

  const resultCount = searchResults.reduce((sum, category) => sum + category.results.length, 0);

  const categoryMap = {
    news: L.footer.search_category_news,
    command: L.footer.search_category_command,
    guide: L.footer.search_category_guide,
    terms: L.footer.search_category_terms,
    privacy: L.footer.search_category_privacy,
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-4 animate-fade-in-scale">
      <div className="flex items-baseline gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <h2 className="text-3xl font-black dark:text-white">{L.footer.search_results_title}</h2>
          <span className="text-lg text-gray-500 dark:text-gray-400">
             {resultCount > 0 ? L.footer.search_found(resultCount) : L.footer.search_no_results(searchTerm)}
          </span>
      </div>

      {resultCount > 0 && (
        <div className="space-y-12">
          {searchResults.map((category, index) => (
            category.results.length > 0 && (
              <div key={index}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                  {categoryMap[category.category]}
                </h3>
                <div className="grid gap-4">
                  {category.results.map((result, rIdx) => (
                    <div 
                      key={rIdx} 
                      onClick={() => navigate('search_redirect', result.path)}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-lg dark:text-white group-hover:text-purple-600 transition-colors mb-1">{result.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{result.content}</p>
                          </div>
                          <ArrowRight className="text-gray-300 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

const HomePage = ({ L, serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, scrollToSection, navigate, activeAccordion, setActiveAccordion, showToast }) => {
  const QUIZ_DATA = L.quiz_data;
  return (
    <div className="animate-fade-in">
      <header className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1607016284345-c5478694085f?q=80&w=2070&auto=format&fit=crop" alt="Minecraft Landscape" className="w-full h-full object-cover transform scale-105 animate-float" style={{animationDuration: '20s'}} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/2070x600/1e293b/a8a8a8?text=Minecraft+Server"; }} />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/50 to-gray-900"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 animate-fade-in-up">
             <span className={`w-2 h-2 rounded-full animate-pulse ${serverStatus.online ? 'bg-green-400' : 'bg-red-500'}`}></span>
             <span className="font-bold text-sm tracking-wider uppercase">
                {serverStatus.online ? L.status.online(serverStatus.players) : L.status.offline}
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl whitespace-pre-line animate-fade-in-up transition-all duration-700">
            {L.home.hero_title.split('\n')[0]}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 animate-pulse">{L.home.hero_title.split('\n')[1]}</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-medium whitespace-pre-line leading-relaxed animate-fade-in-up" style={{animationDelay: '200ms'}}>{L.home.hero_subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{animationDelay: '400ms'}}>
            <button onClick={() => scrollToSection('join')} className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-lg font-black rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_20px_30px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2"><Gamepad2 size={24} />{L.home.join_now}</span>
              <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
            </button>
            <button onClick={() => scrollToSection('about')} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-lg font-bold rounded-full transition-all flex items-center gap-2 hover:scale-105">
              <HelpCircle size={24} />{L.home.see_details}
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-20 -mt-16 max-w-6xl mx-auto px-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
                { val: "150+", label: L.home.stat_cumulative_players, icon: Users, color: "text-blue-500" },
                { val: "70%", label: L.home.stat_retention_rate, icon: CheckCircle, color: "text-green-500" },
                { val: "99.9%", label: L.home.stat_uptime, icon: Server, color: "text-purple-500" },
                { val: "15+", label: L.home.stat_max_online, icon: Zap, color: "text-yellow-500" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <stat.icon className={`${stat.color} mb-3 transform group-hover:scale-110 transition-transform`} size={32} />
                  <div className="text-3xl font-black text-gray-800 dark:text-white mb-1">{stat.val}</div>
                  <div className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
        </div>
      </div>

      <section id="about" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6"><Server size={32} /></div>
              <h2 className="text-4xl font-black mb-8 dark:text-white leading-tight">{L.home.what_is_nantetsu}</h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                <p className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-l-4 border-purple-500">
                  <strong className="text-purple-600 dark:text-purple-400 block text-xl mb-2">{L.home.description_p1}</strong>{L.home.description_p2}
                </p>
                <p>{L.home.description_p3}</p>
                <button onClick={() => navigate('news')} className="group flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold mt-4 px-6 py-3 rounded-full bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all w-fit">
                    <Bell size={18} className="group-hover:rotate-12 transition-transform" /> {L.home.see_news}
                </button>
              </div>
            </div>
            <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4 mt-12">
                        <img src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=800&auto=format&fit=crop" className="rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-500" alt="Feature 1" />
                        <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
                            <Shield size={40} className="mb-2" /><span className="font-bold">Anti-Grief</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-yellow-500 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center h-32">
                            <Clock size={40} className="mb-2" /><span className="font-bold">24/7 Online</span>
                        </div>
                        <img src="https://images.unsplash.com/photo-1599639668333-7563441f7361?q=80&w=800&auto=format&fit=crop" className="rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-500 h-64 object-cover" alt="Feature 2" />
                    </div>
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 bg-gray-50 dark:bg-gray-900/50 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-black mb-16 inline-block relative dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">{L.home.stats_title}</span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-purple-500 rounded-full"></div>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <FeatureCard icon={Shield} title={L.home.feature_p1_title} description={L.home.feature_p1_desc} bgClass="bg-orange-500" colorClass="text-orange-500" />
            <FeatureCard icon={Clock} title={L.home.feature_p2_title} description={L.home.feature_p2_desc} bgClass="bg-green-500" colorClass="text-green-500" />
            <FeatureCard icon={MessageCircle} title={L.home.feature_p3_title} description={L.home.feature_p3_desc} bgClass="bg-indigo-500" colorClass="text-indigo-500" />
            <FeatureCard icon={Terminal} title={L.home.feature_p4_title} description={L.home.feature_p4_desc} bgClass="bg-lime-600" colorClass="text-lime-600" onClick={() => navigate('commands')} />
            <FeatureCard icon={Server} title={L.home.feature_p5_title} description={L.home.feature_p5_desc} bgClass="bg-yellow-500" colorClass="text-yellow-500" />
            <FeatureCard icon={BookOpen} title={L.home.feature_p6_title} description={L.home.feature_p6_desc} bgClass="bg-pink-500" colorClass="text-pink-500" onClick={() => navigate('guide')} />
          </div>
        </div>
      </section>

      <JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} />

      <section id="rules" className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
          <div className="max-w-4xl mx-auto">
               <div className="text-center mb-16">
                 <h2 className="text-4xl font-black mb-4 dark:text-white">{L.home.rules_title}</h2>
                 <p className="text-gray-600 dark:text-gray-400 text-lg">{L.home.rules_subtitle}</p>
               </div>
               <div className="mb-20 space-y-6">
                 {L.rules_data.map((rule, idx) => (
                    <AccordionItem key={idx} title={rule.title} content={rule.content} isOpen={activeAccordion === `rules-${idx}`} toggle={() => setActiveAccordion(activeAccordion === `rules-${idx}` ? null : `rules-${idx}`)} />
                ))}
               </div>
               <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-16 border border-purple-100 dark:border-gray-700 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
                {!quizState.started ? (
                    <div className="animate-fade-in relative z-10">
                        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                            <HelpCircle size={48} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-3xl font-black mb-6 dark:text-white">{L.home.quiz_title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-lg mx-auto leading-relaxed">{L.home.quiz_subtitle}</p>
                        <button onClick={() => setQuizState({ ...quizState, started: true })} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full shadow-xl shadow-purple-500/30 transition-all transform hover:scale-105 hover:-translate-y-1 text-lg">
                            {L.home.quiz_start}
                        </button>
                    </div>
                ) : quizState.finished ? (
                    <div className="animate-fade-in-up relative z-10">
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle size={48} className="text-green-600 dark:text-green-400" /></div>
                        <h3 className="text-3xl font-black mb-2 dark:text-white">{L.home.quiz_done}</h3>
                        <p className="text-2xl font-bold mb-8 text-purple-600 dark:text-purple-400">{L.home.quiz_score(quizState.score, QUIZ_DATA.length)}</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg">{quizState.score === QUIZ_DATA.length ? L.home.quiz_result_perfect : L.home.quiz_result_retry}</p>
                        <button onClick={resetQuiz} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-8 py-3 rounded-xl font-bold transition-colors">{L.home.quiz_retry}</button>
                    </div>
                ) : (
                    <div className="text-left animate-fade-in relative z-10">
                         <div className="flex justify-between items-end mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <span className="text-3xl font-black text-purple-600 dark:text-purple-400">Q{quizState.current + 1}</span>
                            <span className="text-sm font-bold text-gray-400">{quizState.current + 1} / {QUIZ_DATA.length}</span>
                        </div>
                        <h4 className="text-xl md:text-2xl font-bold mb-10 dark:text-white min-h-[4rem] leading-snug">{QUIZ_DATA[quizState.current].question}</h4>
                        <div className="grid gap-4">
                            {QUIZ_DATA[quizState.current].options.map((opt, idx) => (
                                <button key={idx} onClick={() => !quizState.showResult && handleQuizAnswer(opt)} disabled={quizState.showResult} className={`w-full p-6 rounded-2xl text-left font-bold border-2 transition-all transform ${quizState.showResult ? opt === QUIZ_DATA[quizState.current].answer ? "bg-green-100 border-green-500 text-green-900 dark:bg-green-900 dark:border-green-500 dark:text-green-100 scale-[1.02] shadow-lg" : "bg-white border-gray-200 opacity-50 dark:bg-gray-700 dark:border-gray-600 grayscale" : "bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 hover:shadow-md hover:-translate-y-1"}`}>
                                    <div className="flex justify-between items-center">{opt}{quizState.showResult && opt === QUIZ_DATA[quizState.current].answer && (<CheckCircle size={24} className="text-green-600" />)}</div>
                                </button>
                            ))}
                        </div>
                         {quizState.showResult && (
                            <div className={`mt-6 text-center font-black text-xl animate-bounce ${quizState.isCorrect ? 'text-green-600' : 'text-red-500'}`}>{quizState.isCorrect ? L.home.quiz_correct : L.home.quiz_incorrect}</div>
                        )}
                    </div>
                )}
               </div>
          </div>
      </section>

      <section id="contact" className="py-32 px-4">
        <div className="max-w-2xl mx-auto relative">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 relative z-10">
                <h2 className="text-3xl font-black mb-8 text-center dark:text-white">{L.home.contact_title}</h2>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); showToast(L.currentLang === 'ja' ? "送信しました！（デモ）" : "Message Sent! (Demo)"); }}>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-purple-600 transition-colors">{L.home.contact_name}</label>
                        <div className="relative"><User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} /><input type="text" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all dark:text-white" placeholder={L.home.contact_placeholder_name} required /></div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-purple-600 transition-colors">{L.home.contact_email}</label>
                        <div className="relative"><MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} /><input type="text" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all dark:text-white" placeholder={L.home.contact_placeholder_email} required /></div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-purple-600 transition-colors">{L.home.contact_message}</label>
                        <textarea rows="5" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all dark:text-white resize-none" placeholder={L.home.contact_placeholder_msg} required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"><Send size={20} />{L.home.contact_send}</button>
                </form>
            </div>
        </div>
      </section>
    </div>
  );
};

const AIChat = ({ L, isChatOpen, closeChat }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input.trim() };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setInput('');
    setIsLoading(true);

    const { text, error } = await fetchGeminiResponse(newHistory, App.currentLang);
    setIsLoading(false);
    
    if (text) {
      setChatHistory(prev => [...prev, { role: 'model', text: text }]);
    } else {
      setChatHistory(prev => [...prev, { role: 'model', text: error, isError: true }]);
    }
  };

  const handleClear = () => setChatHistory([]);

  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-end justify-end md:justify-center p-0 md:p-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full md:max-w-md h-full md:h-[650px] flex flex-col rounded-t-2xl md:rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-slide-in-up border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center shadow-md">
          <div>
             <h3 className="text-lg font-black flex items-center gap-2">
                <Zap size={20} className="text-yellow-300 fill-current" />
                {L.footer.chat_title}
             </h3>
             <p className="text-xs text-purple-200 opacity-90">Powered by Gemini</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleClear} disabled={chatHistory.length === 0} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white" title={L.footer.chat_clear}>
              <Trash2 size={18} />
            </button>
            <button onClick={closeChat} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        <div ref={chatRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-black/20">
          {chatHistory.length === 0 ? (
            <div className="text-center p-8 pt-20 text-gray-500 dark:text-gray-400 animate-fade-in-up">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                 <MessageCircle size={36} className="text-purple-500" />
              </div>
              <p className="font-bold text-lg mb-2">{L.footer.chat_subtitle}</p>
              <p className="text-sm opacity-70">AI can answer questions about server rules and commands.</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-scale origin-bottom`}>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : msg.isError
                    ? 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-bl-none border border-red-200'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                <div className="flex space-x-1">
                   <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                   <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                   <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-xs text-gray-400">{L.footer.chat_loading}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={L.footer.chat_input_placeholder}
              className="flex-grow pl-5 pr-12 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white shadow-inner"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-all flex items-center justify-center shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [page, setPage] = useState('home'); 
  const [serverStatus, setServerStatus] = useState({ online: false, players: 0, loading: true });
  const [toastMessage, setToastMessage] = useState(null);
  const [quizState, setQuizState] = useState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null });
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('ja');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // New State for features
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [hasUnreadNews, setHasUnreadNews] = useState(false);

  const L = LANGUAGES[currentLang];
  App.currentLang = currentLang;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial Loading & Fetching Data
  useEffect(() => {
    // 1. Simulate Initial App Load (2 seconds)
    const loadTimer = setTimeout(() => {
        setIsAppLoading(false);
    }, 2000);

    // 2. Fetch Server Status
    setTimeout(() => {
        setServerStatus({ online: true, players: 12, loading: false });
    }, 1500);

    // 3. Fetch News from Google Sheets CSV
    const fetchNews = async () => {
        try {
            let data = L.news.default_data; 
            if (!SHEET_CSV_URL.includes("EXAMPLE_KEY")) {
                 const res = await fetch(SHEET_CSV_URL);
                 if (res.ok) {
                     const text = await res.text();
                     const parsed = parseCSV(text);
                     if (parsed.length > 0) data = parsed;
                 }
            }
            setNewsData(data);
            
            const lastReadId = localStorage.getItem('lastReadNewsId');
            const latestId = data[0]?.id;
            if (latestId && (!lastReadId || latestId > parseInt(lastReadId))) {
                setHasUnreadNews(true);
            }

        } catch (e) {
            console.error("News fetch failed", e);
            setNewsData(L.news.default_data);
        }
    };
    fetchNews();

    // 4. Handle URL Routing on Load
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const validPages = ['home', 'join', 'news', 'commands', 'guide', 'terms', 'privacy'];
        if (validPages.includes(hash)) {
            setPage(hash);
        } else {
            setPage('404');
        }
    }

    return () => clearTimeout(loadTimer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast(L.footer.copy_success);
  };

  const handleQuizAnswer = (selected) => {
    const QUIZ_DATA = L.quiz_data;
    const currentQ = QUIZ_DATA[quizState.current];
    const isCorrect = selected === currentQ.answer;
    setQuizState(prev => ({ ...prev, showResult: true, isCorrect }));
    setTimeout(() => {
      if (quizState.current < QUIZ_DATA.length - 1) {
        setQuizState(prev => ({ ...prev, current: prev.current + 1, score: isCorrect ? prev.score + 1 : prev.score, showResult: false, isCorrect: null }));
      } else {
        setQuizState(prev => ({ ...prev, score: isCorrect ? prev.score + 1 : prev.score, finished: true, showResult: false }));
      }
    }, 1500);
  };

  const resetQuiz = () => setQuizState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null });

  const navigate = (target, sectionId = null) => {
      if (page === target && !sectionId) return;

      setIsPageLoading(true);
      
      if (target === 'news' && hasUnreadNews) {
          setHasUnreadNews(false);
          if (newsData[0]) localStorage.setItem('lastReadNewsId', newsData[0].id);
      }

      setTimeout(() => {
          if (target === 'search_redirect') {
              setIsPageLoading(false);
              return;
          }

          setPage(target);
          setIsMenuOpen(false);
          setActiveAccordion(null); 
          
          window.location.hash = target === 'home' ? '' : target;
          window.scrollTo({ top: 0, behavior: 'smooth' });

          if (sectionId) {
              if (target === 'home') {
                   setTimeout(() => {
                      const el = document.getElementById(sectionId);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                   }, 100);
              }
          }
          setIsPageLoading(false);
      }, 600);
  };

  const searchContent = useCallback((term) => {
    if (!term.trim()) return [];
    const terms = term.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    const results = [];
    
    const match = (text) => {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        return terms.every(t => lowerText.includes(t));
    };

    // 1. News
    const newsResults = newsData
      .filter(n => match(n.title) || match(n.content))
      .map(n => ({ title: n.title, content: n.content, path: `news-${n.id}` }));
    if (newsResults.length > 0) results.push({ category: 'news', results: newsResults });

    // 2. Commands
    const commandResults = L.commands.sections.flatMap(sec => 
      sec.commands.filter(cmd => match(cmd.cmd) || match(cmd.desc))
                   .map(cmd => ({ title: cmd.cmd, content: cmd.desc, path: `commands` }))
    );
    if (commandResults.length > 0) results.push({ category: 'command', results: commandResults });

    // 3. Guide/FAQ
    const guideResults = L.guide.faq_data.flatMap((faq, idx) => {
        if (match(faq.q) || match(faq.a)) {
             return [{ title: faq.q, content: faq.a, path: `guide-faq-${idx}` }];
        }
        return [];
    });
    if (guideResults.length > 0) results.push({ category: 'guide', results: guideResults });

    // 4. Terms & Privacy
    const termsResults = L.terms.chapters.flatMap(chapter => 
        chapter.articles.filter(art => match(art.title) || match(art.content))
                        .map(art => ({ title: `${chapter.title} - ${art.title}`, content: art.content, path: `terms` }))
    );
    if (termsResults.length > 0) results.push({ category: 'terms', results: termsResults });

    // 5. Privacy
    const privacyContent = [
      { title: L.privacy.section1_title, content: L.privacy.subsection1_1_data[0] + L.privacy.subsection1_1_usage[0] },
      { title: L.privacy.section2_title, content: L.privacy.section2_content }
    ];
    const privacyResults = privacyContent.filter(p => match(p.title) || match(p.content))
                                         .map(p => ({ title: p.title, content: p.content, path: `privacy` }));
    if (privacyResults.length > 0) results.push({ category: 'privacy', results: privacyResults });

    return results;
  }, [L, newsData]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      setSearchResults(searchContent(term));
      setPage('search');
    } else {
      setSearchResults([]);
      if(page === 'search') setPage('home'); 
    }
  };

  const renderPage = () => {
      switch (page) {
          case 'home': return <HomePage L={L} {...{serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, navigate, activeAccordion, setActiveAccordion, scrollToSection: (id) => navigate('home', id), showToast}} />;
          case 'news': return <NewsPage L={L} newsData={newsData} />;
          case 'join': return <JoinPage L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} />;
          case 'commands': return <CommandsPage L={L} />;
          case 'guide': return <GuidePage L={L} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} />;
          case 'terms': return <TermsPage L={L} />;
          case 'privacy': return <PrivacyPage L={L} />;
          case 'search': return <SearchResultsPage L={L} searchTerm={searchTerm} searchResults={searchResults} navigate={navigate} />;
          case '404': default: return <NotFoundPage L={L} onNavigateHome={() => navigate('home')} />;
      }
  };

  return (
    <>
    {isAppLoading && <LoadingScreen />}
    <LoadingBar isLoading={isPageLoading} />
    
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#f8f9fa] text-gray-900'} font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden`}>
      <CustomStyles />
      
      {/* Fixed Header Container */}
      <div className="fixed top-0 left-0 right-0 z-[500] flex flex-col shadow-md">
          {/* Navbar */}
          <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14"> {/* Slimmer height h-14 (56px) */}
                {/* Left: Logo */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('home')}>
                  <img 
                    src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" 
                    alt="Nantetsu Server Icon" 
                    className="w-9 h-9 rounded-full shadow-lg group-hover:scale-110 transition-transform object-cover"
                  />
                  <span className="font-black text-lg tracking-tight text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">なんてつサーバー</span>
                </div>

                {/* Right Container: Nav Links + Search + Actions */}
                <div className="hidden lg:flex items-center gap-6 ml-auto">
                  
                  {/* Nav Links */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                    {['home', 'join', 'news', 'commands', 'guide'].map((key) => (
                        <button 
                          key={key}
                          onClick={() => navigate(key)} 
                          className={`relative px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                              page === key 
                              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-sm' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          {L.nav[key]}
                          {key === 'news' && hasUnreadNews && (
                              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                          )}
                        </button>
                    ))}
                  </div>

                  {/* Search & Toggles */}
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <input type="text" placeholder={L.footer.search_placeholder} value={searchTerm} onChange={handleSearch} className="pl-9 pr-4 py-1.5 w-40 focus:w-56 rounded-full text-sm bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" />
                    </div>
                    <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors font-bold text-xs">{currentLang === 'ja' ? 'EN' : 'JP'}</button>
                    <button onClick={() => setDarkMode(!darkMode)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center gap-4">
                  <button onClick={() => setDarkMode(!darkMode)} className="text-gray-600 dark:text-yellow-400">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                </div>
              </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <div className={`lg:hidden absolute w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-4 pb-6 space-y-2">
                  <div className="relative mb-6">
                    <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder={L.footer.search_placeholder} value={searchTerm} onChange={handleSearch} className="pl-11 pr-4 py-3 w-full rounded-xl text-base bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" />
                  </div>
                  {['home', 'join', 'news', 'guide', 'commands'].map((key) => (
                      <button 
                            key={key}
                            onClick={() => navigate(key)} 
                            className="relative flex items-center justify-between w-full text-left px-4 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-600 rounded-xl transition-colors"
                        >
                            {L.nav[key]}
                            {key === 'news' && hasUnreadNews && (
                                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">NEW</span>
                            )}
                      </button>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className="block w-full text-left px-4 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-xl">
                      🌐 {currentLang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
                  </button>
                </div>
            </div>
          </nav>

          {/* Static News Banner Below Navbar - Only shown if news is unread */}
          {newsData.length > 0 && hasUnreadNews && (
              <div className="bg-purple-600 text-white text-sm font-bold py-2 px-4 text-center z-10 shadow-md relative animate-fade-in-up">
                  <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
                      <Info size={16} className="flex-shrink-0 animate-pulse" />
                      <span className="opacity-90">NEWS:</span>
                      <span className="truncate max-w-lg">{newsData[0].title}</span>
                      <button onClick={() => navigate('news')} className="ml-2 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-xs transition-colors flex-shrink-0">
                          DETAILS
                      </button>
                  </div>
              </div>
          )}
      </div>

      {/* Main Content (Adjusted padding top for fixed header based on news banner visibility) */}
      <main className={`flex-grow relative z-0 ${hasUnreadNews ? 'pt-[96px]' : 'pt-14'} transition-all duration-300`}> 
          {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center border-t border-gray-800 relative overflow-hidden">
        <div className="py-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="mb-12 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-10 shadow-2xl max-w-2xl mx-auto border border-white/10 transform hover:scale-[1.02] transition-transform">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2"><ExternalLink size={24} className="text-yellow-400" />{L.footer.promotion}</h3>
                    <p className="text-purple-200 mb-6">Join the community for support, events, and more!</p>
                    <a href="https://discord.gg/your_server_invite" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-purple-900 font-black px-8 py-3 rounded-full hover:bg-gray-100 transition-all shadow-lg"><MessageCircle size={20} />{L.footer.promotion_link}</a>
                </div>

                {/* Site Map & Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm font-bold text-left max-w-4xl mx-auto">
                    <div>
                        <h4 className="text-white mb-4 uppercase tracking-wider opacity-50">{L.footer.sitemap}</h4>
                        <ul className="space-y-2">
                            <li><button onClick={() => navigate('home')} className="hover:text-purple-400 transition-colors">{L.nav.home}</button></li>
                            <li><button onClick={() => navigate('news')} className="hover:text-purple-400 transition-colors">{L.nav.news}</button></li>
                            <li><button onClick={() => navigate('join')} className="hover:text-purple-400 transition-colors">{L.nav.join}</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-4 uppercase tracking-wider opacity-50">Support</h4>
                        <ul className="space-y-2">
                             <li><button onClick={() => navigate('guide')} className="hover:text-purple-400 transition-colors">{L.nav.guide}</button></li>
                             <li><button onClick={() => navigate('commands')} className="hover:text-purple-400 transition-colors">{L.nav.commands}</button></li>
                        </ul>
                    </div>
                    <div>
                         <h4 className="text-white mb-4 uppercase tracking-wider opacity-50">Legal</h4>
                         <ul className="space-y-2">
                             <li><button onClick={() => navigate('terms')} className="hover:text-purple-400 transition-colors">{L.footer.terms}</button></li>
                             <li><button onClick={() => navigate('privacy')} className="hover:text-purple-400 transition-colors">{L.footer.privacy}</button></li>
                         </ul>
                    </div>
                    <div>
                         <h4 className="text-white mb-4 uppercase tracking-wider opacity-50">Other</h4>
                         <ul className="space-y-2">
                             <li><button onClick={() => navigate('home', 'contact')} className="hover:text-purple-400 transition-colors">{L.footer.contact}</button></li>
                             <li>
                                <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <Youtube size={14} /> YouTube
                                </a>
                             </li>
                             <li>
                                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <Twitter size={14} /> Twitter (X)
                                </a>
                             </li>
                         </ul>
                    </div>
                </div>
                <p className="text-sm opacity-50">&copy; 2025 Nantetsu Server. All rights reserved.<br/>Not affiliated with Mojang AB.</p>
            </div>
        </div>
      </footer>

      {/* Floating AI Chat Button */}
      <div className="fixed bottom-14 right-6 z-[90]">
        <button onClick={() => setIsChatOpen(true)} className="group relative w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <MessageCircle size={32} className="relative z-10" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 border-2 border-purple-600"></span></span>
        </button>
      </div>
      <AIChat L={L} isChatOpen={isChatOpen} closeChat={() => setIsChatOpen(false)} />
      {toastMessage && <Toast message={toastMessage} />}
    </div>
    </>
  );
}