import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Menu, X, Moon, Sun, Copy, CheckCircle, AlertTriangle, 
  Server, Users, Shield, Clock, MessageCircle, MapPin, 
  HelpCircle, ChevronDown, ChevronUp, Gamepad2, Terminal,
  Send, ExternalLink, Home, FileText, List, Bell, BookOpen,
  User, DollarSign, Theater, Lock, Hammer, AlertCircle, Search, Trash2, Zap
} from 'lucide-react';

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
      guide: "初心者ガイド",
      commands: "コマンド",
      news: "お知らせ",
    },
    status: {
      loading: "確認中...",
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
      data: [
        { id: 1, date: "2025.11.10", title: "サーバー稼働安定化のお知らせ", content: "サーバーのメモリ割り当てを調整し、多人数接続時のラグを解消しました。", type: "maintenance" },
        { id: 2, date: "2025.09.01", title: "なんてつサーバー 正式オープン！", content: "統合版サバイバルサーバー「なんてつサーバー」がついにオープンしました！皆様の参加をお待ちしています。", type: "info" },
        { id: 3, date: "2025.08.25", title: "ベータテスト終了のお知らせ", content: "多くのご協力をいただきありがとうございました。正式リリースに向けて最終調整を行います。", type: "info" }
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
          { cmd: "/gamemode <モード> [プレイヤー]", desc: "ゲームモードを変更します。" },
          { cmd: "/tp <対象> [目的地]", desc: "プレイヤーを強制的にテレポートさせます。" },
          { cmd: "/backup", desc: "サーバーデータのバックアップを作成します。" }
        ]},
        { category: "経済・領地管理 (UMoney / Territory)", commands: [
          { cmd: "/um → <管理>", desc: "プレイヤーの所持金を操作します。" },
          { cmd: "/optty set ...", desc: "他人の領地を強制的に管理します。" },
          { cmd: "/optty reload", desc: "領地プラグインの設定をリロードします。" }
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
      promotion: "Discordに参加して最新情報とコミュニティサポートをゲットしよう！",
      promotion_link: "Discordに参加",
      copy_success: "クリップボードにコピーしました！",
      not_found_title: "ページが見つかりません 🚧",
      not_found_btn: "トップページに戻る",
      chat_title: "AIアシスタント (ベータ)",
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
      guide: "Beginner's Guide",
      commands: "Commands",
      news: "News",
    },
    status: {
      loading: "Checking...",
      online: (players) => `${players} players online`,
      offline: "Offline",
    },
    home: {
      hero_title: "More than just 'Relaxed'.\nReliable technology for everyone.",
      hero_subtitle: "Complete with anti-griefing measures and high-spec plugins.\nStart your own life in a stable server environment.",
      join_now: "Join Now",
      see_details: "See Details",
      what_is_nantetsu: "What is Nantetsu Server?",
      description_p1: "Overturning the norms of Bedrock Edition.",
      description_p2: "We are a survival-focused community server, prioritizing Java-level quality and features.",
      description_p3: "Equipped with strong monitoring and protection systems using dedicated plugins, we prevent cheating and griefing, ensuring a safe and free building experience.",
      see_news: "View Latest News",
      stats_title: "Server Features",
      stat_cumulative_players: "Cumulative Players",
      stat_retention_rate: "High Retention Rate",
      stat_uptime: "Uptime",
      stat_max_online: "Max Concurrent",
      feature_p1_title: "Perfect Land Protection",
      feature_p1_desc: "Complete protection for your builds with a single command. Provides a top-class sense of security against griefing.",
      feature_p2_title: "Comprehensive Audit Logs",
      feature_p2_desc: "Full action logs. In case of trouble, admins track logs and provide immediate rollback (restoration).",
      feature_p3_title: "Discord Integration",
      feature_p3_desc: "In-game chat is linked with Discord. Talk to friends even when you are logged out.",
      feature_p4_title: "Convenient Commands",
      feature_p4_desc: "Includes useful features like /tpa, /home. Click to view the command list.",
      feature_p5_title: "Ultra Low Latency",
      feature_p5_desc: "Stress-free high-spec environment. Survival and building are smooth.",
      feature_p6_title: "Beginner Welcome",
      feature_p6_desc: "Friendly community ensures a safe experience even for first-time multiplayer users.",
      rules_title: "Server Rules",
      rules_subtitle: "Basic agreements for everyone to play happily.",
      quiz_title: "Rule Confirmation Quiz",
      quiz_subtitle: "Let's check your understanding with 3 simple questions. Aim for a perfect score!",
      quiz_start: "Start Quiz",
      quiz_done: "Great Job!",
      quiz_score: (score, total) => `Your Score: ${score} / ${total}`,
      quiz_result_perfect: "Perfect! Please feel free to join the server.",
      quiz_result_retry: "Please review the rules again to ensure safe play.",
      quiz_retry: "Try Again",
      quiz_correct: "Correct!",
      quiz_incorrect: "Incorrect...",
      contact_title: "Contact Us",
      contact_name: "Your Name (Minecraft ID)",
      contact_email: "Contact Info (Discord/Email)",
      contact_message: "Message",
      contact_placeholder_name: "Steve",
      contact_placeholder_email: "name#1234",
      contact_placeholder_msg: "Enter your message...",
      contact_send: "Send Message",
    },
    news: {
      title: "News",
      subtitle: "The latest server updates and maintenance information.",
      maintenance: "Maintenance",
      info: "Information",
      data: [
        { id: 1, date: "2025.11.10", title: "Server Stability Improvement Notice", content: "Adjusted server memory allocation to eliminate lag during peak concurrent connections.", type: "maintenance" },
        { id: 2, date: "2025.09.01", title: "Nantetsu Server Officially Open!", content: "The Bedrock survival server 'Nantetsu Server' is finally open! We welcome your participation.", type: "info" },
        { id: 3, date: "2025.08.25", title: "Beta Test Concluded", content: "Thank you for your cooperation. We will make final adjustments for the official release.", type: "info" }
      ],
    },
    commands: {
      title: "Command List",
      subtitle: "A collection of commands to make your server life easier.",
      admin_title: "Admin Commands (Reference)",
      sections: [
        { category: "Movement/Teleportation (Essentials)", color: "text-purple-600", commands: [
          { cmd: "/tpa <playername>", desc: "Requests teleportation to the specified player." },
          { cmd: "/tpaccept", desc: "Accepts a /tpa request." },
          { cmd: "/tpdeny", desc: "Denies a /tpa request." },
          { cmd: "/back", desc: "Returns to the last teleported or died location." },
          { cmd: "/sethome", desc: "Sets the current location as your home point." },
          { cmd: "/home", desc: "Teleports to your set home." },
          { cmd: "/spawn", desc: "Returns to the server's initial spawn point." },
          { cmd: "/warp", desc: "Moves to public facilities set by the administration." }
        ]},
        { category: "Territory/Protection/Logs (Territory / Tianyan)", color: "text-green-600", commands: [
          { cmd: "/tty", desc: "Sets the area as your territory. (Requires prior coordinate memo)" },
          { cmd: "/tygui", desc: "Checks audit logs via GUI. Useful for identifying griefers." },
          { cmd: "/ty x y z <time> <radius>", desc: "Checks audit logs by searching via chat. (Advanced)" }
        ]},
        { category: "Economy/Communication (UMoney / Essentials)", color: "text-yellow-600", commands: [
          { cmd: "/um", desc: "Checks your current money balance." },
          { cmd: "/um → <send>", desc: "Sends money to the specified player." },
          { cmd: "/um → <ranking>", desc: "Checks the server-wide money ranking." },
          { cmd: "/msg <playername> <message>", desc: "Sends a private message (DM) to the specified player." },
          { cmd: "/ping", desc: "Checks server connection latency (Ping value)." },
          { cmd: "/notice", desc: "Checks announcements from the server." }
        ]},
        { category: "RolePlay (RolePlay)", color: "text-pink-600", commands: [
          { cmd: "/e <action>", desc: "Sends an action (emotion expression) to the chat. (e.g., /e happy)" }
        ]}
      ],
      admin_sections: [
        { category: "Server Management (Essentials / U_Backup)", commands: [
          { cmd: "/broadcast <message>", desc: "Sends a server-wide announcement." },
          { cmd: "/kick <playername> [reason]", desc: "Kicks a player." },
          { cmd: "/ban <playername> [reason]", desc: "Bans a player." },
          { cmd: "/unban <playername>", desc: "Unbans a player." },
          { cmd: "/gamemode <mode> [player]", desc: "Changes game mode." },
          { cmd: "/tp <target> [destination]", desc: "Forcefully teleports a player." },
          { cmd: "/backup", desc: "Creates a server data backup." }
        ]},
        { category: "Economy/Territory Management (UMoney / Territory)", commands: [
          { cmd: "/um → <admin>", desc: "Manages a player's money." },
          { cmd: "/optty set ...", desc: "Forcefully manages another player's territory." },
          { cmd: "/optty reload", desc: "Reloads the territory plugin configuration." }
        ]}
      ]
    },
    join: {
      title: "Server Participation Info",
      subtitle: "Use the information below to join from 'Add Server' in Minecraft Bedrock. Joining via Friend Request is also possible.",
      bedrock_tag: "Bedrock Edition",
      status_online: "Online",
      status_offline: "Offline",
      info_title: "Server Join Info",
      info_desc: "Use the info below to join via 'Add Server' in Minecraft Bedrock. Friend request method is also supported.",
      label_gamertag: "GamerTag (Friend Request)",
      label_ip: "IP Address",
      label_port: "Port Number",
      btn_discord: "Join Discord",
      btn_guide: "Detailed Connection Guide",
      img_alt_text: "Join Screen",
      img_overlay_text: "Your adventure begins now.",
      copy_success: "Copied to clipboard!"
    },
    guide: {
      title: "Beginner's Guide & FAQ",
      subtitle: "How to start server life and a summary of frequently asked questions.",
      steps_title: "Getting Started on the Server",
      steps: [
        { step: 1, title: "Move from Spawn Point", content: "You will arrive at the 'Spawn Point' upon joining. Read the signs, then move to a safe, uncrowded area. You can also use the `/warp` command to move to public facilities." },
        { step: 2, title: "Find Your Base Location", content: "Find a spot at least 5 blocks away from other players' bases and claim the land. It's polite to ask in chat, 'Is anyone nearby?'" },
        { step: 3, title: "Perform Land Protection (Important)", content: "To prevent griefing, be sure to protect your home. You can set it up with the command `/tty`. Don't forget to register your location with `/sethome`!" },
        { step: 4, title: "Join Discord", content: "Join the Discord community for interaction and support. It's also essential for checking the latest information." }
      ],
      faq_title: "Frequently Asked Questions (FAQ)",
      faq_data: [
        { q: "Q1: How does land protection work?", a: "A: Land protection is set with the `/tty` command. This automatically protects the specified coordinates. Other players cannot destroy or operate chests within the protected area." },
        { q: "Q2: What can money (currency) be used for?", a: "A: Currently, there is no use, but we may add functionality in the future." },
        { q: "Q3: Can I use teleportation commands like /tpa or /warp?", a: "A: Yes, they are available. Use `/tpa [playername]` to request, `/warp` to public facilities, and `/home` to your base." },
        { q: "Q4: What should I do if there is griefing?", a: "A: Secure evidence (screenshots or videos) and contact the administration via Discord or in-game. The administration will check logs and restore the damage with the rollback function." },
        { q: "Q5: When is the resource world reset?", a: "A: There is no resource world on this server." }
      ],
    },
    terms: {
      title: "Terms of Service",
      date: "Established: November 10, 2025",
      chapters: [
        { title: "Chapter 1 General Provisions", articles: [
          { title: "Article 1 (Application of These Terms)", content: "These Terms apply to all matters related to the use of all services provided by Nantetsu Server. Users are deemed to have agreed to these Terms by using the Service." },
          { title: "Article 2 (Definitions)", content: "A 'User' is an individual who uses the Service. 'Content' refers to data created and published by a User." }
        ]},
        { title: "Chapter 2 User Registration and Obligations", articles: [
          { title: "Article 3 (User Registration)", content: "Prospective users shall register to use the Service after agreeing to these Terms. Minors require parental consent." },
          { title: "Article 4 (Management of Account Information)", content: "Users are responsible for managing their account information, and transfer or lending to third parties is prohibited." }
        ]},
        { title: "Chapter 3 Prohibited Acts and Suspension of Use", articles: [
          { title: "Article 5 (Prohibited Acts)", content: "Violation of laws, infringement of rights, harassment, fraudulent account use, exploiting cheats/bugs, excessive server load, obstruction, and unauthorized commercial/religious activities are prohibited." },
          { title: "Article 6 (Suspension of Use)", content: "In case of violation, measures such as suspension of use (BAN), content deletion, and account deletion will be taken without prior notice." }
        ]},
        { title: "Chapter 4 Content and Intellectual Property Rights", articles: [
          { title: "Article 7 (Rights to Content)", content: "The copyright of content created by a User belongs to the User." },
          { title: "Article 8 (Use by Administration)", content: "Users grant the administration the right to use their content free of charge for promotional purposes." }
        ]},
        { title: "Chapter 5 Disclaimer", articles: [
          { title: "Article 9 (Disclaimer)", content: "The administration does not guarantee the completeness of the Service and is not responsible for damages caused by data loss or service suspension." },
          { title: "Article 10 (Indemnity)", content: "If a User causes damage due to a violation of the Terms, the User is obligated to compensate for that damage." }
        ]}
      ],
      signature: "Nantetsu Server Administration"
    },
    privacy: {
      title: "Privacy Policy",
      date: "Established: November 9, 2025",
      intro: "Nantetsu Server (hereinafter, 'The Server') recognizes the importance of the personal information of all players and establishes the following Privacy Policy to ensure its protection.",
      section1_title: "1. Information Acquired and Usage Purpose",
      subsection1_1_title: "1-1. In-Game Information",
      subsection1_1_info: "Information Acquired:",
      subsection1_1_purpose: "Usage Purpose:",
      subsection1_1_data: ["Minecraft ID, operation logs, chat logs, IP address."],
      subsection1_1_usage: ["Griefing countermeasures, service maintenance, handling term violations."],
      subsection1_2_title: "1-2. Inquiry Information",
      subsection1_2_data: ["Name, Discord Tag, Content."],
      subsection1_2_usage: ["Support response, identity verification."],
      section2_title: "2. Provision of Information to Third Parties",
      section2_content: "Except where required by law or in emergencies, personal information will not be provided to third parties without the player's consent.",
      section3_title: "3. Contact Point",
      section3_content: "Administration Contact:",
      email: "nantetu2@gmail.com"
    },
    rules_data: [
      {
        title: "Article 1: Prohibition of Griefing, Theft, and Cheating",
        content: [
          "Destruction, theft, or unauthorized use of other players' property (buildings, items in chests) is subject to a permanent BAN.",
          "The use of modified clients (other than texture packs), cheats, and BOTs is prohibited.",
          "Do not exploit bugs or glitches; report them to the administration immediately."
        ]
      },
      {
        title: "Article 2: Prohibition of Nuisance and Harassment",
        content: [
          "Discriminatory remarks, slander, and excessive harassment towards other players are prohibited.",
          "Acts that place an excessive load on the server (e.g., leaving clock circuits running) are prohibited.",
          "Other acts deemed uncomfortable by other players may be subject to penalties at the discretion of the administration."
        ]
      },
      {
        title: "Article 3: Rules regarding Buildings and Scenery",
        content: [
          "Buildings that significantly impair the scenery (e.g., 'tofu' buildings, giant pillars) may be requested to be improved.",
          "Start building at least 10 blocks away from areas where other players are settled.",
          "Buildings containing symbols or messages contrary to public order and morals are prohibited."
        ]
      }
    ],
    quiz_data: [
      { question: "【Art. 1】What happens if you destroy or steal another person's building without permission?", options: ["No problem if not found", "Admin will warn you", "Subject to Permanent BAN"], answer: "Subject to Permanent BAN" },
      { question: "【Art. 2】I made a discriminatory remark in-game. Is this allowed?", options: ["Allowed as it doesn't lag the server", "Prohibited as it causes discomfort to others", "Allowed if it's a private exchange"], answer: "Prohibited as it causes discomfort to others" },
      { question: "【Art. 3】What is the minimum distance you should keep from other players' bases?", options: ["10 blocks", "50 blocks", "100 blocks"], answer: "10 blocks" }
    ],
    footer: {
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      contact: "Contact Us",
      promotion: "Join our Discord for the latest news and community support!",
      promotion_link: "Join Discord",
      copy_success: "Copied to clipboard!",
      not_found_title: "Page Not Found 🚧",
      not_found_btn: "Return to Home",
      chat_title: "AI Assistant (Beta)",
      chat_subtitle: "Ask about server rules, commands, and how to play.",
      chat_input_placeholder: "Enter your question...",
      chat_send: "Send",
      chat_loading: "AI is thinking...",
      chat_error: "An error occurred. Please try again.",
      chat_clear: "Clear Conversation",
      search_placeholder: "Search site content...",
      search_results_title: "Search Results",
      search_no_results: (term) => `No results found matching "${term}".`,
      search_found: (count) => `${count} results found.`,
      search_category_news: "News",
      search_category_command: "Commands",
      search_category_guide: "FAQ/Guide",
      search_category_terms: "Terms of Service",
      search_category_privacy: "Privacy Policy",
      search_result_btn: "View Details",
    }
  }
};

