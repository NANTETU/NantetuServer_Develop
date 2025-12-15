import React, { useState, useEffect, useRef } from 'react';
import { Zap, Trash2, X } from 'lucide-react';

export const AIChat = ({ L, isChatOpen, closeChat, currentLang, user, profile }) => {
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

        try {
            const systemPrompt = `
            あなたは「なんてつサーバー」の公式AIアシスタントです。
            以下の情報を元に、ユーザーの質問に親切に答えてください。
            また、嘘の情報を言わずに、本当の情報だけを言い、サーバーに関係のない話には、「私は なんてつサーバー 以外の情報は提供できません。」と答えましょう。
            そして、回答する際、極力500トークン以内で回答するようにしてください。

            【サーバー情報】
            - 統合版(Bedrock)専用
            - IP: ${L.server.ip}
            - Port: ${L.server.port}
            - 参加タグ: ${L.server.tag}
            - 特徴: 土地保護あり、荒らし対策ログ完備、Discord連携、Java版のような機能(/tpa, /home等)

            【ルール】
            - 荒らし、窃盗、チート禁止（永久BAN）
            - 差別発言、ハラスメント禁止
            - 他人の拠点から5マス以上離れて建築すること

            【コマンド】
            移動・テレポート系 (Essentials)
            - /tpa <プレイヤー名>
            - 指定したプレイヤーにテレポートをリクエストします。

            - /tpaccept
            - /tpa のリクエストを承認します。

            - /tpdeny
            - /tpa のリクエストを拒否します。

            - /back
            - 最後にテレポートした場所、または死んだ場所に戻ります。

            - /sethome
            - 現在地をホームポイントとして設定します。

            - /home
            - 設定したホームにテレポートします。

            - /spawn
            - サーバーの初期スポーン地点に戻ります。

            - /warp
            - 運営が設定した公共施設へ移動します。

            領地・保護・ログ系 (Territory / Tianyan)
            - /tty
            - 自分の領地として設定します。(事前に範囲座標のメモが必要)

            - /tygui
            - 監査ログをGUIで確認します。荒らし特定に便利です。

            - /ty x y z <時間> <半径>
            - チャットで検索し監査ログを確認します。（上級者向け）

            経済・コミュニケーション (UMoney / Essentials)
            - /um
            - 自分の所持金（マネー）を確認します。

            - /um → <送金>
            - 指定したプレイヤーにお金を送金します。

            - /um → <ランキング>
            - 所持金のサーバー内ランキングを確認します。

            - /msg <プレイヤー名> <内容>
            - 指定したプレイヤーに個人メッセージ（DM）を送ります。

            - /ping
            - サーバーとの接続遅延(Ping値)を確認します。

            - /notice
            - サーバーからのお知らせを確認します。

            ロールプレイ系 (RolePlay)
            - /e <アクション>
            - チャットにアクション（感情表現）を送信します。（例: /e happy）

            【初心者ガイド】
            - スポーンしたら混雑していない場所へ移動
            - 5ブロック離れて建築
            - /ttyで土地保護
            - Discordに参加推奨
            `;

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `
                System Prompt: ${systemPrompt}
                User Message: ${input.trim()}
                `
                })
            });

            const data = await response.json();
            const reply = data.result || "すみません、うまく答えられませんでした。";

            setChatHistory(prev => [...prev, { role: 'model', text: reply }]);
        } catch (error) {
            console.error("AI Error:", error);
            setChatHistory(prev => [...prev, { role: 'model', text: "エラーが発生しました。時間を置いて再試行してください。" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => setChatHistory([]);
    if (!isChatOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex md:justify-end animate-fade-in" onClick={closeChat}>
            <div
                className="bg-white dark:bg-gray-900 w-full md:w-[420px] md:max-w-md h-full flex flex-col shadow-2xl transform transition-all duration-300 ease-out border-l border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-in-bottom md:animate-slide-in-right"
                onClick={(e) => e.stopPropagation()}
            >
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
                            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400"><Zap size={40} /></div>
                            <h4 className="font-bold text-lg mb-2">何でも聞いてください</h4>
                            <p className="text-sm">サーバーのルールやコマンドについて<br />AIがお答えします。</p>
                        </div>
                    ) : (
                        chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && <div className="flex justify-start"><div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-2 items-center text-xs text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">Thinking...<div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div></div></div>}
                </div>
                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"><div className="relative"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="メッセージを入力..." className="w-full pl-5 pr-12 py-3.5 rounded-full bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border focus:border-purple-500 outline-none dark:text-white transition-all shadow-inner" /><button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-2 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md"><Zap size={20} className={isLoading ? "animate-pulse" : ""} /></button></div></form>
            </div>
        </div>
    );
};
