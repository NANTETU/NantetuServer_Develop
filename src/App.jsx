import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Menu, X, Moon, Sun, Copy, CheckCircle, AlertTriangle,
    Server, Users, Shield, Clock, MessageCircle, MapPin,
    HelpCircle, ChevronDown, ChevronUp, Gamepad2, Terminal,
    Send, ExternalLink, Home, FileText, List, Bell, BookOpen,
    User, DollarSign, Theater, Lock, Hammer, AlertCircle, Search, Trash2, Zap, Sparkles, ArrowRight, Loader2, Map, Info,
    Youtube, Twitter, MessageSquare, Clipboard, ClipboardCheck
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken, getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

// ==========================================
// 1. Configuration & Data (languages.js)
// ==========================================

const SPREADSHEET_ID = '1v-AIHan-UcPqSOJoG2mtNKI8ZvkL-UJV9JbewnoUXdU';
const SHEET_GID = '566365801';
const NEWS_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1437085348210675712/3kPCM9gKqGYjg6CTBU7EuNjcYZDVkpcQSdmBtwa4g2fE7dg5_tTriW1p_g_HSo409DYL";

const LANGUAGES = {
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
            latest_news_title: "最新のお知らせ",
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
                {
                    category: "移動・テレポート系 (Essentials)", color: "text-purple-600", commands: [
                        { cmd: "/tpa <プレイヤー名>", desc: "指定したプレイヤーにテレポートをリクエストします。" },
                        { cmd: "/tpaccept", desc: "/tpa のリクエストを承認します。" },
                        { cmd: "/tpdeny", desc: "/tpa のリクエストを拒否します。" },
                        { cmd: "/back", desc: "最後にテレポートした場所、または死んだ場所に戻ります。" },
                        { cmd: "/sethome", desc: "現在地をホームポイントとして設定します。" },
                        { cmd: "/home", desc: "設定したホームにテレポートします。" },
                        { cmd: "/spawn", desc: "サーバーの初期スポーン地点に戻ります。" },
                        { cmd: "/warp", desc: "運営が設定した公共施設へ移動します。" }
                    ]
                },
                {
                    category: "領地・保護・ログ系 (Territory / Tianyan)", color: "text-green-600", commands: [
                        { cmd: "/tty", desc: "自分の領地として設定します。(事前に範囲座標のメモが必要)" },
                        { cmd: "/tygui", desc: "監査ログをGUIで確認します。荒らし特定に便利です。" },
                        { cmd: "/ty x y z <時間> <半径>", desc: "チャットで検索し監査ログを確認します。（上級者向け）" }
                    ]
                },
                {
                    category: "経済・コミュニケーション (UMoney / Essentials)", color: "text-yellow-600", commands: [
                        { cmd: "/um", desc: "自分の所持金（マネー）を確認します。" },
                        { cmd: "/um → <送金>", desc: "指定したプレイヤーにお金を送金します。" },
                        { cmd: "/um → <ランキング>", desc: "所持金のサーバー内ランキングを確認します。" },
                        { cmd: "/msg <プレイヤー名> <内容>", desc: "指定したプレイヤーに個人メッセージ（DM）を送ります。" },
                        { cmd: "/ping", desc: "サーバーとの接続遅延(Ping値)を確認します。" },
                        { cmd: "/notice", desc: "サーバーからのお知らせを確認します。" }
                    ]
                },
                {
                    category: "ロールプレイ系 (RolePlay)", color: "text-pink-600", commands: [
                        { cmd: "/e <アクション>", desc: "チャットにアクション（感情表現）を送信します。（例: /e happy）" }
                    ]
                }
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
            copy_success: "コピーしました！",
            copy_action: "コピー"
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
                {
                    title: "第1章 総則", articles: [
                        { title: "第1条 (本規約の適用)", content: "本規約は、なんてつサーバーが提供するすべてのサービスの利用に関わる一切の事項に適用されます。ユーザーは本サービスの利用をもって本規約に同意したものとみなされます。" },
                        { title: "第2条 (定義)", content: "「ユーザー」とは本サービスを利用する個人、「コンテンツ」とはユーザーが作成・公開したデータを指します。" }
                    ]
                },
                {
                    title: "第2章 利用登録とユーザーの義務", articles: [
                        { title: "第3条 (利用登録)", content: "利用希望者は本規約に同意の上で利用登録を行うものとします。未成年者は保護者の同意が必要です。" },
                        { title: "第4条 (アカウント情報の管理)", content: "アカウント情報は自己責任で管理し、第三者への譲渡・貸与は禁止します。" }
                    ]
                },
                {
                    title: "第3章 禁止事項と利用停止", articles: [
                        { title: "第5条 (禁止事項)", content: "法令違反、権利侵害、ハラスメント、不正アカウント利用、チート・バグ悪用、サーバーへの過度な負荷、妨害行為、無許可の商業・宗教活動等は禁止です。" },
                        { title: "第6条 (利用停止)", content: "違反時は事前の通知なく、利用停止（BAN）、コンテンツ削除、アカウント削除等の措置を講じます。" }
                    ]
                },
                {
                    title: "第4章 コンテンツと知的財産権", articles: [
                        { title: "第7条 (コンテンツの権利)", content: "ユーザーが作成したコンテンツの著作権はユーザー本人に帰属します。" },
                        { title: "第8条 (運営による利用)", content: "ユーザーは運営に対し、プロモーション等のためにコンテンツを無償で利用する権利を許諾するものとします。" }
                    ]
                },
                {
                    title: "第5章 免責事項", articles: [
                        { title: "第9条 (免責事項)", content: "運営はサービスの完全性を保証せず、データ消失や停止による損害について責任を負いません。" },
                        { title: "第10条 (損害賠償)", content: "規約違反により損害を与えた場合、ユーザーはその損害を賠償する義務を負います。" }
                    ]
                }
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
            copy_success: "コピーしました！",
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
            online: (players) => `${players} players currently online`,
            offline: "Offline",
        },
        home: {
            hero_title: "More than just “casual.”\nTruly dependable quality everyone can enjoy.",
            hero_subtitle: "Complete with anti-griefing and high-performance plugins.\nStart your unique survival life in a stable server environment.",
            join_now: "Join Now",
            see_details: "View Details",
            what_is_nantetsu: "What is the Nantetu Server?",
            description_p1: "A Bedrock server that goes beyond the limits of Bedrock Edition.",
            description_p2: "A community survival server, leveraging Java-like functionality and high quality as its greatest strength.",
            description_p3: "A robust monitoring and protection system powered by custom plugins. Prevents cheating and griefing, allowing you to enjoy free building in a safe and secure environment.",
            description_p4: "Beginners are very welcome! You can ask questions and interact with others anytime in our Discord community.",
            see_news: "View Latest News",
            latest_news_title: "Latest News",
            stats_title: "Server Features and Highlights",
            stat_cumulative_players: "Total Players Joined",
            stat_retention_rate: "High Retention Rate",
            stat_uptime: "Uptime Rate",
            stat_max_online: "Maximum Concurrent Players",
            feature_p1_title: "Perfect Land Protection",
            feature_p1_desc: "Completely protect your builds with a single command. Provides top-tier security against griefing, the strongest class for Bedrock Edition.",
            feature_p2_title: "Thorough Audit Logs",
            feature_p2_desc: "A complete log of all player actions is maintained. In case of any trouble, staff can track the logs and immediately roll back (restore) the damage.",
            feature_p3_title: "Discord Integration",
            feature_p3_desc: "In-game chat is linked with Discord. Communicate with your friends from your phone even when you are logged out.",
            feature_p4_title: "Convenient Commands",
            feature_p4_desc: "Includes convenient functions like /tpa and /home. Click here to check the full command list.",
            feature_p5_title: "Ultra-Low Latency",
            feature_p5_desc: "A high-spec environment ensures a stress-free experience. Both survival and building run smoothly.",
            feature_p6_title: "Beginner Friendly",
            feature_p6_desc: "A welcoming community where even first-time multiplayer players can join with peace of mind.",
            rules_title: "Server Rules",
            rules_subtitle: "The minimum set of agreements necessary for everyone to have fun.",
            quiz_title: "Rules Confirmation Quiz",
            quiz_subtitle: "Challenge yourself with 3 simple questions to confirm your understanding of the rules. Aim for a perfect score!",
            quiz_start: "Start Quiz",
            quiz_done: "Well done!",
            quiz_score: (score, total) => `Your Score: ${score} / ${total}`,
            quiz_result_perfect: "Perfect! You are ready to join the server with confidence.",
            quiz_result_retry: "Please review the rules once more and strive for safe gameplay.",
            quiz_retry: "Try Again",
            quiz_correct: "Correct!",
            quiz_incorrect: "Incorrect...",
            contact_title: "Contact Us",
            contact_name: "Name (Minecraft ID)",
            contact_email: "Contact Information (Discord / Email)",
            contact_message: "Message",
            contact_placeholder_name: "Steve",
            contact_placeholder_email: "name#1234",
            contact_placeholder_msg: "Please enter the details of your inquiry...",
            contact_send: "Send",
        },
        news: {
            title: "News & Announcements",
            subtitle: "The latest server updates and maintenance information.",
            maintenance: "Maintenance",
            info: "Information",
            fetch_error: "Failed to load announcements.",
            link_text: "Open Link",
            default_data: [
                { id: 1, date: "2025.11.10", title: "Server Stability Improvement Announcement", content: "Adjusted server memory allocation to resolve lag during high player counts.", type: "maintenance" },
                { id: 2, date: "2025.09.01", title: "Nantetu Server Official Opening!", content: "The Bedrock survival server 'Nantetu Server' is finally open! We look forward to your participation.", type: "info" },
                { id: 3, date: "2025.08.25", title: "End of Beta Test Announcement", content: "Thank you for your extensive cooperation. We will proceed with final adjustments for the official release.", type: "info" }
            ],
        },
        forum: {
            title: "Community Forum",
            subtitle: "A place for interaction where anyone can participate without needing to log in.",
            input_name: "Name (Optional)",
            input_message: "Enter your message...",
            send: "Post",
            sending: "Sending...",
            empty_error: "Please enter a message.",
            no_posts: "No posts yet. Be the first to post!",
            anonymous: "Anonymous User"
        },
        commands: {
            title: "Command List",
            subtitle: "A collection of commands to make your server life more convenient.",
            admin_title: "Admin Commands (Reference)",
            sections: [
                {
                    category: "Movement / Teleport (Essentials)",
                    color: "text-purple-600",
                    commands: [
                        { cmd: "/tpa <player>", desc: "Send a teleport request to the specified player." },
                        { cmd: "/tpaccept", desc: "Accept a /tpa request." },
                        { cmd: "/tpdeny", desc: "Deny a /tpa request." },
                        { cmd: "/back", desc: "Return to your last teleport location or death point." },
                        { cmd: "/sethome", desc: "Set your current location as your home point." },
                        { cmd: "/home", desc: "Teleport to your set home point." },
                        { cmd: "/spawn", desc: "Return to the server's initial spawn point." },
                        { cmd: "/warp", desc: "Teleport to public facilities set by the staff." }
                    ]
                },
                {
                    category: "Land Protection & Logs (Territory / Tianyan)",
                    color: "text-green-600",
                    commands: [
                        { cmd: "/tty", desc: "Set your land claim. (Requires memorizing the boundary coordinates in advance)" },
                        { cmd: "/tygui", desc: "View audit logs in a GUI. Useful for identifying griefers." },
                        { cmd: "/ty x y z <time> <radius>", desc: "Search and confirm audit logs via chat. (For advanced users only)" }
                    ]
                },
                {
                    category: "Economy & Communication (UMoney / Essentials)",
                    color: "text-yellow-600",
                    commands: [
                        { cmd: "/um", desc: "Check your current money balance." },
                        { cmd: "/um → <send>", desc: "Send money to the specified player." },
                        { cmd: "/um → <ranking>", desc: "View the server-wide ranking of money balances." },
                        { cmd: "/msg <player> <message>", desc: "Send a private message (DM) to the specified player." },
                        { cmd: "/ping", desc: "Check your connection latency (Ping value) with the server." },
                        { cmd: "/notice", desc: "View server announcements." }
                    ]
                },
                {
                    category: "Roleplay (RolePlay)",
                    color: "text-pink-600",
                    commands: [
                        { cmd: "/e <action>", desc: "Send an action (emote) to the chat. (Example: /e happy)" }
                    ]
                }
            ],
            admin_sections: []
        },
        join: {
            title: "Server Joining Information",
            subtitle: "Use the information below to join through the Bedrock Edition 'Add Server' menu. Joining via friend request is also possible.",
            bedrock_tag: "Bedrock Edition",
            status_online: "Online",
            status_offline: "Offline",
            info_title: "Server Join Information",
            info_desc: "Use the following details to join via Bedrock's “Add Server.” Alternatively, you may join via friend request.",
            label_gamertag: "Gamertag (for Friend Request)",
            label_ip: "IP Address",
            label_port: "Port Number",
            btn_discord: "Join Discord",
            btn_guide: "Detailed Connection Procedure",
            img_alt_text: "Join Screen",
            img_overlay_text: "Now, the adventure begins.",
            copy_success: "Copied!",
            copy_action: "Copy"
        },
        guide: {
            title: "Beginner Guide & FAQ",
            subtitle: "How to start your server life and a summary of frequently asked questions.",
            steps_title: "How to Start Your Server Life",
            steps: [
                { step: 1, title: "Move Away From Spawn", content: "When you join the server, you will arrive at the 'Spawn Point.' After reading the signs, move to a safe, uncrowded area. You can also use the `/warp` command to move to public facilities." },
                { step: 2, title: "Find Your Base Location", content: "Find a spot at least 5 blocks away from other players' bases and claim it as your land. It's polite to ask in chat, 'Is anyone nearby?'" },
                { step: 3, title: "Protect Your Land (Important)", content: "To prevent griefing, be sure to protect your house. You can set the protection using the command `/tty`. After setting, don't forget to register your location with `/sethome`!" },
                { step: 4, title: "Join Discord", content: "Join the Discord community to interact with others and receive support. It is also essential for checking the latest information." }
            ],
            faq_title: "Frequently Asked Questions (FAQ)",
            faq_data: [
                { q: "Q1: How does land protection work?", a: "A: Land protection is set using the `/tty` command. This automatically protects the specified coordinates. Other players cannot destroy or operate chests within the protected area." },
                { q: "Q2: What can I use money (currency) for?", a: "A: Currently, there is no use for it, but functionality may be added in the future." },
                { q: "Q3: Can I use teleport commands like /tpa and /warp?", a: "A: Yes, they are available. Use `/tpa [player name]` to request teleport, `/warp` for public facilities, and `/home` to return to your base." },
                { q: "Q4: What should I do if a griefing incident occurs?", a: "A: Secure evidence (screenshots or videos) and contact the staff via Discord or in-game. The staff will check the logs and repair the damage using the rollback function." },
                { q: "Q5: When will the resource world be reset?", a: "A: This server does not have a separate resource world." }
            ],
        },
        terms: {
            title: "Terms of Service",
            date: "Effective Date: November 10, 2025",
            chapters: [
                {
                    title: "Chapter 1: General Provisions", articles: [
                        { title: "Article 1 (Application of These Terms)", content: "These terms apply to all matters concerning the use of all services provided by Nantetu Server. Users are deemed to have agreed to these terms by using the service." },
                        { title: "Article 2 (Definitions)", content: "“User” refers to an individual using this service, and “Content” refers to data created and published by the user." }
                    ]
                },
                {
                    title: "Chapter 2: User Registration and User Obligations", articles: [
                        { title: "Article 3 (User Registration)", content: "Applicants must agree to these terms before registering for use. Parental consent is required for minors." },
                        { title: "Article 4 (Management of Account Information)", content: "Users are responsible for managing their account information, and transfer or lending to a third party is prohibited." }
                    ]
                },
                {
                    title: "Chapter 3: Prohibited Acts and Suspension of Use", articles: [
                        { title: "Article 5 (Prohibited Acts)", content: "Violation of laws and regulations, infringement of rights, harassment, unauthorized account use, exploitation of cheats or bugs, excessive server load, obstruction, and unauthorized commercial or religious activities are prohibited." },
                        { title: "Article 6 (Suspension of Use)", content: "In case of violation, measures such as suspension of use (BAN), content deletion, or account deletion may be taken without prior notice." }
                    ]
                },
                {
                    title: "Chapter 4: Content and Intellectual Property Rights", articles: [
                        { title: "Article 7 (Rights to Content)", content: "The copyright of content created by the user belongs to the user him/herself." },
                        { title: "Article 8 (Use by Management)", content: "The user grants the management the right to use the content free of charge for purposes such as promotion." }
                    ]
                },
                {
                    title: "Chapter 5: Disclaimers", articles: [
                        { title: "Article 9 (Disclaimers)", content: "The management does not guarantee the completeness of the service and is not responsible for damages caused by data loss or service stoppage." },
                        { title: "Article 10 (Damages)", content: "In the event of damage caused by a breach of these terms, the user is obliged to compensate for that damage." }
                    ]
                }
            ],
            signature: "Nantetu Server Management"
        },
        privacy: {
            title: "Privacy Policy",
            date: "Effective Date: November 9, 2025",
            intro: "The 'Nantetu Server' (hereinafter, 'The Server') recognizes the importance of our players' personal information and establishes the following Privacy Policy to ensure its complete protection.",
            section1_title: "1. Information Collected and Its Purpose of Use",
            subsection1_1_title: "1-1. In-Game Information",
            subsection1_1_info: "Information Acquired:",
            subsection1_1_purpose: "Purpose of Use:",
            subsection1_1_data: ["Minecraft ID, operation logs, chat logs, IP address."],
            subsection1_1_usage: ["Griefing prevention, service maintenance, response to terms violations."],
            subsection1_2_title: "1-2. Inquiry Information",
            subsection1_2_data: ["Name, Discord Tag, Content of the inquiry."],
            subsection1_2_usage: ["Support correspondence, identity verification."],
            section2_title: "2. Provision of Information to Third Parties",
            section2_content: "Personal information will not be provided to third parties without the player's consent, except in cases required by law or in emergency situations.",
            section3_title: "3. Contact Point for Inquiries",
            section3_content: "Management Contact:",
            email: "nantetu2@gmail.com"
        },
        rules_data: [
            {
                title: "Article 1: Prohibition of Griefing, Theft, and Cheating",
                content: [
                    "Destruction, theft, or unauthorized use of other players' property (buildings, items in chests) is subject to permanent BAN.",
                    "The use of modified clients other than texture packs, cheats, or BOTs is prohibited.",
                    "Do not exploit any discovered bugs or glitches; report them to the staff immediately."
                ]
            },
            {
                title: "Article 2: Prohibition of Harassment and Annoyance",
                content: [
                    "Discriminatory remarks, slander, and excessive harassment towards other players are prohibited.",
                    "Actions that place an excessive load on the server (such as leaving clock circuits unattended) are prohibited.",
                    "Other acts that cause discomfort to other players may be subject to penalty at the discretion of the staff."
                ]
            },
            {
                title: "Article 3: Rules Regarding Structures and Scenery",
                content: [
                    "Structures that significantly spoil the scenery (e.g., 'tofu' blocks, giant pillars) may be subject to requests for improvement.",
                    "Start building your structure at least 5 blocks away from the area where other players are permanently residing.",
                    "Structures containing symbols or messages that violate public order and morals are prohibited."
                ]
            }
        ],
        quiz_data: [
            { question: "[Article 1] What happens if I illegally destroy or steal another player's structure?", options: ["It's fine if I'm not caught", "The staff will issue a warning", "It is subject to permanent BAN"], answer: "It is subject to permanent BAN" },
            { question: "[Article 2] I made discriminatory remarks in the game. Is this allowed?", options: ["It's allowed because it doesn't overload the server", "It's prohibited because it relates to other players' discomfort", "It's fine if it's a private exchange"], answer: "It's prohibited because it relates to other players' discomfort" },
            { question: "[Article 3] If I build near another player's base, what is the minimum distance in blocks I should keep?", options: ["5 blocks", "10 blocks", "20 blocks"], answer: "5 blocks" }
        ],
        footer: {
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            contact: "Contact Us",
            sitemap: "Sitemap",
            promotion: "Join Discord to get the latest updates and community support!",
            promotion_link: "Join Discord",
            copy_success: "Copied!",
            not_found_title: "Page Not Found 🚧",
            not_found_desc: "The page you are looking for does not exist or may have been moved.",
            not_found_btn: "Back to Home Page",
            chat_title: "Nantetu AI Assistant",
            chat_subtitle: "Ask questions about server rules, commands, and how to play.",
            chat_input_placeholder: "Enter your question...",
            chat_send: "Send",
            chat_loading: "AI is thinking...",
            chat_error: "An error occurred. Please try again.",
            chat_clear: "Clear Conversation",
            search_placeholder: "Search the site...",
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

// ==========================================
// 2. UI Components (UI.jsx)
// ==========================================

export const LoadingScreen = () => (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-950 flex flex-col items-center justify-center animate-fade-out pointer-events-none transition-opacity duration-700">
        <div className="text-center relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse"></div>
             <div className="relative z-10 w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-purple-500/30 ring-1 ring-gray-100 dark:ring-white/10">
                <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Loading" className="w-20 h-20 rounded-xl object-cover" />
             </div>
             <h1 className="text-gray-900 dark:text-white text-3xl font-black tracking-wider mb-2 animate-fade-in-up">Nantetu Server</h1>
             <p className="text-purple-600 dark:text-purple-400 font-bold text-sm tracking-[0.2em] animate-pulse">INITIALIZING...</p>
        </div>
    </div>
);

export const LoadingBar = ({ isLoading }) => (
    <div className={`fixed top-0 left-0 w-full h-1 z-[10000] transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        {isLoading && <div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-progress shadow-[0_0_15px_rgba(168,85,247,0.7)] w-full"></div>}
    </div>
);

export const Toast = ({ message }) => (
  <div className="fixed bottom-20 right-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in-up z-50 border-l-4 border-purple-500 ring-1 ring-black/5 max-w-sm">
    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
        <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
    </div>
    <span className="font-bold text-sm md:text-base">{message}</span>
  </div>
);

export const FeatureCard = ({ icon: Icon, title, description, colorClass, bgClass, onClick }) => (
  <div 
    onClick={onClick}
    className={`glass-panel p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 group relative overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-2' : 'hover:-translate-y-1'}`}
  >
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${bgClass} bg-opacity-10 dark:bg-opacity-20 shadow-inner relative z-10 ring-1 ring-white/10`}>
      <Icon size={32} className={`${colorClass} transform group-hover:scale-110 transition-transform duration-300`} />
    </div>
    <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{description}</p>
    {onClick && (
        <div className="mt-4 flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            詳細を見る <ArrowRight size={14} className="ml-1" />
        </div>
    )}
  </div>
);

// Improved CopyBox Component
export const CopyBox = ({ label, value, onCopy, lang }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="text-center sm:text-left w-full overflow-hidden">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-1">
            {label}
          </p>
          <p className="font-mono text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight truncate w-full" title={value}>{value}</p>
        </div>
        <button 
          onClick={handleCopyClick}
          className={`flex-shrink-0 font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95 border
            ${isCopied 
                ? 'bg-green-500 text-white border-green-500 shadow-green-500/30' 
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 border-transparent hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 hover:shadow-purple-500/30'
            }`}
        >
          {isCopied ? <CheckCircle size={18} className="animate-bounce" /> : <Copy size={18} />}
          <span className="uppercase text-sm">
             {isCopied 
                ? LANGUAGES[lang].join.copy_success 
                : LANGUAGES[lang].join.copy_action || 'Copy'}
          </span>
        </button>
      </div>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-150 group-hover:from-purple-500/10 pointer-events-none"></div>
    </div>
  );
};

export const AccordionItem = ({ title, content, isOpen, toggle }) => (
  <div className={`border rounded-xl mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg ring-2 ring-purple-500/20 border-purple-500 bg-white dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md bg-white/50 dark:bg-gray-800/50'}`}>
    <button 
      onClick={toggle}
      className={`w-full flex items-center justify-between p-5 text-left font-bold text-lg transition-colors ${isOpen ? 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10' : 'text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750'}`}
    >
      <span className="flex items-center gap-3">
          {isOpen ? <Sparkles size={18} className="text-purple-500 animate-pulse" /> : <HelpCircle size={18} className="text-gray-400" />}
          {title}
      </span>
      {isOpen ? <ChevronUp size={20} className="text-purple-500" /> : <ChevronDown size={20} className="text-gray-400" />}
    </button>
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
       <div className="p-6 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700">
          {Array.isArray(content) ? (
             <ul className="space-y-3">
               {content.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1 flex-shrink-0 bg-purple-100 dark:bg-purple-900/50 rounded-full p-0.5">
                        <CheckCircle size={14} />
                    </span>
                    <span>{item}</span>
                 </li>
               ))}
             </ul>
          ) : (
             <div>{content}</div>
          )}
       </div>
    </div>
  </div>
);

