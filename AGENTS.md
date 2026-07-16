# AGENTS.md

AI コーディングエージェント向けのプロジェクトガイド。このリポジトリに初めて触れる読者を対象とする。

## プロジェクト概要

- **KKLab** — Katz Kawai の個人サイト（ポートフォリオ兼実験場）。公開先: https://katzkawai.github.io/ （`CNAME` にカスタムドメイン `katzkawai.org`）。
- **ビルドシステムなし・依存関係なし**。`package.json` 等のマニフェストは存在しない。手書きの HTML5 / CSS3 / バニラ JavaScript をそのまま GitHub Pages が `main` ブランチから配信する。コミット&プッシュがそのままデプロイ。
- 2026年6月のリニューアルで Bootstrap / jQuery は廃止済み。フレームワークを再導入しないこと。
- **PWA 対応**: `manifest.json` + Service Worker（`sw.js`）+ オフラインページ（`offline.html`）。
- サイトの言語は**日本語**（`<html lang="ja">`）。README・コードコメントも日本語が主体（`js/components.js` のみ英語コメント）。

## ディレクトリ構成

```
/                  HTML ページはすべてルートに置く（index / about / contact / 404 / offline）
includes/          共通パーツ（navbar.html, footer.html）
js/                components.js（パーツ読み込み）, main.js（共通 UI ロジック）
style.css          単一スタイルシート。`:root` にデザイントークンを定義
imgs/              画像類（favicon、PWA アイコン等）
sw.js              Service Worker
manifest.json      Web App Manifest
sitemap.xml / robots.txt / CNAME / favicon.ico
```

## コマンド

```bash
# ローカルプレビュー（file:// では XHR がブロックされるため必ず HTTP 経由で）
python -m http.server
# → http://localhost:8000
```

ビルド・テスト・リントのコマンドは存在しない。HTML の検証は W3C バリデータ（https://validator.w3.org/）を使う。

## アーキテクチャ

### クライアントサイド・インクルード（最重要）

サーバーサイドのテンプレートはない。各ページは `<div id="navbar-placeholder">` / `<div id="footer-placeholder">` を置き、`js/components.js` が DOMContentLoaded 時に `includes/navbar.html` / `includes/footer.html` を XHR で取得して `outerHTML` で置き換える。読み込み後、`window.location.pathname` の末尾と `.nav-menu a` の href を照合して現在地リンクに `aria-current="page"` を付与する（サブディレクトリ用に `../` の basePath 分岐あり）。

- **ナビ/フッターを変えるときは `includes/` だけを編集する。** 個別ページ内の chrome を直接編集してはいけない。
- **スクリプトの読み込み順は `components.js` → `main.js`**（全ページ共通）。`main.js` は注入後の要素に備えてイベント委譲を使っている。

### js/main.js（全ページで実行、要素の有無でガード済み）

DOMContentLoaded で起動:

- **作品フィルター**（`index.html`）: `.filter-btn[data-filter]` クリックで `.work-card[data-category]` を表示/非表示。`aria-pressed` も同期。
- **スクロール演出**: 任意の要素に `reveal` クラスを付けると IntersectionObserver で `in` が付きフェードイン（未対応ブラウザは即 `in` 付与）。
- **トップへ戻るボタン**: JS が動的生成（HTML 側に要素は不要）。300px スクロールで表示。
- **お問い合わせフォーム検証**（`contact.html` の `#contactForm`）: メール形式チェック、本文10文字以上。action URL に `YOUR_FORM_ID` が含まれる場合は送信をブロック。
- **Service Worker 登録**: window load 時に `/sw.js` を登録。

加えて、`document` 上の単一の委譲 click リスナーで以下を処理（navbar が後から注入されるため委譲必須）:

