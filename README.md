# NantetuServer_Develop

## 🚀 プロジェクト概要

このリポジトリは、Minecraft統合版コミュニティサーバー「なんてつサーバー」の公式サイトを、最新のReactフレームワーク（Next.js）へ移行するために開発中のプロジェクトです。

現在のサイトの機能をすべて引き継ぎ、モダンで高速かつ保守性の高いウェブサイト構築を目指しています。

---

## 🛠️ 技術スタック

| 技術 | 用途 |
| :--- | :--- |
| **Framework** | Next.js (React) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Hosting** | Vercel |

## 📦 環境構築とローカルでの実行手順

開発環境をセットアップし、ローカルでサイトを実行するための手順です。

### 前提条件

* Node.js (LTS推奨)
* npm または yarn

### セットアップ

1.  **リポジトリのクローン**
    ```bash
    git clone https://github.com/NANTETU/NantetuServer_Develop.git
    cd NantetuServer_Develop
    ```

2.  **依存関係のインストール**
    ```bash
    npm install
    # または
    # yarn install
    ```

3.  **開発サーバーの起動**
    ```bash
    npm run dev
    # または
    # yarn dev
    ```
    ブラウザで `http://localhost:3000` にアクセスすると、サイトが表示されます。

---

## 📂 主なディレクトリ構造

| ディレクトリ | 役割 |
| :--- | :--- |
| `src/` | クライアントサイドのコード（コンポーネント、ページ、ロジック）を格納。 |
| `src/components/` | 再利用可能なReactコンポーネント。 |
| `src/pages/` | Next.jsのルーティングに対応するページファイル。 |
| `api/` | Next.jsのAPI Routes（サーバーレス関数）。 |
| `public/` | 画像ファイルや静的アセット。 |
| `tailwind.config.js` | Tailwind CSSの設定ファイル。 |

---

## 🤝 コントリビューション (貢献)

バグ報告、機能の提案、コードの修正など、あらゆる貢献を歓迎します。

### コミットメッセージのルール

コミットメッセージは、変更内容を明確にするため、以下のルールに従ってください。（例: Conventional Commitsなど）
* `feat`: 新機能の追加
* `fix`: バグの修正
* `docs`: ドキュメントのみの変更
* `style`: コードのスタイルに関する変更（フォーマットなど）
* `refactor`: リファクタリング（機能変更なし）

### プルリクエスト（PR）の流れ

1.  `main`ブランチから新しいフィーチャーブランチを切る（例: `git checkout -b feature/new-page`）。
2.  コードを修正・追加する。
3.  テストを行い、問題がないことを確認する。
4.  変更をコミットし、プッシュする。
5.  GitHub上でプルリクエストを作成し、レビューを依頼する。

> ⚠️ **注意:** `main`ブランチへの直接のプッシュは禁止されています。必ずPRを作成してください。

---

## 🔗 リンク

* **開発版デプロイ先:** [nantetu.vercel.app](https://nantetu.vercel.app)
* **本番サイト (旧版):** [https://nantetu-server.vercel.app/](https://nantetu.vercel.app/) 
* **なんてつサーバー Discord:** [https://discord.gg/79H7Jy65nz](https://discord.gg/79H7Jy65nz)

---

© 2025 Nantetu Server.
