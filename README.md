# Project Rev / Live2D Web版

[![Project Rev Site](https://github.com/pvtkyron/pantry-core/actions/workflows/site.yml/badge.svg)](https://github.com/pvtkyron/pantry-core/actions/workflows/site.yml)

Project Revは静的ファーストのストア/編集サイトです。BlogfaとLive2Dは任意拡張として分離し、どちらが失敗しても主要コンテンツとナビゲーションを残します。

Live2DのSDK系譜は[`Konata09/Live2dOnWeb`](https://github.com/Konata09/Live2dOnWeb)に由来します。Project Rev固有のランタイム、検証、公開ルート、Blogfa連携、保守文書はこのリポジトリで管理します。

## 構成

- `index.html`, `shop.html`, `journal.html`, `about.html`, `faq.html` — 正規の静的ルート。
- `products/`, `posts/` — 製品と記事。
- `assets/rev-editorial-1.css`〜`6.css` — 保守用Editorial CSS。
- `assets/rev-editorial.css` — 6分割ソースから生成する単一配信CSS。
- `assets/live2d-loader.js` — 遅延起動、enable/disable/reset、SDK/runtimeロードを所有する薄いローダー。
- `assets/live2d-runtime.js` — モデル、ツール、tips JSON、listener/timer/fetch/object URLのライフサイクル所有者。
- `assets/blogfa-live2d-addon.js` — Blogfa固有のCDN固定、DOM/CSS、canvas健全性、fail-safe。
- `assets/blogfa-runtime-manifest.json` — Blogfa/runtime世代の単一バージョン源。
- `waifu-tips.json` — 本番tipsデータ。
- `waifu-tips.js` — 旧互換/上流系譜用。現在の本番ランタイムでは実行しません。
- `model/` — SDKv2/v4モデル、テクスチャ、モーション、音声。
- `src/SDKv2/`, `src/SDKv4/` — Live2D SDKソース。上流Core/Frameworkは理由なく短縮・整形しません。
- `dist/live2d_bundle.js` — 生成済みSDKブラウザバンドル。
- `scripts/` — ビルド、静的整合性、runtime contract、実ライフサイクルsmoke等。

## 開発と検証

```bash
npm ci
npm start
npm run build:prod
npm run check:delivery
npm run check:runtime
npm run check:static
npm run check:ja
npm run check:blogfa
npm run check:vnext
npm run check:editorial
```

`check:runtime`は2段です。

1. `check-live2d-runtime.js` — productionがcode-as-text/regex patchへ戻っていないこと、共有API、cleanup、Blogfa委譲等を静的検証。
2. `smoke-live2d-runtime.js` — fake DOM/SDK上で`mount → SDK2→SDK4 → destroy → mount`を実行し、listener/timerが重複しないことを検証。

`check:static`はHTMLの`href/src/poster/srcset`、サイトマップに加え、モデルJSONのpath-bearingフィールドからmoc/texture/motion/sound等の実ファイルを検証します。

## 本番Live2D経路

```text
assets/live2d-loader.js
  ├─ dist/live2d_bundle.js
  └─ assets/live2d-runtime.js
       ├─ waifu-tips.json
       └─ model/
```

通常ページとBlogfaで同じruntimeを使います。`waifu-tips.js`をfetch→regex→eval/Blob実行する経路は本番から除去済みです。

公開API:

- `REV_LIVE2D_LOAD()`
- `REV_LIVE2D_STATUS()`
- `REV_LIVE2D_RESET()`
- `REV_LIVE2D_DISABLE()`
- `REV_LIVE2D_ENABLE()`

自動起動は`saveData`、低速回線、モバイル、`prefers-reduced-motion`を尊重します。

## Blogfa本番経路

```text
blogfa-custom-html-snippet.html
  ├─ assets/blogfa-responsive.js
  ├─ assets/blogfa-supervisor.js
  └─ assets/blogfa-editorial.js
       └─ assets/blogfa-live2d-addon.js
            └─ assets/live2d-loader.js
```

`assets/blogfa-bootstrap.js`と旧widget入口は互換/履歴用です。production entryへ再混入しないことをCIで確認します。

## 配信とセキュリティ

`_headers`はnosniff、referrer/permissions policy、HSTS、cross-domain policy、cache/CORS境界を定義します。CSPは既存inline/外部依存との互換性を別途検証してから導入します。壊れる可能性のあるCSPを見栄えだけで追加しません。

本番依存はCIで`npm audit --omit=dev --audit-level=high`を実行します。古い開発toolchainのmajor更新は、SDK/webpack互換性とlockfileをまとめて検証できる独立変更として扱います。

## 文書

- [アーキテクチャ](docs/ARCHITECTURE.md)
- [Blogfaランタイム](docs/BLOGFA_RUNTIME.md)
- [Live2D保守](docs/LIVE2D_MAINTENANCE.md)
- [デプロイ](docs/DEPLOYMENT.md)
- [トラブルシューティング](docs/TROUBLESHOOTING.md)
- [セキュリティ](SECURITY.md)
