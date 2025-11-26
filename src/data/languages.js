// 言語データと設定をここにまとめます
import {
  Menu, X, Moon, Sun, Copy, CheckCircle, AlertTriangle, 
  Server, Users, Shield, Clock, MessageCircle, MapPin, 
  HelpCircle, ChevronDown, ChevronUp, Gamepad2, Terminal,
  Send, ExternalLink, Home, FileText, List, Bell, BookOpen,
  User, DollarSign, Theater, Lock, Hammer, AlertCircle, Search, Trash2, Zap, Sparkles, ArrowRight, Loader2, Map, Info,
  Youtube, Twitter, MessageSquare
} from 'lucide-react';

// --- Configuration ---
export const SPREADSHEET_ID = '1v-AIHan-UcPqSOJoG2mtNKI8ZvkL-UJV9JbewnoUXdU';
export const SHEET_GID = '566365801'; 
export const NEWS_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
export const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1437085348210675712/3kPCM9gKqGYjg6CTBU7EuNjcYZDVkpcQSdmBtwa4g2fE7dg5_tTriW7p_g_HSo409DYL"; 

export const LANGUAGES = {
    ja: {
        lang_code: "ja",
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
      forum: "フォーラム",
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
      fetch_error: "お知らせの読み込みに失敗しました。",
      link_text: "リンクを開く",
      default_data: [
        { id: 1, date: "2025.11.10", title: "サーバー稼働安定化のお知らせ", content: "サーバーのメモリ割り当てを調整し、多人数接続時のラグを解消しました。", type: "maintenance" },
        { id: 2, date: "2025.09.01", title: "なんてつサーバー 正式オープン！", content: "統合版サバイバルサーバー「なんてつサーバー」がついにオープンしました！皆様の参加をお待ちしています。", type: "info" },
        { id: 3, date: "2025.08.25", title: "ベータテスト終了のお知らせ", content: "多くのご協力をいただきありがとうございました。正式リリースに向けて最終調整を行います。", type: "info" }
      ],
    },
    forum: {
        title: "コミュニティフォーラム",
        subtitle: "ログイン不要で誰でも参加できる交流の場です。",
        input_name: "お名前 (任意)",
        input_message: "メッセージを入力...",
        send: "投稿する",
        sending: "送信中...",
        empty_error: "メッセージを入力してください。",
        no_posts: "まだ投稿がありません。最初の投稿をしてみましょう！",
        anonymous: "名無しさん"
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
      admin_sections: []
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
      { question: "【第3条】他のプレイヤーの拠点に近い場合、最低何ブロック離れるべきですか？", options: ["5ブロック", "10ブロック", "20ブロック"], answer: "5ブロック" }
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
      not_found_desc: "お探しのページは存在しないか、移動した可能性があります。",
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
        lang_code: "en",
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
      forum: "Forum",
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
      what_is_nantetsu: "What is the Nantetu Server?",
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
      fetch_error: "Failed to load news.",
      link_text: "Open Link",
      default_data: [
        { id: 1, date: "2025", title: "Not Support", content: "English announcements are not supported.", type: "info" },
      ],
    },
    forum: {
        title: "Community Forum",
        subtitle: "A place for everyone to chat without login.",
        input_name: "Name (Optional)",
        input_message: "Type your message...",
        send: "Post",
        sending: "Sending...",
        empty_error: "Please enter a message.",
        no_posts: "No posts yet. Be the first to post!",
        anonymous: "Anonymous"
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
      admin_sections: []
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
    },
    terms: {
      title: "Terms of Service",
      date: "Effective Date: Nov 10, 2025",
      chapters: [
         { title: "General", articles: [{title: "Scope", content: "Terms apply to all services."}] }
      ],
      signature: "Nantetu Admin"
    },
    privacy: {
       title: "Privacy Policy",
       date: "Nov 9, 2025",
       intro: "Privacy policy introduction.",
       section1_title: "1. Info Collection",
       subsection1_1_title: "Game Data",
       subsection1_1_info: "Info:",
       subsection1_1_purpose: "Purpose:",
       subsection1_1_data: ["Logs"],
       subsection1_1_usage: ["Safety"],
       section2_title: "Third Party",
       section2_content: "We do not share info.",
       section3_title: "Contact",
       section3_content: "Contact us at:",
       email: "nantetu2@gmail.com"
    },
    rules_data: [],
    quiz_data: [
      { question: "Sample", options: ["A","B"], answer: "A" }
    ],
    footer: {
      terms: "Terms",
      privacy: "Privacy",
      contact: "Contact",
      sitemap: "Sitemap",
      promotion: "Join Discord!",
      promotion_link: "Join Discord",
      copy_success: "Copied!",
      not_found_title: "Page Not Found",
      not_found_desc: "The page does not exist.",
      not_found_btn: "Back to Home",
      chat_title: "AI Assistant",
      chat_subtitle: "Ask about rules and commands.",
      chat_input_placeholder: "Type a question...",
      chat_send: "Send",
      chat_loading: "Thinking...",
      chat_error: "Error.",
      chat_clear: "Clear",
      search_placeholder: "Search...",
      search_results_title: "Search Results",
      search_no_results: (term) => `No results for "${term}"`,
      search_found: (count) => `${count} results found.`,
      search_category_news: "News",
      search_category_command: "Command",
      search_category_guide: "Guide",
      search_category_terms: "Terms",
      search_category_privacy: "Privacy",
      search_result_btn: "View",
    }
  }
};