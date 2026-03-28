# ドキュメント索引

開発・設計の整理用ドキュメントです。利用者向けの手早い導入はルートの [README.md](../README.md) を参照してください。

| ドキュメント | 内容 |
|--------------|------|
| [product-scope.md](./product-scope.md) | 目的、想定利用シーン、**やらないこと**（スコープ外） |
| [feature-matrix.md](./feature-matrix.md) | 機能を領域別に整理した一覧（実装済みの単一情報源） |
| [backlog.md](./backlog.md) | 未実装のアイデア・パターン案（優先度は都度更新） |
| [architecture.md](./architecture.md) | ソース構成、ビルド、スタイル、公開境界 |
| [PUBLISHING.md](./PUBLISHING.md) | npm 公開チェックリスト |

## 運用メモ

- API の表や props の**利用者向け**説明は README に集約し、こちらは**何ができて何を狙っていないか**の整理を主とします。
- 新機能をマージする際は [feature-matrix.md](./feature-matrix.md) を更新し、計画段階のアイデアは [backlog.md](./backlog.md) と突き合わせて完了／保留を更新してください。
