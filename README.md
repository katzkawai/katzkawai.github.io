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
| `index.html` | トップ（プロフィール / 取り組み / 技術タグ） |
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

## 連絡先

詳細は [Aboutページ](about.html) または [GitHub @katzkawai](https://github.com/katzkawai) へ。
