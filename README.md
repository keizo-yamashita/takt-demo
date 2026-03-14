# TAKT 学習用デモプロジェクト

[TAKT](https://github.com/nrslib/takt)（Agent Koordination Topology）の動作と設定を学ぶためのリポジトリ。

## TAKT とは

TAKT は AI コーディングエージェント（Claude Code, Codex, OpenCode, Cursor, GitHub Copilot CLI）を YAML 定義のワークフローで制御するオーケストレーションツール。音楽のメタファーを使い、**piece**（楽曲 = ワークフロー）と **movement**（楽章 = ステップ）でエージェントの動作を構造化する。

## セットアップ

```bash
# TAKT のインストール
npm install -g takt

# このプロジェクトのセットアップ
npm install
npm run build
npm run start
```

### TAKT の設定

```bash
# ~/.takt/config.yaml を作成
mkdir -p ~/.takt
cat > ~/.takt/config.yaml << 'EOF'
provider: claude
model: sonnet
language: ja
EOF
```

または API キーを環境変数で設定:

```bash
export TAKT_ANTHROPIC_API_KEY=sk-ant-...
```

## プロジェクト構成

```
takt-demo/
├── src/
│   ├── todo.ts          # 学習用 Todo アプリ（TAKT で機能追加する対象）
│   └── index.ts         # エントリーポイント
├── pieces/              # TAKT piece ファイル（段階的に学ぶ）
│   ├── 01-minimal.yaml       # 最小構成: 実装のみ
│   ├── 02-plan-implement.yaml # 計画 → 実装
│   ├── 03-with-review.yaml    # 計画 → 実装 → レビュー（fix loop）
│   ├── 04-multi-review.yaml   # 複数レビュアーによる段階レビュー
│   └── 05-test-first.yaml     # TDD スタイル
└── README.md
```

## 学習ガイド

### Step 1: TAKT の基本概念

| 用語 | 音楽メタファー | 意味 |
|------|---------------|------|
| **piece** | 楽曲 | ワークフロー全体の定義 |
| **movement** | 楽章 | ワークフロー内の1ステップ |
| **persona** | 演奏者 | そのステップを担当するエージェントの役割 |
| **rules** | 楽譜の指示 | 次にどの movement に進むかの条件 |

### Step 2: piece ファイルを読む（01 → 05 の順）

#### 01-minimal.yaml — 最小構成
- movement が1つだけ（implement）
- `edit: true` でコード編集が許可される
- 実装完了で `COMPLETE` になる

#### 02-plan-implement.yaml — 2ステップ
- `planner`（edit: false）→ `coder`（edit: true）
- **ポイント**: `edit` フラグで読み取り専用 / 編集可能を制御

#### 03-with-review.yaml — レビューと fix loop
- review movement で `Approved` → 完了、`Needs fix` → implement に戻る
- **ポイント**: rules の `next` で分岐を制御。`COMPLETE` / `ABORT` は特殊な終了状態

#### 04-multi-review.yaml — 複数レビュアー
- architect → security-reviewer の順にレビュー
- 各レビュアーが異なる観点でチェック
- **ポイント**: 複数の movement を直列に繋いで多段レビューを実現

#### 05-test-first.yaml — TDD スタイル
- plan → write-tests → implement → review
- レビュアーが `Tests inadequate` と判断すると write-tests に戻る
- **ポイント**: 3つ以上の分岐先を持つ rules

### Step 3: 実際に TAKT を使ってみる

```bash
# 1. 対話モードで起動（piece を選んでタスクを定義）
takt

# 2. タスクの例: 「Todo に優先度（priority）フィールドを追加して」
#    AI が要件を整理 → /go でキューに追加

# 3. キューのタスクを実行
takt run

# 4. 結果を確認（マージ、リトライ、削除）
takt list
```

### Step 4: piece をカスタマイズする

```bash
# ビルトインの piece をコピーして編集
takt eject default

# カスタム persona を作成
# ~/.takt/personas/my-reviewer.md にマークダウンで定義
```

## 主要な設定オプション

| フィールド | 説明 | 例 |
|-----------|------|-----|
| `name` | piece の名前 | `plan-implement-review` |
| `initial_movement` | 最初に実行する movement | `plan` |
| `max_movements` | movement の最大実行回数（無限ループ防止） | `10` |
| `persona` | movement を担当するエージェントの役割 | `coder`, `reviewer` |
| `edit` | コード編集の許可 | `true` / `false` |
| `required_permission_mode` | 必要な権限モード | `edit` |
| `rules[].condition` | 次に進む条件 | `Approved`, `Needs fix` |
| `rules[].next` | 遷移先（movement 名 or `COMPLETE` / `ABORT`） | `review`, `COMPLETE` |

## 参考リンク

- [TAKT GitHub](https://github.com/nrslib/takt)
- [Piece Guide](https://github.com/nrslib/takt/blob/main/docs/pieces.md)
- [CLI Reference](https://github.com/nrslib/takt/blob/main/docs/cli-reference.md)
- [Configuration Guide](https://github.com/nrslib/takt/blob/main/docs/configuration.md)
- [Faceted Prompting](https://github.com/nrslib/takt/blob/main/docs/faceted-prompting.md)
