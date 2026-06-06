# katzkawai.github.io

## KKLab — Katz Kawai の個人サイト

ようこそ。このリポジトリは [GitHub Pages](https://katzkawai.github.io/) で公開している個人サイトのソースコードです。Web 制作の練習と実験の記録、そして作ったものの置き場所にしています。

## 特徴

- **素のモダンフロントエンド** — HTML5 / CSS3 / JavaScript のみ。フレームワーク非依存で軽量。
- **レスポンシブデザイン** — CSS 変数・Flexbox・Grid によるモバイル対応レイアウト。
- **PWA** — Service Worker によるオフライン対応と、ホーム画面への追加。
- **アクセシビリティ** — セマンティック HTML、スキップリンク、キーボード操作への配慮。

## ページ構成

| ページ | 内容 |
|--------|------|
| `index.html` | トップ（プロフィール / 作品ギャラリー / 技術タグ） |
| `about.html` | 本サイトについて（目的・作者・使用技術） |
| `contact.html` | お問い合わせフォーム |
| `404.html` / `offline.html` | エラー・オフライン用ページ |

## 使用技術

- HTML5 / CSS3 / Vanilla JavaScript（ES6+）
- PWA（Service Worker + Web App Manifest）
- GitHub Pages によるホスティングと自動デプロイ

## ローカルでの確認

`includes/` の共通パーツを XHR で読み込むため、`file://` ではなく HTTP サーバー経由で開いてください。

```bash
python -m http.server
# → http://localhost:8000
```

## 更新履歴

### 2026年6月
- **6月6日**: favicon と PWA インストール用アイコンを愛犬パピちゃんの画像に設定
- **6月6日**: GitHub Pages 公開作品（33件）をパネル化して掲載し、カテゴリ絞り込みフィルターを追加
- **6月6日**: サイトを全面リニューアル — Bootstrap 4.6 / jQuery を廃止し、素のモダン CSS/JS へ移行。トップをプロフィール中心の構成に変更し、リンク切れ・不要ページを整理

### 2025年11月
- ナビゲーションとフッターを共通コンポーネント化（重複コードの整理）
- タイポグラフィと可読性を改善し、サイトデザインをモダン化

### 2024年10月
- GitHub Pages サイトを初期リリース

## 連絡先

詳細は [Aboutページ](about.html) または [GitHub @katzkawai](https://github.com/katzkawai) へ。