- モバイルメニュー: `.nav-toggle` ↔ `#nav-menu.open` と `aria-expanded`。メニュー内リンク押下で閉じる。
- **モーダル**: ネイティブ `<dialog>`。`data-open-dialog="#id"` で開き、`data-close-dialog` で閉じる（例: `contact.html` のプライバシーポリシー）。

### デザインシステム（style.css）

CSS フレームワークなしの単一ファイル。色・影・角丸は `:root` のカスタムプロパティを**ハードコードせず再利用**する:

- `--accent: #7c3aed` / `--accent-2: #ec4899` / `--accent-grad`（135deg の紫→ピンクのグラデーション）/ `--accent-glow`
- `--bg` `--surface` `--text` `--muted` `--border`
- `--shadow-sm` `--shadow` `--shadow-lg`
- `--radius: 16px` / `--radius-sm: 10px` / `--container: 1040px` / `--header-h: 64px`

レイアウトは Flexbox/Grid、`.container` で `--container` 幅に中央寄せ。`@media (prefers-reduced-motion: reduce)` 対応あり。`.skip-link` スタイル定義済み。

### PWA / Service Worker（sw.js）

- `CACHE_NAME = 'kklab-cache-v4'`。cache-first + ランタイムキャッシュ（status 200 かつ type `basic` のみ保存）。ナビゲーションリクエストのオフライン時は `/offline.html` にフォールバック。
- **`urlsToCache` はハードコードのプリキャッシュリスト**（`/`、4 HTML ページ、`style.css`、`js/*.js`、`includes/*.html`）。コアページ/アセットを追加したら**リストに追加し、`CACHE_NAME` をバンプ**する（activate 時にホワイトリスト外の旧キャッシュを削除する仕組み）。
- `offline.html` は意図的に自己完結（インラインスタイルのみ、スクリプトなし）— `style.css` 非依存なので依存を追加しない。

### contact.html のフォームはプレースホルダ

`action="https://formspree.io/f/YOUR_FORM_ID"` のままで、JS が `YOUR_FORM_ID` を検出して送信をブロックする。実運用するには Formspree の ID に差し替えること。

## ページ追加・削除時の同期チェックリスト

以下をすべて更新する:

1. `includes/navbar.html` と `includes/footer.html`
2. `sw.js` — `urlsToCache` 配列 + `CACHE_NAME` のバンプ
3. `manifest.json` — `shortcuts` 配列
4. `sitemap.xml`

## コーディング規約

- HTML5、UTF-8、`<html lang="ja">`、インデント 4 スペース、ダブルクォート。
- セマンティックランドマーク（`<header>` / `<main>` / `<footer>`）、スキップリンク（`<a href="#main-content" class="skip-link">`）と `id="main-content"`、`aria-*` を維持する。アクセシビリティを損なわないこと。
- クラス名は説明的な kebab-case。
- ファイル配置: HTML はルート、画像は `imgs/`、共通パーツは `includes/`、スクリプトは `js/`。
- JS はバニラで書く（現状は `var` と関数式中心の ES5 寄りスタイル）。コメントは日本語で。
- コミットは `main` へのプッシュがそのまま本番デプロイになる点に注意。

## テスト / CI

- 自動テスト・リント・ビルドの CI は**存在しない**。確認は `python -m http.server` での手動プレビューと W3C バリデータで行う。
- 唯一のワークフローは `.github/workflows/claude.yml` — issue / PR コメント等に `@claude` を含む投稿があると `anthropics/claude-code-action` を実行するだけ（サイトの品質ゲートではない）。

## セキュリティ上の注意

- 秘密情報・API キーは管理していない（ワークフローが使う `ANTHROPIC_API_KEY` は GitHub Secrets 側）。リポジトリに認証情報を置かないこと。
- 外部リンクは `target="_blank"` と `rel="noopener"` をセットにする（既存のフッターに倣う）。
- フォーム送信先は Formspree 前提。別の送信先に変える場合は `main.js` の `YOUR_FORM_ID` チェックも見直すこと。
