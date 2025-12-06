// pages/api/admin-login.js
// サーバーサイドでのみ実行されるファイル

export default function handler(req, res) {
  // Vercelの環境変数からADMIN_KEYを取得
  const secretAdminKey = process.env.ADMIN_KEY;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { keyInput } = req.body;

  if (!secretAdminKey) {
    // Vercel環境変数ADMIN_KEYが未設定の場合
    return res.status(500).json({ success: false, message: '【サーバー設定エラー】ADMIN_KEYがサーバーに設定されていません。' });
  }

  // サーバー側で比較（最も重要なセキュリティ機能）
  if (keyInput === secretAdminKey) {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    // 認証失敗
    res.status(401).json({ success: false, message: '管理キーが違います' });
  }
}