// --- API Utility (for AI Chat) ---

/**
 * Executes an exponential backoff retry for fetching.
 * @param {function} fn The function that returns a Promise (the fetch operation).
 * @param {number} maxRetries Maximum number of retries.
 * @returns {Promise<Response>} The final successful Response object.
 */
const withExponentialBackoff = async (fn, maxRetries = 5) => {
  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

// pages/api/gemini.js (または app/api/gemini/route.js など、フレームワークによる)

const GEMINI_MODEL = "gemini-2.5-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=`;

// サーバーレス関数としてエクスポート
export default async function handler(req, res) {
  // 1. Vercelの環境変数からAPIキーを安全に取得
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured." });
  }
  
  // 2. クライアントからのリクエストボディを取得
  const { chatHistory, currentLang } = req.body;

  // 3. 元のロジック（fetchGeminiResponseの内容）をここに組み込む
  const systemInstruction = currentLang === 'ja' ? SYSTEM_INSTRUCTION_JA : SYSTEM_INSTRUCTION_EN;
  const contents = chatHistory.map(msg => ({ /* ... */ }));
  const payload = { 
    contents: contents, 
    tools: [{ "google_search": {} }], 
    systemInstruction: { parts: [{ text: systemInstruction }] } 
  };

  try {
    const response = await fetch(API_URL + apiKey, { // API_URL + apiKey を使用
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    // ... レスポンスの処理 ...
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      res.status(200).json({ text: text });
    } else {
      console.error("Gemini API Response Error:", result);
      res.status(500).json({ error: "Could not retrieve an answer." });
    }

  } catch (error) {
    console.error("API Processing Error:", error);
    res.status(500).json({ error: "A communication error occurred." });
  }
}

// 元の fetchGeminiResponse をクライアント側の関数として修正

const fetchGeminiResponse = async (chatHistory, currentLang) => {
  // APIキーの代わりに、VercelのAPI Route (例: /api/gemini) を呼び出す
  const API_ROUTE_URL = '/api/gemini'; 
  
  try {
    const response = await fetch(API_ROUTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // chatHistory と currentLang をリクエストボディに含める
      body: JSON.stringify({ chatHistory, currentLang })
    });

    const result = await response.json();
    
    if (response.ok && result.text) {
      return { text: result.text, error: null };
    } else {
      const errorMessage = result.error || (currentLang === 'ja' ? "回答を取得できませんでした。" : "Could not retrieve an answer.");
      return { text: null, error: errorMessage };
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return { text: null, error: currentLang === 'ja' ? "通信エラーが発生しました。" : "A communication error occurred." };
  }
};

// --- Components ---

const Toast = ({ message }) => (
  <div className="fixed bottom-5 right-5 bg-purple-800 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-up z-50 border border-purple-500/50">
    <CheckCircle size={20} className="text-green-400" />
    <span className="font-bold">{message}</span>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, colorClass, bgClass, onClick }) => (
  <div 
    onClick={onClick}
    className={`${bgClass} p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-purple-200 dark:border-gray-700 dark:hover:border-purple-500 ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${colorClass} bg-opacity-20`}>
      <Icon size={32} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const CopyBox = ({ label, value, onCopy }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono text-xl font-bold text-gray-800 dark:text-gray-100 select-all break-all">{value}</p>
    </div>
    <button 
      onClick={() => onCopy(value)}
      className="flex-shrink-0 flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800 px-4 py-2 rounded-lg transition-colors font-bold text-sm whitespace-nowrap"
    >
      <Copy size={16} />
      {LANGUAGES[App.currentLang].footer.copy_success ? 'コピー' : 'Copy'}
    </button>
  </div>
);

const AccordionItem = ({ title, content, isOpen, toggle }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl mb-4 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
    <button 
      onClick={toggle}
      className={`w-full flex items-center justify-between p-5 text-left font-bold text-lg transition-colors ${isOpen ? 'bg-purple-600 text-white' : 'text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
    >
      <span>{title}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
       <div className="p-5 bg-gray-50 dark:bg-gray-900/50">
          {Array.isArray(content) ? (
             <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
               {content.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1.5 flex-shrink-0">•</span>
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

const JoinSection = ({ L, serverStatus, handleCopy, navigate }) => (
  <section id="join" className="py-20 px-4 relative overflow-hidden animate-fade-in bg-white dark:bg-gray-900">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
         <h2 className="text-3xl font-black mb-4 dark:text-white"><Gamepad2 className="inline mr-2 mb-1"/>{L.join.title}</h2>
         <p className="text-gray-600 dark:text-gray-400">{L.join.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="grid lg:grid-cols-5">
          
          {/* Info Side */}
          <div className="lg:col-span-3 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-4 py-1 rounded-full text-sm font-bold">
                {L.join.bedrock_tag}
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                <span className={`w-2.5 h-2.5 rounded-full ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {serverStatus.online ? L.join.status_online : L.join.status_offline}
              </div>
            </div>

            <h2 className="text-3xl font-black mb-6 dark:text-white">{L.join.info_title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {L.join.info_desc}
            </p>

            <div className="space-y-6 mb-8">
              <CopyBox label={L.join.label_gamertag} value={L.server.tag} onCopy={handleCopy} />
              <div className="grid sm:grid-cols-2 gap-4">
                <CopyBox label={L.join.label_ip} value={L.server.ip} onCopy={handleCopy} />
                <CopyBox label={L.join.label_port} value={L.server.port} onCopy={handleCopy} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://discord.gg/your_server_invite" target="_blank" rel="noreferrer" className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/30">
                <MessageCircle size={20} />
                {L.join.btn_discord}
              </a>
              <button 
                onClick={() => navigate('guide')}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink size={20} />
                {L.join.btn_guide}
              </button>
            </div>
          </div>

          {/* Image Side */}
          <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-900 relative min-h-[300px] lg:min-h-0">
            <img 
              src="https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2070&auto=format&fit=crop" 
              alt={L.join.img_alt_text} 
              className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <p className="text-white font-bold text-xl drop-shadow-md">{L.join.img_overlay_text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);


// --- Page Content Components ---

const NotFoundPage = ({ L, onNavigateHome }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-8 rounded-full mb-8 animate-bounce-slow">
      <AlertTriangle size={64} className="text-yellow-500" />
    </div>
    <h2 className="text-5xl md:text-7xl font-black text-gray-800 dark:text-white mb-4 tracking-tight">404</h2>
    <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-6">{L.footer.not_found_title}</h3>
    <button onClick={onNavigateHome} className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1">
      <Home size={20} />
      {L.footer.not_found_btn}
    </button>
  </div>
);

const NewsPage = ({ L }) => (
  <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-black mb-4 dark:text-white"><Bell className="inline mr-2 mb-1"/>{L.news.title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{L.news.subtitle}</p>
    </div>
    <div className="space-y-6">
      {L.news.data.map((news) => (
        <div key={news.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-l-4 border-purple-500 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Clock size={16} />
            <span>{news.date}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${news.type === 'maintenance' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {news.type === 'maintenance' ? L.news.maintenance : L.news.info}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{news.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{news.content}</p>
        </div>
      ))}
    </div>
  </div>
);

const CommandsPage = ({ L }) => (
  <div className="max-w-5xl mx-auto py-20 px-4 animate-fade-in">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-black mb-4 dark:text-white"><Terminal className="inline mr-2 mb-1"/>{L.commands.title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{L.commands.subtitle}</p>
    </div>
    
    <div className="grid gap-12">
      {L.commands.sections.map((section, idx) => {
        const icons = [Gamepad2, Shield, DollarSign, Users];
        const Icon = icons[idx] || HelpCircle;

        return (
          <div key={idx} className="animate-fade-in-up" style={{animationDelay: `${idx * 100}ms`}}>
            <h3 className={`text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 ${section.color}`}>
              <Icon size={28} />
              {section.category}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {section.commands.map((cmd, cIdx) => (
                <div key={cIdx} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-500 transition-colors">
                  <code className="block bg-gray-100 dark:bg-gray-900 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-lg font-mono font-bold mb-2 w-fit text-sm">
                    {cmd.cmd}
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{cmd.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Admin Section */}
      <div className="mt-12 bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/30">
        <h3 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400 flex items-center gap-2">
          <Shield size={28} /> {L.commands.admin_title}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {L.commands.admin_sections.map((section, idx) => (
             <div key={idx}>
                <h4 className="font-bold text-red-500 mb-3 flex items-center gap-2"><Hammer size={18}/> {section.category}</h4>
                <div className="space-y-3">
                    {section.commands.map((cmd, cIdx) => (
                        <div key={cIdx} className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <code className="text-xs font-mono font-bold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-1 rounded">{cmd.cmd}</code>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{cmd.desc}</p>
                        </div>
                    ))}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TermsPage = ({ L }) => (
  <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in">
    <h2 className="text-3xl font-black mb-8 text-center dark:text-white"><FileText className="inline mr-2 mb-1"/>{L.terms.title}</h2>
    <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-10">
        <p className="text-center text-sm text-gray-500">{L.terms.date}</p>
        {L.terms.chapters.map((chapter, idx) => (
            <div key={idx}>
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-4 border-b border-purple-100 dark:border-purple-900/30 pb-2">{chapter.title}</h3>
                <div className="space-y-6">
                    {chapter.articles.map((article, aIdx) => (
                        <div key={aIdx}>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">{article.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pl-4 border-l-2 border-gray-200 dark:border-gray-700">{article.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        ))}
        <div className="text-right font-bold text-gray-800 dark:text-gray-200 pt-8">{L.terms.signature}</div>
    </div>
  </div>
);

const PrivacyPage = ({ L }) => (
  <div className="max-w-3xl mx-auto py-20 px-4 animate-fade-in">
    <h2 className="text-3xl font-black mb-8 text-center dark:text-white"><Lock className="inline mr-2 mb-1"/>{L.privacy.title}</h2>
    <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 leading-loose space-y-6">
        <p>{L.privacy.intro}</p>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">{L.privacy.section1_title}</h3>
        <div className="pl-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-r-lg">
            <h4 className="font-bold mb-2">{L.privacy.subsection1_1_title}</h4>
            <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                <li><strong>{L.privacy.subsection1_1_info}</strong> {L.privacy.subsection1_1_data[0]}</li>
                <li><strong>{L.privacy.subsection1_1_purpose}</strong> {L.privacy.subsection1_1_usage[0]}</li>
            </ul>
            <h4 className="font-bold mb-2">{L.privacy.subsection1_2_title}</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
                <li><strong>{L.privacy.subsection1_1_info}</strong> {L.privacy.subsection1_2_data[0]}</li>
                <li><strong>{L.privacy.subsection1_1_purpose}</strong> {L.privacy.subsection1_2_usage[0]}</li>
            </ul>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">{L.privacy.section2_title}</h3>
        <p>{L.privacy.section2_content}</p>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">{L.privacy.section3_title}</h3>
        <p>{L.privacy.section3_content} <a href={`mailto:${L.privacy.email}`} className="text-purple-600 hover:underline">{L.privacy.email}</a></p>

        <p className="text-right text-sm text-gray-500 mt-8">{L.privacy.date}</p>
    </div>
  </div>
);

const GuidePage = ({ L, activeAccordion, setActiveAccordion }) => (
  <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-black mb-4 dark:text-white"><BookOpen className="inline mr-2 mb-1"/>{L.guide.title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{L.guide.subtitle}</p>
    </div>

    {/* Steps */}
    <div className="space-y-8 mb-20">
        <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 border-b border-purple-200 dark:border-gray-700 pb-3 mb-8">
            🎉 {L.guide.steps_title}
        </h3>
        {L.guide.steps.map((item) => (
            <div key={item.step} className="flex gap-6 items-start bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-black shadow-lg shadow-purple-500/30">
                    {item.step}
                </div>
                <div>
                    <h4 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p>
                </div>
            </div>
        ))}
    </div>

    {/* FAQ */}
    <div>
        <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 border-b border-purple-200 dark:border-gray-700 pb-3 mb-8">
            ❓ {L.guide.faq_title}
        </h3>
        <div className="space-y-4">
            {L.guide.faq_data.map((faq, idx) => (
                <AccordionItem 
                    key={idx}
                    title={faq.q}
                    content={faq.a}
                    isOpen={activeAccordion === `faq-${idx}`}
                    toggle={() => setActiveAccordion(activeAccordion === `faq-${idx}` ? null : `faq-${idx}`)}
                />
            ))}
        </div>
    </div>
  </div>
);

const AIChat = ({ L, isChatOpen, closeChat }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  // Scroll to bottom on new message
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

  const handleClear = () => {
    setChatHistory([]);
  }

  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm flex items-end justify-end md:justify-center p-0 md:p-8 animate-fade-in">
      <div className={`bg-white dark:bg-gray-900 w-full md:max-w-md h-full md:h-[600px] flex flex-col rounded-t-2xl md:rounded-xl shadow-2xl transform transition-all duration-300 ease-out animate-slide-in-up`}>
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
            <Zap size={20} className="text-purple-500" />
            {L.footer.chat_title}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={handleClear} disabled={chatHistory.length === 0} className="p-2 text-sm text-gray-500 hover:text-red-500 disabled:opacity-50 transition-colors flex items-center">
              <Trash2 size={16} />
              <span className="ml-1 hidden sm:inline">{L.footer.chat_clear}</span>
            </button>
            <button onClick={closeChat} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div ref={chatRef} className="flex-grow p-4 overflow-y-auto space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center p-8 pt-16 text-gray-500 dark:text-gray-400">
              <MessageCircle size={36} className="mx-auto mb-3" />
              <p className="font-bold">{L.footer.chat_subtitle}</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : msg.isError
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 rounded-tl-none border border-red-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-3 rounded-xl shadow-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-tl-none flex items-center gap-2">
                <span className="animate-spin inline-block"><Zap size={16} /></span>
                {L.footer.chat_loading}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={L.footer.chat_input_placeholder}
              className="flex-grow px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl disabled:bg-purple-300 dark:disabled:bg-purple-800 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const SearchResultsPage = ({ L, searchTerm, searchResults, navigate }) => {
  if (!searchTerm) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <Search size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold dark:text-white">{L.footer.search_results_title}</h2>
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

  const handleResultClick = (path) => {
    // Determine the page and potentially a section based on path
    let page, section;
    if (path.startsWith('news')) page = 'news';
    else if (path.startsWith('commands')) page = 'commands';
    else if (path.startsWith('guide')) page = 'guide';
    else if (path.startsWith('terms')) page = 'terms';
    else if (path.startsWith('privacy')) page = 'privacy';
    
    // For guide/faq, we might want to open the accordion
    if (path.startsWith('guide-faq')) section = path;

    navigate(page, section);
  };


  return (
    <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in">
      <h2 className="text-3xl font-black mb-4 dark:text-white"><Search className="inline mr-2 mb-1"/>{L.footer.search_results_title}</h2>
      
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
        {resultCount > 0 
          ? L.footer.search_found(resultCount) 
          : L.footer.search_no_results(searchTerm)}
      </p>

      {resultCount > 0 && (
        <div className="space-y-8">
          {searchResults.map((category, index) => (
            category.results.length > 0 && (
              <div key={index}>
                <h3 className="text-2xl font-bold mb-4 border-b border-purple-300 dark:border-purple-800 pb-2 text-purple-700 dark:text-purple-400">
                  {categoryMap[category.category]}
                </h3>
                <div className="grid gap-4">
                  {category.results.map((result, rIdx) => (
                    <div 
                      key={rIdx} 
                      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold dark:text-white">{result.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{result.content}</p>
                      </div>
                      <button 
                        onClick={() => handleResultClick(result.path)}
                        className="flex-shrink-0 ml-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900 transition-colors"
                      >
                        {L.footer.search_result_btn}
                      </button>
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


const HomePage = ({ L, serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, scrollToSection, navigate, activeAccordion, setActiveAccordion }) => {
  const QUIZ_DATA = L.quiz_data;
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <header className="relative h-[600px] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1607016284345-c5478694085f?q=80&w=2070&auto=format&fit=crop" 
              alt="Minecraft Landscape" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/2070x600/1e293b/a8a8a8?text=Minecraft+Server"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg whitespace-pre-line">
            {L.home.hero_title.split('\n')[0]}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400">{L.home.hero_title.split('\n')[1]}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium whitespace-pre-line">
            {L.home.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => scrollToSection('join')}
              className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-lg font-black rounded-full shadow-lg hover:shadow-yellow-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Gamepad2 size={20} />
              {L.home.join_now}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-lg font-bold rounded-full transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle size={20} />
              {L.home.see_details}
            </button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black mb-6 border-l-8 border-purple-600 pl-4 dark:text-white">{L.home.what_is_nantetsu}</h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                <p>
                  <strong className="text-purple-600 dark:text-purple-400">{L.home.description_p1}</strong><br/>
                  {L.home.description_p2}
                </p>
                <p>
                  {L.home.description_p3}
                </p>
                <button onClick={() => navigate('news')} className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-2 mt-4">
                    <Bell size={18} /> {L.home.see_news}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "150+", label: L.home.stat_cumulative_players, icon: Users },
                { val: "70%", label: L.home.stat_retention_rate, icon: CheckCircle },
                { val: "99.9%", label: L.home.stat_uptime, icon: Server },
                { val: "15+", label: L.home.stat_max_online, icon: Users }
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-b-4 border-purple-500 flex flex-col items-center text-center">
                  <stat.icon className="text-purple-500 mb-2" size={28} />
                  <div className="text-3xl font-black text-gray-800 dark:text-white">{stat.val}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-purple-50 dark:bg-gray-800/30 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-purple-800 dark:text-purple-300 mb-12 inline-block relative">
            {L.home.stats_title}
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-yellow-400 rounded-full"></span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield} 
              title={L.home.feature_p1_title} 
              description={L.home.feature_p1_desc}
              bgClass="bg-orange-50 dark:bg-gray-800"
              colorClass="text-orange-500 bg-orange-500"
            />
            <FeatureCard 
              icon={Clock} 
              title={L.home.feature_p2_title} 
              description={L.home.feature_p2_desc}
              bgClass="bg-green-50 dark:bg-gray-800"
              colorClass="text-green-500 bg-green-500"
            />
            <FeatureCard 
              icon={MessageCircle} 
              title={L.home.feature_p3_title} 
              description={L.home.feature_p3_desc}
              bgClass="bg-indigo-50 dark:bg-gray-800"
              colorClass="text-indigo-500 bg-indigo-500"
            />
            <FeatureCard 
              icon={Terminal} 
              title={L.home.feature_p4_title} 
              description={L.home.feature_p4_desc}
              bgClass="bg-lime-50 dark:bg-gray-800"
              colorClass="text-lime-600 bg-lime-600"
              onClick={() => navigate('commands')}
            />
            <FeatureCard 
              icon={Server} 
              title={L.home.feature_p5_title} 
              description={L.home.feature_p5_desc}
              bgClass="bg-yellow-50 dark:bg-gray-800"
              colorClass="text-yellow-500 bg-yellow-500"
            />
            <FeatureCard 
              icon={BookOpen} 
              title={L.home.feature_p6_title} 
              description={L.home.feature_p6_desc}
              bgClass="bg-pink-50 dark:bg-gray-800"
              colorClass="text-pink-500 bg-pink-500"
              onClick={() => navigate('guide')}
            />
          </div>
        </div>
      </section>

      {/* Join Section (Integrated into Home) */}
      <JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} />

      {/* Rules & Quiz Section */}
      <section id="rules" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
              {/* Header */}
               <div className="text-center mb-12">
                 <h2 className="text-3xl font-black mb-4 dark:text-white">{L.home.rules_title}</h2>
                 <p className="text-gray-600 dark:text-gray-400">{L.home.rules_subtitle}</p>
               </div>
               
               {/* Accordion Rules */}
               <div className="mb-16">
                 {L.rules_data.map((rule, idx) => (
                    <AccordionItem 
                        key={idx}
                        title={rule.title}
                        content={rule.content}
                        isOpen={activeAccordion === `rules-${idx}`}
                        toggle={() => setActiveAccordion(activeAccordion === `rules-${idx}` ? null : `rules-${idx}`)}
                    />
                ))}
               </div>

               {/* Quiz Area */}
               <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-purple-100 dark:border-gray-700 relative overflow-hidden text-center">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>

                {!quizState.started ? (
                    <div className="animate-fade-in">
                        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HelpCircle size={40} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 dark:text-white">{L.home.quiz_title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">{L.home.quiz_subtitle}</p>
                        <button 
                            onClick={() => setQuizState({ ...quizState, started: true })}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-all transform hover:scale-105"
                        >
                            {L.home.quiz_start}
                        </button>
                    </div>
                ) : quizState.finished ? (
                    <div className="animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 dark:text-white">{L.home.quiz_done}</h3>
                        <p className="text-xl mb-6 dark:text-gray-300">
                            {L.home.quiz_score(quizState.score, QUIZ_DATA.length)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            {quizState.score === QUIZ_DATA.length 
                                ? L.home.quiz_result_perfect
                                : L.home.quiz_result_retry}
                        </p>
                        <div className="flex justify-center gap-4">
                             <button onClick={resetQuiz} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg font-bold transition-colors">
                                {L.home.quiz_retry}
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-left animate-fade-in">
                         <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-purple-600 dark:text-purple-400">Q{quizState.current + 1}</span>
                            <span className="text-sm text-gray-400">{quizState.current + 1} / {QUIZ_DATA.length}</span>
                        </div>
                        <h4 className="text-xl font-bold mb-8 dark:text-white min-h-[3.5rem]">{QUIZ_DATA[quizState.current].question}</h4>
                        <div className="space-y-3">
                            {QUIZ_DATA[quizState.current].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !quizState.showResult && handleQuizAnswer(opt)}
                                    disabled={quizState.showResult}
                                    className={`w-full p-4 rounded-xl text-left font-bold border-2 transition-all ${
                                        quizState.showResult
                                            ? opt === QUIZ_DATA[quizState.current].answer
                                                ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                : opt === QUIZ_DATA[quizState.current].options.find(o => o !== QUIZ_DATA[quizState.current].answer && quizState.isCorrect === false) 
                                                    ? "bg-red-50 border-red-200 opacity-50 dark:bg-red-900/20 dark:border-red-800" // Selected wrong
                                                    : "bg-white border-gray-200 opacity-50 dark:bg-gray-700 dark:border-gray-600"
                                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        {opt}
                                        {quizState.showResult && opt === QUIZ_DATA[quizState.current].answer && (
                                            <CheckCircle size={20} className="text-green-600" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                         {quizState.showResult && (
                            <div className={`mt-4 text-center font-bold ${quizState.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                {quizState.isCorrect ? L.home.quiz_correct : L.home.quiz_incorrect}
                            </div>
                        )}
                    </div>
                )}
               </div>
          </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-black mb-8 text-center dark:text-white">{L.home.contact_title}</h2>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <form className="space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    // Custom non-alert message for submission
                    alert(L.currentLang === 'ja' ? "デモ用フォームです。実際には送信されません。" : "This is a demo form. No actual submission.");
                }}>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_name}</label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" placeholder={L.home.contact_placeholder_name} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_email}</label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" placeholder={L.home.contact_placeholder_email} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_message}</label>
                        <textarea rows="5" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" placeholder={L.home.contact_placeholder_msg} required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                        <Send size={18} />
                        {L.home.contact_send}
                    </button>
                </form>
            </div>
        </div>
      </section>
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

  // Provide L (Language pack) via context or prop drilling, here we use simple object access
  const L = LANGUAGES[currentLang];
  // Attach currentLang to the App function/object for use in utility components like CopyBox/AIChat
  App.currentLang = currentLang;

  // Theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Server Status Fetcher
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/bedrock/2/${L.server.ip}:${L.server.port}`);
        const data = await res.json();
        setServerStatus({
          online: data.online,
          players: data.players ? data.players.online : 0,
          loading: false
        });
      } catch (e) {
        setServerStatus({ online: false, players: 0, loading: false });
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [L.server.ip, L.server.port]);

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
        setQuizState(prev => ({
          ...prev,
          current: prev.current + 1,
          score: isCorrect ? prev.score + 1 : prev.score,
          showResult: false,
          isCorrect: null
        }));
      } else {
        setQuizState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          finished: true,
          showResult: false
        }));
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null });
  };

  const navigate = (target, sectionId = null) => {
    setPage(target);
    setIsMenuOpen(false);
    setActiveAccordion(null); // Close accordions on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (sectionId) {
        // Handle specific section scrolls (e.g., from search results)
        if (target === 'guide' && sectionId.startsWith('guide-faq')) {
            // Open the specific FAQ item
            setTimeout(() => {
               setActiveAccordion(sectionId.split('-').slice(1).join('-'));
            }, 100);
        } else if (target === 'home') {
             setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
             }, 100);
        }
    }
  };

  const searchContent = useCallback((term) => {
    if (!term) return [];
    const lowerTerm = term.toLowerCase();
    const results = [];

    // 1. News
    const newsResults = L.news.data
      .filter(n => n.title.toLowerCase().includes(lowerTerm) || n.content.toLowerCase().includes(lowerTerm))
      .map(n => ({ title: n.title, content: n.content, path: `news-${n.id}` }));
    if (newsResults.length > 0) results.push({ category: 'news', results: newsResults });

    // 2. Commands
    const commandResults = L.commands.sections.flatMap(sec => 
      sec.commands.filter(cmd => cmd.cmd.toLowerCase().includes(lowerTerm) || cmd.desc.toLowerCase().includes(lowerTerm))
                   .map(cmd => ({ title: cmd.cmd, content: cmd.desc, path: `commands` }))
    );
    if (commandResults.length > 0) results.push({ category: 'command', results: commandResults });

    // 3. Guide/FAQ
    const guideResults = L.guide.faq_data.flatMap((faq, idx) => {
        if (faq.q.toLowerCase().includes(lowerTerm) || faq.a.toLowerCase().includes(lowerTerm)) {
             return [{ title: faq.q, content: faq.a, path: `guide-faq-${idx}` }];
        }
        return [];
    });
    if (guideResults.length > 0) results.push({ category: 'guide', results: guideResults });

    // 4. Terms
    const termsResults = L.terms.chapters.flatMap(chapter => 
        chapter.articles.filter(art => art.title.toLowerCase().includes(lowerTerm) || art.content.toLowerCase().includes(lowerTerm))
                        .map(art => ({ title: `${chapter.title} - ${art.title}`, content: art.content, path: `terms` }))
    );
    if (termsResults.length > 0) results.push({ category: 'terms', results: termsResults });

    // 5. Privacy
    const privacyContent = [
      { title: L.privacy.section1_title, content: L.privacy.subsection1_1_data[0] + L.privacy.subsection1_1_usage[0] },
      { title: L.privacy.section2_title, content: L.privacy.section2_content }
    ];
    const privacyResults = privacyContent.filter(p => p.title.toLowerCase().includes(lowerTerm) || p.content.toLowerCase().includes(lowerTerm))
                                         .map(p => ({ title: p.title, content: p.content, path: `privacy` }));
    if (privacyResults.length > 0) results.push({ category: 'privacy', results: privacyResults });


    return results;
  }, [L]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      setSearchResults(searchContent(term));
      setPage('search');
    } else {
      setSearchResults([]);
      if(page === 'search') setPage('home'); // Go back to home if search term is cleared
    }
  };

  const renderPage = () => {
      switch (page) {
          case 'home': return <HomePage L={L} {...{serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, navigate, activeAccordion, setActiveAccordion, scrollToSection: (id) => navigate('home', id)}} showToast={showToast} />;
          case 'news': return <NewsPage L={L} />;
          case 'commands': return <CommandsPage L={L} />;
          // case 'join': return <JoinPage L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} />; // Integrated into Home
          case 'guide': return <GuidePage L={L} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} />;
          case 'terms': return <TermsPage L={L} />;
          case 'privacy': return <PrivacyPage L={L} />;
          case 'search': return <SearchResultsPage L={L} searchTerm={searchTerm} searchResults={searchResults} navigate={navigate} />;
          default: return <NotFoundPage L={L} onNavigateHome={() => navigate('home')} />;
      }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#f8f9fa] text-gray-900'} font-sans`}>
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('home')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
              <span className="font-black text-xl tracking-tight text-purple-700 dark:text-purple-400">なんてつサーバー</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('home')} className={`text-sm font-bold transition-colors ${page === 'home' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'}`}>{L.nav.home}</button>
              <button onClick={() => navigate('home', 'join')} className={`text-sm font-bold transition-colors text-gray-600 dark:text-gray-300 hover:text-purple-600`}>{L.nav.join}</button>
              <button onClick={() => navigate('guide')} className={`text-sm font-bold transition-colors ${page === 'guide' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'}`}>{L.nav.guide}</button>
              <button onClick={() => navigate('commands')} className={`text-sm font-bold transition-colors ${page === 'commands' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'}`}>{L.nav.commands}</button>
              <button onClick={() => navigate('news')} className={`text-sm font-bold transition-colors ${page === 'news' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'}`}>{L.nav.news}</button>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={L.footer.search_placeholder}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9 pr-3 py-1.5 w-40 rounded-full text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-purple-500 transition-all dark:text-white"
                />
              </div>

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

              {/* Language Toggle */}
              <button 
                  onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} 
                  className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
              >
                  {currentLang === 'ja' ? 'EN' : 'JP'}
              </button>

              {/* Live Status */}
              <div className="flex items-center gap-2 text-xs font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                <span className={`w-2 h-2 rounded-full animate-pulse ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {serverStatus.loading ? L.status.loading : (serverStatus.online ? L.status.online(serverStatus.players) : L.status.offline)}
              </div>

              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-yellow-400 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="text-gray-600 dark:text-yellow-400">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 dark:text-white">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-fade-in">
            <div className="px-4 pt-2 pb-4 space-y-1">
               <div className="relative mb-4">
                 <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder={L.footer.search_placeholder}
                   value={searchTerm}
                   onChange={handleSearch}
                   className="pl-9 pr-3 py-2 w-full rounded-lg text-base bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-purple-500 transition-all dark:text-white"
                 />
               </div>
               <button onClick={() => navigate('home')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-md">{L.nav.home}</button>
               <button onClick={() => navigate('home', 'join')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-md">{L.nav.join}</button>
               <button onClick={() => navigate('guide')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-md">{L.nav.guide}</button>
               <button onClick={() => navigate('commands')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-md">{L.nav.commands}</button>
               <button onClick={() => navigate('news')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-md">{L.nav.news}</button>
               <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-md">
                   <span className="font-bold">🌐 {currentLang === 'ja' ? 'English' : '日本語'}</span>
               </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
          {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
            {/* Promotion Section */}
            <div className="mb-8 bg-purple-800 rounded-xl p-6 shadow-xl max-w-lg mx-auto">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                    <ExternalLink size={20} className="text-yellow-300" />
                    {L.footer.promotion}
                </h3>
                <a 
                    href="https://discord.gg/your_server_invite" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors mt-2"
                >
                    <Users size={18} />
                    {L.footer.promotion_link}
                </a>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 mb-8 text-sm font-medium">
                <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">{L.footer.terms}</button>
                <button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">{L.footer.privacy}</button>
                <button onClick={() => navigate('home', 'contact')} className="hover:text-white transition-colors">{L.footer.contact}</button>
            </div>
            <p className="text-sm">
                &copy; 2025 Nantetsu Server. All rights reserved.<br/>
                Not affiliated with Mojang AB.
            </p>
        </div>
      </footer>

      {/* Floating AI Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
            <MessageCircle size={28} />
        </button>
      </div>
      
      {/* AI Chat Modal/Sidebar */}
      <AIChat L={L} isChatOpen={isChatOpen} closeChat={() => setIsChatOpen(false)} />

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} />}

    </div>
  );
}