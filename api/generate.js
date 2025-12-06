// pages/api/generate.js
// サーバーサイドでのみ実行されるコード

import { GoogleGenAI } from '@google/genai'; // 例: 公式SDKを使用

// 環境変数はサーバーサイドで直接取得できる
const apiKey = process.env.GEMINI_API_KEY; 

if (!apiKey) {
  // 環境変数が設定されていない場合のエラー処理
  throw new Error("GEMINI_API_KEY is not set.");
}

// Geminiクライアントをサーバーサイドでのみ初期化
const ai = new GoogleGenAI({ apiKey });

export default async function handler(req, res) {
  // クライアントサイドから送られてきたプロンプトを受け取る
  const { prompt } = req.body; 

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    // 🚨 秘密のAPIキーを使って、サーバーサイドでGemini APIを呼び出す
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // 結果をクライアントサイドに返す
    res.status(200).json({ result: response.text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}