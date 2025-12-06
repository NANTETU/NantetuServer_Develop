// pages/api/admin-login.js
export default function handler(req, res) {
  // ① CORSプリフライト・リクエスト (OPTIONS) を処理する
  if (req.method === 'OPTIONS') {
    // プリフライトが成功したことをブラウザに伝える
    // 適切なCORSヘッダーを設定している場合、ここで 200 を返せばOK
    return res.status(200).end();
  }

  // ② POST メソッド以外のリクエストを弾く
  if (req.method !== 'POST') {
    // POSTとOPTIONS以外のリクエストは 405 で弾く
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // ----------------------------------------------------
  // 以下、POSTリクエストの本処理
  // ----------------------------------------------------

  const secretAdminKey = process.env.ADMIN_KEY;
  
  const { keyInput } = req.body;

  if (!secretAdminKey) {
    return res.status(500).json({ success: false, message: '【サーバー設定エラー】ADMIN_KEYがサーバーに設定されていません。' });
  }

  // サーバー側で比較
  if (keyInput === secretAdminKey) {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    // 認証失敗
    res.status(401).json({ success: false, message: '管理キーが違います' });
  }
}