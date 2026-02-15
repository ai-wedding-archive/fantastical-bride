# 🕊️ AI Wedding Dress Book

**幻想的な花嫁のドレス図鑑** — AIが描き出す、夢のようなウェディングドレスのギャラリーサイトです。

🔗 **サイトURL**: `https://tks36400-create.github.io/ai-weddingdress-book/`

---

## 📸 新しいドレスを追加する方法

GitHubのウェブ画面だけで更新できます。コマンドラインは不要です。

### ステップ1: 画像をアップロード

1. このリポジトリの **[`photos` フォルダ](./photos/)** を開く
2. 右上の **「Add file」→「Upload files」** をクリック
3. ドレス画像をドラッグ＆ドロップする
4. ファイル名は `dress-004.webp` のように連番にする（jpg/pngも可）
5. 下の **「Commit changes」** ボタンをクリック

### ステップ2: index.html にカードを追加

1. リポジトリのトップに戻り、**`index.html`** をクリック
2. 右上の **✏️（鉛筆アイコン）**をクリックして編集モードにする
3. `<!-- ドレスカード テンプレート -->` コメントの下に、以下のHTMLブロックをコピー＆ペーストする：

```html
<article class="dress-card" data-index="4">
  <div class="card-image-wrap">
    <img src="photos/dress-004.webp" alt="Vol.4 — ここにタイトル" loading="lazy">
    <div class="card-overlay">
      <span class="overlay-icon">✦</span>
      <span class="overlay-text">Details</span>
    </div>
  </div>
  <div class="card-info">
    <span class="card-vol">Vol. 4</span>
    <h2 class="card-title">ここにタイトル</h2>
    <p class="card-date">2026.02.18</p>
  </div>
</article>
```

4. `data-index="4"` の数字を連番に変更する
5. 画像ファイル名・タイトル・日付を書き換える

### ステップ3: ドレスデータに説明を追加

同じ `index.html` の中にある `dressData` 配列に、以下のJavaScriptオブジェクトを追加する：

```javascript
{
  vol: "Vol. 4",
  title: "ここにタイトル",
  date: "2026.02.18",
  image: "photos/dress-004.webp",
  points: [
    {
      tag: "Silhouette",
      title: "ポイント1のタイトル",
      body: "ポイント1の説明文をここに書く。"
    },
    {
      tag: "Detail",
      title: "ポイント2のタイトル",
      body: "ポイント2の説明文をここに書く。"
    },
    {
      tag: "Material",
      title: "ポイント3のタイトル",
      body: "ポイント3の説明文をここに書く。"
    }
  ],
  inspiration: "インスピレーション元の説明をここに書く。"
}
```

### ステップ4: 変更を保存

1. 右上の **「Commit changes...」** ボタンをクリック
2. コミットメッセージに「Vol.4 追加」など分かりやすいメッセージを入力
3. **「Commit changes」** をクリック

✅ 数分後にサイトに反映されます！

---

## 📁 ファイル構成

```
ai-weddingdress-book/
├── index.html      ← ギャラリーサイト本体
├── style.css       ← デザイン（白ベース・ドロップシャドウ）
├── photos/         ← ドレス画像を保存するフォルダ
│   ├── dress-001.webp
│   ├── dress-002.webp
│   └── ...
└── README.md       ← このファイル
```

## 🎨 デザインについて

- **フォント**: Cormorant Garamond（英語） × Noto Serif JP（日本語）
- **カラー**: 白ベース × ゴールドアクセント
- **写真表示**: 枠なし・自然なドロップシャドウで浮かび上がる表現
- **インタラクション**: カードクリックで詳細がモーダル表示

---

> すべての画像はAIによって生成されたものであり、実在するドレスデザインではありません。