export const NewsItem = ({ item, L }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${isOpen ? 'ring-2 ring-purple-500/20 shadow-lg' : ''}`}
    >
       <div className="p-6 md:p-8">
         <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-between">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider w-fit border ${item.type === 'maintenance' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50'}`}>
                {item.type === 'maintenance' ? L.news.maintenance : L.news.info}
              </span>
              <span className="text-gray-400 text-sm font-bold flex items-center gap-1.5"><Clock size={14} /> {item.date}</span>
            </div>
            <div className="text-gray-300 group-hover:text-purple-500 transition-colors self-end md:self-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-full">
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
         </div>
         
         <h3 className="text-xl md:text-2xl font-bold mb-3 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">{item.title}</h3>
         
         <div className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 text-sm md:text-base ${isOpen ? 'line-clamp-none' : 'line-clamp-2'}`}>
            {item.content}
         </div>

         <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-20 opacity-100 mt-5' : 'max-h-0 opacity-0'}`}>
             {item.url && (
                 <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()} 
                    className="inline-flex items-center gap-2 text-white font-bold bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                 >
                     {L.news.link_text} <ExternalLink size={16} />
                 </a>
             )}
         </div>
       </div>
    </div>
  );
};

// ==========================================
// 3. Layout Components (Layout.jsx)
// ==========================================

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [scrolledToTop, setScrolledToTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (Math.abs(scrollY - lastScrollY) > 5)) {
        setScrollDirection(direction);
      }
      setScrolledToTop(scrollY < 50);
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection]);
  return { scrollDirection, scrolledToTop };
};

