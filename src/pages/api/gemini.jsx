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