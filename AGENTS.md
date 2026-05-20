# AGENTS.md

このファイルは `/Users/mority/symphony-demo` 配下のプロジェクトスコープ規約です。

## TypeScript コード規約

### 基本方針

- TypeScript は「型で設計意図を表現し、実行時境界で検証する」方針で書く。
- Enterprise 環境での保守性、監査性、変更容易性を優先し、暗黙の挙動や属人的な慣習に依存しない。
- 公式ドキュメントや主要エコシステムの推奨に従う。ただし、導入により既存アーキテクチャ、CI、実行環境と矛盾する場合は、理由を明記して段階導入する。

### TypeScript 設定

- `tsconfig.json` は `strict: true` を前提にする。
- 原則として以下を有効化する。
  - `noImplicitAny`
  - `strictNullChecks`
  - `strictFunctionTypes`
  - `noUncheckedIndexedAccess`
  - `noImplicitOverride`
  - `exactOptionalPropertyTypes`
  - `useUnknownInCatchVariables`
  - `forceConsistentCasingInFileNames`
- `skipLibCheck` はビルド速度や依存関係の事情で許容してよいが、自プロジェクトの型エラーを隠す目的では使わない。
- `any` は原則禁止する。やむを得ず使う場合は、境界コードに限定し、理由をコメントまたは近接する型定義で説明する。
- 外部入力、API レスポンス、環境変数、ファイル、DB、メッセージキューなどの信頼境界では、TypeScript 型だけに依存せず実行時バリデーションを行う。

### 型設計

- 公開 API、モジュール境界、永続化データ、イベント、ジョブ、権限、認可条件は明示的な型を定義する。
- `unknown` を受け取り、検証後に具体型へ絞り込む。未検証データを直接アプリケーション内部の型として扱わない。
- nullability は明示する。`null` / `undefined` / 空文字列 / 空配列を同じ意味として扱わない。
- Union 型、Discriminated Union、`readonly`、`as const` を活用し、状態や権限を表現する。
- 型アサーション `as` は最後の手段とする。使用時は、直前で検証済みであることが読み取れる構造にする。
- `enum` は相互運用や既存設計で必要な場合に限定し、通常は literal union または `as const` オブジェクトを優先する。

### Lint / Format

- ESLint は `@typescript-eslint` の型情報を使う設定を基本とする。
- 推奨ルールは、公式の recommended / strict / stylistic 系を土台にし、プロジェクトの実行環境に合わせて調整する。
- Prettier などの formatter を使う場合、整形責務は formatter に寄せ、ESLint と整形ルールを競合させない。
- TypeScript パッケージ管理は `pnpm` を標準とし、`npm install` / `npm ci` / `npm audit` は原則使用しない。既存資産が `npm` 前提の場合は、`pnpm` 移行計画と互換性リスクを明記して段階導入する。
- CI では最低限、以下を別ステップで実行できるようにする。
  - 型チェック: `tsc --noEmit`
  - Lint: `eslint`
  - Test: プロジェクト標準のテストコマンド
  - Security audit / dependency scan: `pnpm audit`、Aikido Safe Chain、またはプロジェクトで採用している SCA ツール
- Lint の無効化コメントは最小範囲に限定し、理由を併記する。

### セキュリティ

- 秘密情報、認証トークン、API キー、Cookie、Authorization ヘッダー、個人情報をログ、エラー、UI、テストスナップショット、成果物に出力しない。
- `.env` および `.env.*` の中身は確認しない。必要な値はユーザまたは安全な secret 管理基盤から取得する。`.env.example` のみ参照可能とする。
- 環境変数は起動時にスキーマ検証し、アプリ内部では検証済み設定オブジェクト経由で参照する。
- 入力値は信頼境界で検証し、SQL、シェル、HTML、URL、ファイルパス、テンプレート、正規表現に渡す前に用途別に安全化する。
- SQL はパラメータ化クエリまたは ORM の安全な API を使い、文字列連結で組み立てない。
- シェル実行は原則避ける。必要な場合は引数配列を使い、ユーザ入力をコマンド文字列へ連結しない。
- SSR / API / Worker / CLI など実行境界ごとに権限を最小化し、クライアントへ server-only な値を渡さない。
- 依存関係は固定または lockfile で再現可能にし、脆弱性修正は通常の機能変更と分離して扱う。
- TypeScript 依存関係の追加・更新・CI インストールでは、Aikido Safe Chain を `pnpm` の前段に適用し、マルウェア、typosquatting、dependency confusion、侵害済みリリース、悪意ある install script の混入リスクを低減する。
- 新規依存関係の導入時は、パッケージ名の類似性、メンテナ、公開時期、ダウンロード傾向、リポジトリ/配布物の不一致、postinstall 等の lifecycle script、不要に広い権限やネットワークアクセスを確認する。
- lockfile 差分はレビュー対象とし、意図しない transitive dependency の増加、レジストリ変更、解決先 URL の変化、preinstall/postinstall を持つ依存の追加を重点確認する。

### エラー処理とログ

- 例外は握りつぶさない。復旧可能なエラー、入力エラー、外部サービス障害、内部バグを区別する。
- `catch` では `unknown` として受け、型を絞り込んで扱う。
- ログにはリクエスト ID、ジョブ ID、ユーザ ID などの追跡可能な参照情報を含める。ただし秘密値や不要な個人情報は含めない。
- ユーザ向けエラーメッセージと内部ログを分離し、内部実装や secret が漏れないようにする。

### 非同期処理

- Promise の取りこぼしを禁止する。意図的に待たない処理は `void` を付け、失敗時の観測方法を用意する。
- タイムアウト、キャンセル、リトライ、冪等性が必要な外部通信では、呼び出し側または共通クライアントで明示的に扱う。
- 並列実行では共有状態の変更を避け、競合が起きる場合はロック、トランザクション、キュー、idempotency key を使う。

### モジュール設計

- ドメインロジック、I/O、フレームワーク依存、UI 表示、永続化を過度に混在させない。
- 公開関数は入力、出力、失敗条件が読み取れる名前と型にする。
- 循環依存を避ける。共通型やユーティリティは依存方向が明確な場所に置く。
- barrel export は依存関係を不透明にしやすいため、公開 API を整理する目的に限定する。

### テスト

- 型で防げない境界、権限、入力検証、失敗系、外部サービス連携、データ変換を優先してテストする。
- テストデータに実 secret、実トークン、実個人情報を使わない。
- セキュリティ上重要な redaction、認可、入力検証は回帰テストを用意する。
- Snapshot は差分確認に有効な場合のみ使い、秘密情報や不安定な値を含めない。

### レビュー基準

- 型エラー、Lint エラー、テスト失敗、セキュリティスキャンの重大指摘が残った状態で完了扱いにしない。
- `any`、型アサーション、Lint 無効化、未検証入力、動的 import、シェル実行、権限変更、ログ追加はレビューで重点確認する。
- 仕様変更、権限変更、データモデル変更、外部公開 API 変更は、実装だけでなく移行手順と後方互換性を確認する。

### 推奨される標準コマンド

プロジェクトに該当スクリプトが存在する場合、変更後は以下を実行する。

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm test
pnpm audit
```

Aikido Safe Chain が導入済みの環境では、通常どおり `pnpm` コマンドを実行してよい。未導入の環境では、依存関係の追加・更新・CI インストール前に Safe Chain のセットアップを検討し、導入できない場合は理由と代替の SCA / malware scan を記録する。

`turbo`、`nx`、`vitest`、`jest` などを採用している場合も、パッケージ管理は `pnpm` を入口にし、プロジェクト標準の同等コマンドを優先する。