export const Navbar = ({ 
  L, page, navigate, darkMode, setDarkMode, 
  isMenuOpen, setIsMenuOpen, currentLang, setCurrentLang, 
  searchTerm, handleSearch, serverStatus, hasUnreadNews, newsData 
}) => {
    const { scrollDirection, scrolledToTop } = useScrollDirection();
    const isHidden = scrollDirection === "down" && !scrolledToTop && !isMenuOpen;

    return (
    <>
        <div 
            className={`fixed left-0 right-0 z-[500] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
            }`}
        >
              <nav className={`transition-all duration-500 relative z-20 ${
                  scrolledToTop && !isMenuOpen ? 'bg-transparent py-4' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm py-0'
              }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('home')}>
                      <div className="relative">
                          <img 
                            src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" 
                            alt="Nantetu Server Icon" 
                            className="w-10 h-10 rounded-xl shadow-lg group-hover:scale-110 transition-transform object-cover ring-2 ring-white dark:ring-gray-800"
                          />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-gray-900 rounded-full ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      </div>
                      <span className={`font-black text-xl tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors hidden sm:block ${scrolledToTop && !isMenuOpen && !darkMode ? 'text-white drop-shadow-md' : 'text-gray-800 dark:text-white'}`}>なんてつサーバー</span>
                    </div>

                    {/* Right Container: Nav Links + Search + Actions */}
                    <div className="hidden lg:flex items-center gap-6 ml-auto">
                      
                      {/* Nav Links */}
                      <div className="flex items-center gap-1 bg-white/10 dark:bg-black/20 backdrop-blur-md p-1.5 rounded-full border border-white/20 dark:border-white/10 shadow-sm">
                        {['home', 'news', 'forum', 'commands', 'guide'].map((key) => (
                            <button 
                              key={key}
                              onClick={() => navigate(key)} 
                              className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                  page === key 
                                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-md ring-1 ring-gray-100 dark:ring-gray-600' 
                                  : scrolledToTop && !darkMode ? 'text-white hover:bg-white/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {L.nav[key]}
                              {key === 'news' && hasUnreadNews && (
                                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                              )}
                            </button>
                        ))}
                      </div>

                      {/* Join Button (Primary CTA) */}
                      <button 
                        onClick={() => navigate('join')}
                        className="bg-white text-purple-600 hover:bg-purple-50 font-bold py-2.5 px-6 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 ring-2 ring-purple-600/10 active:scale-95"
                      >
                          <Gamepad2 size={18} />
                          {L.nav.join}
                      </button>

                      {/* Search & Toggles & Server Status */}
                      <div className={`flex items-center gap-3 border-l pl-6 ${scrolledToTop && !darkMode ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="relative group">
                          <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${scrolledToTop && !darkMode ? 'text-white/70 group-focus-within:text-purple-500' : 'text-gray-400 group-focus-within:text-purple-500'}`} />
                          <input type="text" placeholder={L.footer.search_placeholder} value={searchTerm} onChange={handleSearch} className={`pl-9 pr-4 py-2 w-32 focus:w-48 rounded-full text-sm border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all ${scrolledToTop && !darkMode ? 'bg-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 dark:text-white'}`} />
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all font-bold text-xs border border-transparent ${scrolledToTop && !darkMode ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'}`}>{currentLang === 'ja' ? 'EN' : 'JP'}</button>
                            <button onClick={() => setDarkMode(!darkMode)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all border border-transparent ${scrolledToTop && !darkMode ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-purple-100 dark:hover:bg-gray-700'}`}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${
                            serverStatus.online 
                                ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' 
                                : 'bg-gray-100 text-gray-400 border-gray-200'
                        } ${scrolledToTop && !isMenuOpen && !darkMode ? 'bg-black/30 text-white border-white/20' : ''}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${serverStatus.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                            <span className="hidden xs:inline">{serverStatus.online ? `${serverStatus.players} Online` : 'Offline'}</span>
                      </div>
                      <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full transition-colors ${scrolledToTop && !isMenuOpen && !darkMode ? 'text-white hover:bg-white/10' : 'text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-xl transition-colors ${scrolledToTop && !isMenuOpen && !darkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                    </div>
                  </div>
                </div>

                {/* Mobile Nav Dropdown */}
                <div className={`lg:hidden absolute w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isMenuOpen ? 'max-h-[800px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
                    <div className="px-4 pt-4 pb-6 space-y-2">
                      <div className="relative mb-6">
                        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder={L.footer.search_placeholder} value={searchTerm} onChange={handleSearch} className="pl-11 pr-4 py-3 w-full rounded-xl text-base bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" />
                      </div>
                      {['home', 'news', 'forum', 'guide', 'commands'].map((key) => (
                          <button 
                                key={key}
                                onClick={() => { navigate(key); setIsMenuOpen(false); }} 
                                className={`relative flex items-center justify-between w-full text-left px-4 py-4 text-base font-bold rounded-xl transition-all active:scale-95 ${
                                    page === key 
                                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    {key === 'home' && <Home size={18} className="opacity-70" />}
                                    {key === 'news' && <Bell size={18} className="opacity-70" />}
                                    {key === 'forum' && <MessageSquare size={18} className="opacity-70" />}
                                    {key === 'guide' && <BookOpen size={18} className="opacity-70" />}
                                    {key === 'commands' && <Terminal size={18} className="opacity-70" />}
                                    {L.nav[key]}
                                </span>
                                {key === 'news' && hasUnreadNews && (
                                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">NEW</span>
                                )}
                          </button>
                      ))}
                      
                      <button onClick={() => { navigate('join'); setIsMenuOpen(false); }} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                          <Gamepad2 size={20} /> {L.nav.join}
                      </button>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                      <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className="block w-full text-left px-4 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-xl">
                          🌐 {currentLang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
                      </button>
                    </div>
                </div>
              </nav>
        </div>
        {/* Backdrop for Mobile Menu */}
        {isMenuOpen && (
            <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMenuOpen(false)}></div>
        )}
    </>
    );
};

export const Footer = ({ L, navigate }) => (
    <footer className="bg-gray-900 text-gray-400 text-center border-t border-gray-800 relative overflow-hidden">
        <div className="py-24">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="mb-16 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto border border-white/10 transform hover:scale-[1.01] transition-transform relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all"></div>
                    
                    <h3 className="text-3xl font-black text-white mb-4 flex flex-col md:flex-row items-center justify-center gap-3 relative z-10">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">{L.footer.promotion}</span>
                    </h3>
                    <p className="text-purple-200 mb-8 text-lg font-medium opacity-80 relative z-10">サーバーサポート、イベント情報、そして新しい仲間があなたを待っています。</p>
                    <a href="https://discord.gg/79H7Jy65nz" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-3 bg-white text-purple-900 font-black px-10 py-4 rounded-full hover:bg-gray-100 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] hover:-translate-y-1">
                        <MessageCircle size={22} />{L.footer.promotion_link}
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-sm font-bold text-left max-w-5xl mx-auto border-b border-gray-800 pb-12">
                    <div>
                        <h4 className="text-white mb-6 uppercase tracking-widest text-xs opacity-50 flex items-center gap-2"><Map size={14} /> {L.footer.sitemap}</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => navigate('home')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.home}</button></li>
                            <li><button onClick={() => navigate('news')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.news}</button></li>
                            <li><button onClick={() => navigate('join')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.join}</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-6 uppercase tracking-widest text-xs opacity-50 flex items-center gap-2"><BookOpen size={14} /> Support</h4>
                        <ul className="space-y-4">
                             <li><button onClick={() => navigate('guide')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.guide}</button></li>
                             <li><button onClick={() => navigate('commands')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.commands}</button></li>
                             <li><button onClick={() => navigate('forum')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.forum}</button></li>
                        </ul>
                    </div>
                    <div>
                         <h4 className="text-white mb-6 uppercase tracking-widest text-xs opacity-50 flex items-center gap-2"><Lock size={14} /> Legal</h4>
                         <ul className="space-y-4">
                             <li><button onClick={() => navigate('terms')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.footer.terms}</button></li>
                             <li><button onClick={() => navigate('privacy')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.footer.privacy}</button></li>
                         </ul>
                    </div>
                    <div>
                         <h4 className="text-white mb-6 uppercase tracking-widest text-xs opacity-50 flex items-center gap-2"><ExternalLink size={14} /> Other</h4>
                         <ul className="space-y-4">
                             <li><button onClick={() => navigate('home', 'contact')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.footer.contact}</button></li>
                             <li>
                                <a href="https://www.youtube.com/@なんてつ" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <Youtube size={16} className="text-red-500 opacity-80 group-hover:opacity-100" /> YouTube
                                </a>
                             </li>
                             <li>
                                <a href="https://twitter.com/nantetu123" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <Twitter size={16} className="text-blue-400 opacity-80 group-hover:opacity-100" /> Twitter (X)
                                </a>
                             </li>
                         </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center opacity-40 text-xs gap-4">
                    <p>&copy; 2025 Nantetu Server. All rights reserved.</p>
                    <p>Not affiliated with Mojang AB.</p>
                </div>
            </div>
        </div>
      </footer>
);

export const AIChat = ({ L, isChatOpen, closeChat, currentLang }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = { role: 'user', text: input.trim() };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setInput('');
    setIsLoading(true);
    
    // Mock Response
    setTimeout(() => {
        setIsLoading(false);
        setChatHistory(prev => [...prev, { role: 'model', text: currentLang === 'ja' ? "申し訳ありません。現在AI機能はメンテナンス中です。" : "Sorry, AI feature is currently under maintenance." }]);
    }, 1000);
  };

  const handleClear = () => setChatHistory([]);
  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-end justify-end md:justify-center p-0 md:p-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full md:max-w-md h-full md:h-[650px] flex flex-col rounded-t-2xl md:rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-slide-in-up border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center shadow-md">
          <div><h3 className="text-lg font-black flex items-center gap-2"><Zap size={20} className="text-yellow-300 fill-current" />{L.footer.chat_title}</h3><p className="text-xs text-purple-200 opacity-90">Powered by Gemini</p></div>
          <div className="flex items-center gap-1">
            <button onClick={handleClear} disabled={chatHistory.length === 0} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"><Trash2 size={18} /></button>
            <button onClick={closeChat} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><X size={24} /></button>
          </div>
        </div>
        <div ref={chatRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-black/20">
          {chatHistory.length === 0 ? (
            <div className="text-center p-8 pt-20 text-gray-500 dark:text-gray-400 animate-fade-in-up">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><MessageCircle size={36} className="text-purple-500" /></div>
              <p className="font-bold text-lg mb-2">{L.footer.chat_subtitle}</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-scale origin-bottom`}>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && <div className="text-xs text-gray-400 ml-4">{L.footer.chat_loading}</div>}
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={L.footer.chat_input_placeholder} className="flex-grow pl-5 pr-12 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white" disabled={isLoading}/>
            <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center justify-center shadow-md"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Sub Pages (SubPages.jsx)
// ==========================================

export const NewsPage = ({ L, newsData }) => {
    const displayData = (newsData && newsData.length > 0) ? newsData : L.news.default_data;
    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Bell className="text-purple-500" size={40} />{L.news.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.news.subtitle}</p>
            </div>
            <div className="space-y-6">
                {displayData.map((item) => (
                    <NewsItem key={item.id} item={item} L={L} />
                ))}
            </div>
        </div>
    );
};

export const ForumPage = ({ L, user }) => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [name, setName] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (!user) return;
        // In a real app, this would use Firestore properly. For demo, we simulate with state if firestore fails
        try {
            // Note: DB is not globally available in this file structure unless passed as prop or context.
            // Assuming 'db' is available via closure or context in a real app.
            // For this single file, we skip the implementation details of DB fetch to avoid errors if config is missing.
            setPosts([]); 
        } catch (e) {
            console.log("Firestore error:", e);
        }
    }, [user]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        setIsSending(true);
        // Simulate post for UI feedback
        setTimeout(() => {
             setPosts([{id: Date.now(), text: newPost, name: name.trim() || L.forum.anonymous, createdAt: {toDate: () => new Date()}}, ...posts]);
             setNewPost('');
             setIsSending(false);
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16"><h2 className="text-4xl font-black mb-4 dark:text-white">{L.forum.title}</h2></div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 mb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <form onSubmit={handlePost}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={L.forum.input_name} className="w-full md:w-1/3 px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" />
                        </div>
                        <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder={L.forum.input_message} rows="3" className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none focus:ring-2 focus:ring-purple-500 transition-all text-lg" />
                        <div className="flex justify-between items-center">
                             <p className="text-xs text-gray-400">※不適切な投稿は削除される場合があります。</p>
                            <button type="submit" disabled={isSending || !newPost.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5">
                                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}{isSending ? L.forum.sending : L.forum.send}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="space-y-6">
                {posts.length === 0 ? <div className="text-center py-20 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-dashed border-2 border-gray-200 dark:border-gray-700"><MessageSquare size={48} className="mx-auto mb-4 opacity-20" /><p>{L.forum.no_posts}</p></div> : posts.map(post => (<div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up hover:shadow-md transition-all"><div className="flex justify-between items-start mb-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs">{post.name.charAt(0)}</div><span className="font-bold text-purple-900 dark:text-purple-300">{post.name}</span></div><span className="text-xs text-gray-400 font-mono">{post.createdAt?.toDate().toLocaleString() || 'Just now'}</span></div><p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap pl-10 text-lg leading-relaxed">{post.text}</p></div>))}
            </div>
        </div>
    );
};

export const GuidePage = ({ L, activeAccordion, setActiveAccordion }) => (
    <div className="max-w-5xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white tracking-tight flex justify-center items-center gap-4"><BookOpen className="text-purple-500 hidden sm:block" size={48} />{L.guide.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{L.guide.subtitle}</p>
        </div>
        <div className="mb-24 relative">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center relative inline-block left-1/2 transform -translate-x-1/2">
                {L.guide.steps_title}
                <div className="absolute -bottom-4 left-0 w-full h-1 bg-purple-500 rounded-full opacity-50"></div>
            </h3>
            <div className="space-y-12">
                {L.guide.steps.map((item, index) => (
                    <div key={item.step} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                        <div className="flex-1 w-full"><div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-purple-400 transition-colors relative group"><div className="absolute top-0 left-0 w-2 h-full bg-purple-500 rounded-l-3xl group-hover:bg-purple-400 transition-colors"></div><h4 className="text-xl font-bold mb-3 dark:text-white group-hover:text-purple-600 transition-colors">{item.title}</h4><p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p></div></div>
                        <div className="relative flex-shrink-0"><div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-xl z-10 relative ring-8 ring-gray-50 dark:ring-gray-900">{item.step}</div></div>
                        <div className="flex-1 hidden md:block"></div>
                    </div>
                ))}
            </div>
        </div>
        <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-10 dark:text-white flex items-center justify-center gap-3"><HelpCircle size={32} className="text-yellow-500" />{L.guide.faq_title}</h3>
            <div className="space-y-4">
                {L.guide.faq_data.map((faq, idx) => (<AccordionItem key={idx} title={faq.q} content={faq.a} isOpen={activeAccordion === `faq-${idx}`} toggle={() => setActiveAccordion(activeAccordion === `faq-${idx}` ? null : `faq-${idx}`)} />))}
            </div>
        </div>
    </div>
);

export const CommandsPage = ({ L }) => (
    <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900/30 rounded-3xl mb-6 text-purple-600 dark:text-purple-400 shadow-inner"><Terminal size={48} /></div>
            <h2 className="text-4xl font-black mb-4 dark:text-white">{L.commands.title}</h2>
        </div>
        <div className="grid gap-16">
            {L.commands.sections.map((section, idx) => (
                <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700"><h3 className={`text-2xl font-bold ${section.color}`}>{section.category}</h3></div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {section.commands.map((cmd, cIdx) => (
                            <div key={cIdx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all hover:shadow-lg group">
                                <div className="flex justify-between items-start gap-4 mb-3"><code className="px-4 py-2 bg-gray-100 dark:bg-gray-900 text-purple-700 dark:text-purple-300 rounded-lg font-mono font-bold text-sm border border-gray-200 dark:border-gray-700 w-full block truncate">{cmd.cmd}</code></div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-1">{cmd.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const TermsPage = ({ L }) => {
    const title = L.terms?.title || "利用規約";
    const subtitle = L.terms?.subtitle || "当サーバーを利用する上でのルール";
    const chapters = L.terms?.chapters || [];

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3">
                    <FileText className="text-purple-500" size={40} />
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
                {L.terms?.date && <p className="text-sm text-gray-400 mt-2">{L.terms.date}</p>}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-8 md:p-12 space-y-12">
                    {chapters.map((chapter, index) => (
                        <div key={index}>
                            <h3 className="text-2xl font-black mb-6 pb-2 border-b-2 border-purple-100 dark:border-gray-700 text-gray-900 dark:text-white">
                                {chapter.title}
                            </h3>
                            <div className="space-y-6">
                                {chapter.articles.map((article, aIdx) => (
                                    <div key={aIdx}>
                                        <h4 className="text-lg font-bold mb-2 text-purple-700 dark:text-purple-400">{article.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-200 dark:border-gray-700">{article.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 text-center border-t border-gray-100 dark:border-gray-700">
                    <p className="font-bold text-gray-800 dark:text-white">{L.terms?.signature}</p>
                </div>
            </div>
        </div>
    );
};

export const PrivacyPage = ({ L }) => {
    const title = L.privacy?.title || "プライバシーポリシー";
    const subtitle = L.privacy?.subtitle || "個人情報の取り扱いについて";

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3">
                    <Lock className="text-purple-500" size={40} />
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <p className="text-gray-700 dark:text-gray-300 mb-6">{L.privacy?.intro}</p>
                     
                     <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">{L.privacy?.section1_title}</h3>
                     <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                            <h4 className="font-bold mb-2 dark:text-white">{L.privacy?.subsection1_1_title}</h4>
                            <p className="text-sm text-gray-500 mb-1">{L.privacy?.subsection1_1_info}</p>
                            <p className="mb-3 text-gray-700 dark:text-gray-300">{L.privacy?.subsection1_1_data}</p>
                            <p className="text-sm text-gray-500 mb-1">{L.privacy?.subsection1_1_purpose}</p>
                            <p className="text-gray-700 dark:text-gray-300">{L.privacy?.subsection1_1_usage}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                            <h4 className="font-bold mb-2 dark:text-white">{L.privacy?.subsection1_2_title}</h4>
                             <p className="text-sm text-gray-500 mb-1">{L.privacy?.subsection1_1_info}</p>
                             <p className="mb-3 text-gray-700 dark:text-gray-300">{L.privacy?.subsection1_2_data}</p>
                             <p className="text-sm text-gray-500 mb-1">{L.privacy?.subsection1_1_purpose}</p>
                             <p className="text-gray-700 dark:text-gray-300">{L.privacy?.subsection1_2_usage}</p>
                        </div>
                     </div>

                     <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">{L.privacy?.section2_title}</h3>
                     <p className="text-gray-700 dark:text-gray-300 mb-8">{L.privacy?.section2_content}</p>

                     <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">{L.privacy?.section3_title}</h3>
                     <p className="text-gray-700 dark:text-gray-300">{L.privacy?.section3_content} <a href={`mailto:${L.privacy?.email}`} className="text-purple-500 underline font-bold">{L.privacy?.email}</a></p>
                </div>
            </div>
        </div>
    );
};

export const JoinSection = ({ L, serverStatus, handleCopy, navigate }) => (
    <section id="join" className="py-24 px-4 relative overflow-hidden animate-fade-in-scale">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
            <div className="lg:w-1/2">
                <div className="inline-block p-4 rounded-3xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-8 shadow-inner">
                    <Gamepad2 size={40} />
                </div>
                <h2 className="text-5xl font-black mb-6 dark:text-white leading-tight">
                    {L.join.title}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-medium">
                    {L.join.subtitle}
                </p>

                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-8 mb-10 ring-1 ring-gray-900/5 dark:ring-white/10">
                    <CopyBox
                        label={L.join.label_gamertag}
                        value={L.server.tag}
                        onCopy={handleCopy}
                        lang={L.lang_code}
                    />
                    <div className="grid sm:grid-cols-2 gap-6">
                        <CopyBox
                            label={L.join.label_ip}
                            value={L.server.ip}
                            onCopy={handleCopy}
                            lang={L.lang_code}
                        />
                        <CopyBox
                            label={L.join.label_port}
                            value={L.server.port}
                            onCopy={handleCopy}
                            lang={L.lang_code}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <a href="https://discord.gg/79H7Jy65nz" target="_blank" rel="noreferrer" className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:-translate-y-1 hover:shadow-[#5865F2]/40">
                        <MessageCircle size={24} /> {L.join.btn_discord}
                    </a>
                    <button onClick={() => navigate('guide')} className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all border border-gray-200 dark:border-gray-700 hover:border-purple-300 shadow-lg hover:-translate-y-1">
                        <BookOpen size={24} /> {L.join.btn_guide}
                    </button>
                </div>
            </div>

            <div className="lg:w-1/2 w-full">
                <div className="relative aspect-video lg:aspect-auto lg:h-[600px] overflow-hidden group rounded-[2.5rem] shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-700 border-4 border-white dark:border-gray-800">
                    <img src="https://github.com/NANTETU/Nantetu-Server/blob/main/images/join_info.png?raw=true" alt={L.join.img_alt_text} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex flex-col justify-end p-10">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-white font-black text-3xl drop-shadow-lg mb-2">{L.join.img_overlay_text}</p>
                            <div className="w-20 h-1.5 bg-yellow-400 rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export const JoinPage = ({ L, serverStatus, handleCopy, navigate }) => (
    <div className="pt-24"><JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} /></div>
);


// ==========================================
// 5. Home Page (Home.jsx)
// ==========================================

export const HomePage = ({ L, serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, scrollToSection, navigate, activeAccordion, setActiveAccordion, showToast, newsData, hasUnreadNews }) => {
    const QUIZ_DATA = L.quiz_data;
    const latestNews = newsData && newsData.length > 0 ? newsData.slice(0, 3) : L.news.default_data;

    // Contact Form Logic
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;

        if (!DISCORD_WEBHOOK_URL) {
            showToast(L.lang_name === "日本語" ? "Webhookが設定されていません (デモ)" : "Webhook not configured (Demo)");
            return;
        }

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [{
                        title: "📬 新しいお問い合わせ",
                        color: 0x8b5cf6, // Purple
                        fields: [
                            { name: "お名前 (MCID)", value: name, inline: true },
                            { name: "連絡先", value: email, inline: true },
                            { name: "メッセージ", value: message }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                })
            });

            if (response.ok) {
                showToast(L.lang_name === "日本語" ? "送信しました！" : "Message Sent!");
                form.reset();
            } else {
                throw new Error("Failed");
            }
        } catch (error) {
            console.error(error);
            showToast(L.lang_name === "日本語" ? "送信に失敗しました" : "Failed to send");
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <header className="relative h-screen min-h-[700px] flex items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1607016284345-c5478694085f?q=80&w=2070&auto=format&fit=crop" alt="Minecraft Landscape" className="w-full h-full object-cover transform scale-105 animate-float" style={{ animationDuration: '20s' }} onError={(e) => { e.target.onerror = null; e.target.src = "https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/banner.jpg"; }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {serverStatus.loading ? L.status.loading : serverStatus.online ? L.status.online(serverStatus.players) : L.status.offline}
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl whitespace-pre-line animate-fade-in-up transition-all duration-700 tracking-tight">
                        {L.home.hero_title.split('\n')[0]}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 animate-pulse">{L.home.hero_title.split('\n')[1]}</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-medium whitespace-pre-line leading-relaxed animate-fade-in-up drop-shadow-md" style={{ animationDelay: '200ms' }}>{L.home.hero_subtitle}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <button onClick={() => scrollToSection('join')} className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xl font-black rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-3"><Gamepad2 size={28} />{L.home.join_now}</span>
                            <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                        </button>
                        <button onClick={() => scrollToSection('about')} className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl font-bold rounded-full transition-all flex items-center gap-3 hover:scale-105">
                            <HelpCircle size={28} />{L.home.see_details}
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="relative z-20 -mt-24 max-w-6xl mx-auto px-4">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700 p-10 grid grid-cols-2 md:grid-cols-4 gap-8 hover:transform hover:-translate-y-1 transition-transform duration-500">
                    {[
                        { val: "150+", label: L.home.stat_cumulative_players, icon: Users, color: "text-blue-500" },
                        { val: "70%", label: L.home.stat_retention_rate, icon: CheckCircle, color: "text-green-500" },
                        { val: "99.9%", label: L.home.stat_uptime, icon: Server, color: "text-purple-500" },
                        { val: "15+", label: L.home.stat_max_online, icon: Zap, color: "text-yellow-500" }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <stat.icon className={`${stat.color} mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm`} size={36} />
                            <div className="text-4xl font-black text-gray-800 dark:text-white mb-2">{stat.val}</div>
                            <div className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest News Section (New) */}
            <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50">
                 <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-black dark:text-white mb-2">{L.home.latest_news_title || "最新のお知らせ"}</h2>
                            <div className="h-1.5 w-20 bg-purple-500 rounded-full"></div>
                        </div>
                        <button onClick={() => navigate('news')} className="hidden md:flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
                            {L.home.see_news} <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {latestNews.map((item) => (
                             <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer" onClick={() => navigate('news')}>
                                 <div className="flex items-center justify-between mb-4">
                                     <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${item.type === 'maintenance' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{item.type === 'maintenance' ? L.news.maintenance : L.news.info}</span>
                                     <span className="text-xs text-gray-400 font-bold">{item.date}</span>
                                 </div>
                                 <h3 className="font-bold text-lg mb-3 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                 <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">{item.content}</p>
                                 <div className="text-purple-500 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-auto">Read More <ArrowRight size={14}/></div>
                             </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('news')} className="md:hidden w-full mt-6 py-4 bg-white dark:bg-gray-800 text-purple-600 font-bold rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex justify-center items-center gap-2">
                        {L.home.see_news} <ArrowRight size={18} />
                    </button>
                 </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative z-10 order-2 md:order-1">
                            <div className="inline-block p-4 rounded-3xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-8"><Server size={40} /></div>
                            <h2 className="text-5xl font-black mb-8 dark:text-white leading-tight">{L.home.what_is_nantetsu}</h2>
                            <div className="space-y-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-l-8 border-purple-500 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={80} className="text-purple-500"/></div>
                                    <strong className="text-purple-600 dark:text-purple-400 block text-2xl font-black mb-4">{L.home.description_p1}</strong>
                                    {L.home.description_p2}
                                </div>
                                <p className="text-xl">{L.home.description_p3}</p>
                            </div>
                        </div>
                         <div className="order-1 md:order-2 relative">
                             <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700">
                                <img src="https://github.com/NANTETU/Nantetu-Server/blob/main/images/867244da-775d-4a50-8d80-41b3ba7b7dcb.jpg?raw=true" alt="Server Community" className="w-full h-full object-cover" />
                             </div>
                             <div className="absolute inset-0 bg-purple-600 rounded-[3rem] rotate-6 opacity-20 scale-95 blur-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-gray-900 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black mb-20 inline-block relative text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">{L.home.stats_title}</span>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-purple-500 rounded-full"></div>
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

            {/* Rules & Quiz */}
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
                    
                    {/* Quiz UI Block */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 md:p-16 border border-purple-100 dark:border-gray-700 relative overflow-hidden text-center group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                        
                        {!quizState.started ? (
                            <div className="animate-fade-in relative z-10">
                                <div className="inline-block p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6"><Sparkles size={32} /></div>
                                <h3 className="text-3xl font-black mb-6 dark:text-white">{L.home.quiz_title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg max-w-2xl mx-auto">{L.home.quiz_subtitle}</p>
                                <button onClick={() => setQuizState({ ...quizState, started: true })} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg flex items-center gap-2 mx-auto">
                                    {L.home.quiz_start} <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in relative z-10">
                                {quizState.finished ? (
                                    <div className="animate-fade-in-up">
                                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle size={48} className="text-green-500" />
                                        </div>
                                        <h3 className="text-3xl font-black mb-2 dark:text-white">{L.home.quiz_done}</h3>
                                        <p className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{L.home.quiz_score(quizState.score, QUIZ_DATA.length)}</p>
                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-8 border border-gray-100 dark:border-gray-700">
                                            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                                {quizState.score === QUIZ_DATA.length ? L.home.quiz_result_perfect : L.home.quiz_result_retry}
                                            </p>
                                        </div>
                                        <button onClick={resetQuiz} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-1">{L.home.quiz_retry}</button>
                                    </div>
                                ) : (
                                    <div className="max-w-2xl mx-auto">
                                        <div className="flex justify-between items-center mb-8">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question {quizState.current + 1} / {QUIZ_DATA.length}</span>
                                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold">Score: {quizState.score}</span>
                                        </div>
                                        <h4 className="text-2xl font-bold mb-10 dark:text-white leading-relaxed">{QUIZ_DATA[quizState.current].question}</h4>
                                        <div className="grid gap-4">
                                            {QUIZ_DATA[quizState.current].options.map((opt, idx) => (
                                                <button 
                                                    key={idx} 
                                                    onClick={() => !quizState.showResult && handleQuizAnswer(opt)} 
                                                    disabled={quizState.showResult} 
                                                    className={`w-full p-6 rounded-2xl text-left font-bold border-2 transition-all relative overflow-hidden ${
                                                        quizState.showResult 
                                                            ? opt === QUIZ_DATA[quizState.current].answer 
                                                                ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400" 
                                                                : "opacity-50 border-transparent bg-gray-50 dark:bg-gray-800" 
                                                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg hover:-translate-y-0.5"
                                                    }`}
                                                >
                                                    <span className="relative z-10 flex justify-between items-center">
                                                        {opt}
                                                        {quizState.showResult && opt === QUIZ_DATA[quizState.current].answer && <CheckCircle className="text-green-500" />}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        {quizState.showResult && (
                                            <div className={`mt-6 font-bold text-lg animate-fade-in-up ${quizState.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                                {quizState.isCorrect ? L.home.quiz_correct : L.home.quiz_incorrect}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 px-4">
                <div className="max-w-2xl mx-auto relative">
                    <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 relative z-10">
                        <h2 className="text-3xl font-black mb-8 text-center dark:text-white">{L.home.contact_title}</h2>
                        <form className="space-y-6" onSubmit={handleContactSubmit}>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_name}</label>
                                <div className="relative"><User className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" name="name" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact_placeholder_name} required /></div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_email}</label>
                                <div className="relative"><MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" name="email" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact_placeholder_email} required /></div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_message}</label>
                                <textarea name="message" rows="5" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact_placeholder_msg} required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1"><Send size={20} />{L.home.contact_send}</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

// ==========================================
// 6. Main App Component (App.jsx)
// ==========================================

const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
    :root { --font-sans: 'Noto Sans JP', sans-serif; }
    body { font-family: var(--font-sans); }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes fadeInUps { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes progress { 0% { width: 0%; margin-left: 0; } 50% { width: 70%; margin-left: 0; } 100% { width: 100%; margin-left: 0; } }
    @keyframes shine { 100% { left: 125%; } }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-progress { animation: progress 1.5s ease-in-out infinite; }
    .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
    .animate-fade-in-up { animation: fadeInUps 0.6s ease-out forwards; }
    .animate-fade-out { animation: fadeOut 0.5s ease-out forwards 1.5s; /* Delay 1.5s then fade */ }
    .animate-shine { animation: shine 1s; }
    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-thumb { background: #8b5cf6; border-radius: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    .glass-panel { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.5); }
    .dark .glass-panel { background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); }
  `}</style>
);

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
  // Loading states
  const [isAppLoading, setIsAppLoading] = useState(true); // Splash screen
  const [isPageLoading, setIsPageLoading] = useState(false); // Navigation bar
  
  const [newsData, setNewsData] = useState([]);
  const [hasUnreadNews, setHasUnreadNews] = useState(false);
  const [user, setUser] = useState(null);

  const L = LANGUAGES[currentLang];

  // --- Initialize Firebase (Safe Mode for Preview) ---
  useEffect(() => {
    const initAuth = async () => {
        try {
            const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
            if(firebaseConfig) {
                 const app = initializeApp(firebaseConfig);
                 const auth = getAuth(app);
                 const db = getFirestore(app);
                 
                 if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                 } else {
                    await signInAnonymously(auth);
                 }
                 onAuthStateChanged(auth, setUser);
            } else {
                console.warn("Firebase config not found. Running in demo mode.");
                setUser({ uid: 'demo-user' });
            }
        } catch (e) {
            console.error("Firebase init failed:", e);
            setUser({ uid: 'demo-user-fallback' });
        }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Initial Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
        try {
            const res = await fetch(`https://api.mcsrvstat.us/bedrock/2/${L.server.ip}:${L.server.port}`);
            const data = await res.json();
            setServerStatus({ online: data.online, players: data.online ? data.players.online : 0, loading: false });
        } catch { setServerStatus({ online: false, players: 0, loading: false }); }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);

    const fetchNews = async () => {
        try {
            const res = await fetch(NEWS_SHEET_URL);
            if (res.ok) {
                const text = await res.text();
                // Google Sheets API returns JSONP, strip function call
                const json = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')));
                if (json.table?.rows) {
                    const parsed = json.table.rows.map((row, i) => ({
                        id: i + 100, date: row.c[0]?.v || '', title: row.c[1]?.v || '', content: row.c[2]?.v || '', url: row.c[3]?.v, type: row.c[2]?.v?.includes('メンテナンス') ? 'maintenance' : 'info'
                    })).filter(i => i.title);
                    setNewsData(parsed.sort((a, b) => b.date.localeCompare(a.date)));
                }
            }
        } catch (e) { console.error("News fetch error", e); }
    };
    fetchNews();
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
       // CopyBox handles its own visual feedback, so we don't strictly need a toast here,
       // but keeping it for global consistency if needed.
       // showToast(L.footer.copy_success); 
    });
  };

  // Enhanced Navigation with Loading Bar
  const handleNavigate = (targetPage, sectionId = null) => {
      if (targetPage === page && !sectionId) return;

      setIsPageLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Simulate loading delay for smooth feel
      setTimeout(() => {
          setPage(targetPage);
          setIsPageLoading(false);
          if (sectionId) {
             setTimeout(() => {
                 const element = document.getElementById(sectionId);
                 if (element) element.scrollIntoView({ behavior: 'smooth' });
             }, 100);
          }
      }, 400);
  };

  const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  // Handle Quiz
  const handleQuizAnswer = (selectedOption) => {
      const isCorrect = selectedOption === L.quiz_data[quizState.current].answer;
      setQuizState({ ...quizState, showResult: true, isCorrect });

      setTimeout(() => {
          if (isCorrect) {
              setQuizState(prev => {
                  const nextIdx = prev.current + 1;
                  if (nextIdx < L.quiz_data.length) {
                      return { ...prev, current: nextIdx, score: prev.score + 1, showResult: false, isCorrect: null };
                  } else {
                      return { ...prev, score: prev.score + 1, finished: true, showResult: false };
                  }
              });
          } else {
               setQuizState(prev => {
                  const nextIdx = prev.current + 1;
                  if (nextIdx < L.quiz_data.length) {
                       return { ...prev, current: nextIdx, showResult: false, isCorrect: null };
                  } else {
                       return { ...prev, finished: true, showResult: false };
                  }
               });
          }
      }, 1500);
  };

  const resetQuiz = () => setQuizState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null });
  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Filter content based on search
  // (Simplified for demo: primarily just filtering news or showing simple results)
  // In a full app, this would route to a Search Results page or filter the current view dynamically.

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <CustomStyles />
      
      {/* 1. Global Loading Overlays */}
      {isAppLoading && <LoadingScreen />}
      <LoadingBar isLoading={isPageLoading} />
      
      {/* 2. Navigation */}
      <Navbar 
        L={L} 
        page={page} 
        navigate={handleNavigate} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        serverStatus={serverStatus}
        hasUnreadNews={hasUnreadNews}
        newsData={newsData}
      />

      {/* 3. Main Content Router */}
      <main className="relative z-10 min-h-screen">
          {page === 'home' && (
              <HomePage 
                L={L} 
                serverStatus={serverStatus} 
                quizState={quizState} 
                setQuizState={setQuizState} 
                resetQuiz={resetQuiz} 
                handleQuizAnswer={handleQuizAnswer} 
                handleCopy={handleCopy} 
                scrollToSection={scrollToSection}
                navigate={handleNavigate}
                activeAccordion={activeAccordion}
                setActiveAccordion={setActiveAccordion}
                showToast={showToast}
                newsData={newsData}
                hasUnreadNews={hasUnreadNews}
              />
          )}
          {page === 'news' && <NewsPage L={L} newsData={newsData} />}
          {page === 'forum' && <ForumPage L={L} user={user} />}
          {page === 'guide' && <GuidePage L={L} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} />}
          {page === 'commands' && <CommandsPage L={L} />}
          {page === 'terms' && <TermsPage L={L} />}
          {page === 'privacy' && <PrivacyPage L={L} />}
      </main>

      {/* 4. Footer */}
      <Footer L={L} navigate={handleNavigate} />
      
      {/* 5. Global Overlays */}
      {toastMessage && <Toast message={toastMessage} />}
      
      {/* Chat Button */}
      <button 
        onClick={() => setIsChatOpen(true)} 
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform hover:shadow-purple-500/50 group"
      >
        <MessageCircle size={28} className="group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
      </button>

      <AIChat L={L} isChatOpen={isChatOpen} closeChat={() => setIsChatOpen(false)} currentLang={currentLang} />
    </div>
  );
}