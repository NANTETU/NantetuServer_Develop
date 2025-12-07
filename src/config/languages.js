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
            articles: "記事",
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
            explanation: "解説",
            recruitment: "募集",
            other: "その他",
            fetch_error: "お知らせの読み込みに失敗しました。",
            link_text: "リンクを開く",
            default_data: [],
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
            explanation: "Explanation",
            recruitment: "Recruitment",
            other: "Other",
            fetch_error: "Failed to load announcements.",
            link_text: "Open Link",
            default_data: [],
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