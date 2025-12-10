import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 環境変数が未設定の場合はコンソールに警告だけ出しておく
  console.warn('Supabase URL または Anon Key が設定されていません (.env を確認してください)');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
