// pages/api/generate.js
// サーバーサイドでのみ実行されるコード (Vercel Serverless Function)

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // CORS設定 (必要に応じて)
  // res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
    return res.status(500).json({ message: 'Server Configuration Error: API Key missing' });
  }

  try {
    // Geminiクライアントの初期化
    const genAI = new GoogleGenerativeAI(apiKey);

    // モデルの取得 (gemini-1.5-flash が現在の標準的な軽量モデル)
    // 2.5-flash は存在しないか、まだ公開されていない可能性があります
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // コンテンツ生成
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 結果をクライアントサイドに返す
    res.status(200).json({ result: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    // エラー詳細を返す（デバッグ用。本番では隠すことも検討）
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
}