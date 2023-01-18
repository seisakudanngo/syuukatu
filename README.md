# 目次
- [環境構築(GitHubから)](#環境構築githubから)
    - [Node.js推奨版をダウンロード+インストール](#nodejs推奨版をダウンロードインストール)
    - [GitHub Desktopをダウンロード+インストール](#github-desktopをダウンロードインストール)
    - [VSCodeでビルド](#vscodeでビルド)
- [環境構築(最初から) ](#環境構築最初から)
    - [Node.js推奨版をダウンロード+インストール](#nodejs推奨版をダウンロードインストール-1)
    - [Nuxt3インストール](#nuxt3インストール)
    - [~~srcフォルダーの作成~~](#srcフォルダーの作成-※必要なかった)※必要無いから消した
    - [~~Vuetifyインストール~~](#vuetifyインストール-※重たいから抜いた)※重たいから抜いた
    - [Bootstrap5インストール](#bootstrap5インストール)
    - [sassインストール](#sassインストール)
    - [@mdi/fontインストール](#mdifontインストール)
    - [~~remixiconと~~boxiconのインストール](#remixiconとboxiconのインストール)※remixiconだけ消した
    - [ESLintの導入](#eslintの導入)
    - [tiptapのインストール](#tiptapのインストール)
    - [yjsのインストール](#yjsのインストール)
    - [~~nuxt/contentのインストール~~](#nuxtcontentのインストール※必要無いから消した)※必要無いから消した
    - [firebaseのインストール](#firebaseのインストール)
    - [Firebase開発手順](#firebase開発手順)
    - [npm-run-allのインストール](#npm-run-allのインストール)
    - [テストする](#テストする)
- [パッケージの使い方に困ったとき](#パッケージの使い方に困ったとき)
---


# 環境構築(GitHubから)
### Node.js推奨版をダウンロード+インストール
- >https://nodejs.org/ja/download/

### GitHub Desktopをダウンロード+インストール
1. >https://desktop.github.com/
2. [Clone a Repository from the internet]を選択
3. Local Path -> Cドライブ直下のフォルダを指定(今回だと**test**)
4. Your repositories -> take1-stock/browse-productsを選択 -> [Clone]をクリック<br>![image](https://user-images.githubusercontent.com/105027725/203961492-3b270a42-f00b-48cc-aa9f-7aa0fd7bffb2.png)
   <br>(File -> Clone repositoryでも同じ画面が出ます)
### VSCodeでビルド
1. VSCode フォルダーを開く -> Cloneした[browse-products]フォルダを選択
2. [Ctrl + @] -> [ターミナル]タブ
3. ```npm install``` を入力して実行
4. ```npm start``` を入力して実行
5. [Vite client warmed up in ??? ms]と表示されたら開始<span style="color: red; ">(かなり時間かかる)</span>
6. .envを作成([firebaseのインストール](#firebaseのインストール) -> [Firebase開発手順](#firebase開発手順))の順に実行
7. http://localhost:3000/init-firestore を開く -> (初期化ボタン)を押す
8. http://localhost:3000/displayTeams?grade=1 を開く
9. (1学年 2022年 Aチーム) のポスターが表示されていたら成功
<br>
<br>

# 環境構築(最初から)
インストール手順
### Node.js推奨版をダウンロード+インストール
>https://nodejs.org/ja/download/

### Nuxt3インストール
1. ```$ npx nuxi init browse-products```
2. ```$ cd browse-products```
3. ```$ npm install ```
4. ```$ npm run dev```

### ~~srcフォルダーの作成~~ ※必要なかった
1. ~~srcフォルダーを作成~~
2. ~~app.vueを移動~~
3. ~~nuxt.config.tsに ```rootDir: "src"``` を追記~~
>~~引用 : https://qiita.com/teracy164/items/97f35b1550cd2080197b~~

### ~~Vuetifyインストール~~ ※重たいから抜いた
1. ```$ npm install -D vuetify@next @mdi/font sass```
2. **plugins** フォルダー作成 -> **vuetify.ts** ファイル作成
3. ```ts
    // vuetify.tsに書き込む
    import { createVuetify } from "vuetify";
    import * as components from "vuetify/components";
    import * as directives from "vuetify/directives";

    export default defineNuxtPlugin((nuxtApp) => {
        const vuetify = createVuetify({
            components,
            directives,
        });
        
        nuxtApp.vueApp.use(vuetify);
    });
    ```
4.  ```ts
    // nuxt.config.tsを修正
    // https://v3.nuxtjs.org/api/configuration/nuxt.config
    export default defineNuxtConfig({
        //これのせいでビルド時間が増える↓
        css: ["vuetify/lib/styles/main.sass"],
        build: {
            transpile: ["vuetify"],
        },
        vite: {
            define: {
            "process.env.DEBUG": false,
            },
        },
    });
    ```
5. **app.vue**の内容を修正し、確認
    ```html
    <div>
    <!-- <NuxtWelcome /> -->
        <v-btn class="ma-5" color="primary">my-btn</v-btn>
    </div>
    ```
6. ```$ npm run dev ```
>引用 : https://zenn.dev/one_dock/articles/ab6d178741956d
>公式サイト : https://next.vuetifyjs.com/

### Bootstrap5インストール
1. Vuetifyが思った以上に重いので変えました
2. ```$ npm install -D bootstrap```
3. **nuxt.config.ts** に追記<br>
    ```ts
    export default defineNuxtConfig({
      css: ["bootstrap/dist/css/bootstrap.min.css"],
      vite: {
        define: {
          "process.env.DEBUG": false,
        },
      },
    });
    ```
    >引用 : https://zenn.dev/one_dock/articles/64bd100b83074b
4. jqueryが必要な機能が使えないため対応させる<span style="color: red; ">(2022/12/22日には正式な対応版が無かった)</span>
5. plugins -> **bootstrap.client.ts** を作成
   ```ts
    import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

    export default defineNuxtPlugin(nuxtApp => {
        nuxtApp.provide('bootstrap', bootstrap)
    })
   ```
   これでbootstrap5の全ての機能が全ページで使える
6. **bootstrap.bundle** はTypescriptの型が対応していないためエラーが出る。
7. 型を自作する<br> plugins -> **bootstrap.d.ts**
   ```ts
    //bootstrap.bundleの型が無いからanyとして扱う
    declare module "bootstrap/*";
   ```
   これで応急処置は完了

### sassインストール
1. ```$ npm install -D sass```
2. >引用 : https://blog.orz.at/2021/07/02/vuejs-sass/

   (最新のcssはネストされた書き方ができるので、いつかは要らなくなる)

### @mdi/fontインストール
1. ```$ npm install -D @mdi/font```
2. >引用 : https://qiita.com/amishiro/items/02959d88f1de290ea6ed

### ~~remixiconと~~boxiconのインストール
1. ```$ npm install -D boxicons``` ~~```remixicon```~~
2. @mdi/iconの種類が多かったので、remixiconはアンインストールしました

### ESLintの導入
1. ```$ npm install -D eslint```
2. ```$ npm install -D eslint-plugin-vue```
3. ```$ npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser @nuxtjs/eslint-config-typescript```
4. ```$ npx eslint --init```
5. 答えた順番
    ```
    You can also run this command directly using 'npm init @eslint/config'
    Need to install the following packages: @eslint/create-config
    Ok to proceed? -> y (対話型にするため)
    ✔ How would you like to use ESLint?  -> problems
    ✔ What type of modules does your project use? -> esm (javascriptのこと)
    ✔ Which framework does your project use? -> vue
    ✔ Does your project use TypeScript? · -> Yes
    ✔ Where does your code run? -> browser(とりあえず選んだ)
    ✔ What format do you want your config file to be in? -> json (ただの好み)

    それ以外は基本的にインストールするからyes
    ```
    >引用 : https://qiita.com/shott/items/caa62324ca9827526ba9
6. ```es2022": true``` は変えたほうが良さそう
7. それ以外の内容は問題が起こったら変えてく

### tiptapのインストール
1. ``` 
    $ npm install -D
    @tiptap/core
    @tiptap/extension-bubble-menu
    @tiptap/extension-bullet-list
    @tiptap/extension-code-block-lowlight
    @tiptap/extension-color
    @tiptap/extension-highlight
    @tiptap/extension-image
    @tiptap/extension-link
    @tiptap/extension-text-align
    @tiptap/extension-text-style
    @tiptap/extension-underline
    @tiptap/extension-collaboration
    @tiptap/extension-collaboration-cursor
    lowlight 
    @tiptap/starter-kit
    @tiptap/vue-3"
    ```
    >https://tiptap.dev/
2. starterkitに基本的な機能は備わっていて、その他をextensionで補ってる
3. 

### yjsのインストール
1. ``` $ npm install -D ws yjs y-websocket ```
2. これを使ってtiptapの共同編集の機能を使う
3. ```npx y-websocket-server``` でサーバーを起動
4. これを使うとlocalhost:1234でポートが開く
5. コードの中でこのポートを指定すると、共同編集が使える

### ~~nuxt/contentのインストール~~※必要無いから消した
1. ```$ npm install @nuxt/content```
2. ウェブに必要な追加機能が入っている

### firebaseのインストール
1. ```$ npm install -D firebase firebaseui```
2. ログイン認証、データベースなど様々な機能が使える
3. firebaseuiでログインボタンのデザインが用意されてる
4. firebaseのアカウント登録+ウェブアプリの登録が必要になる<br>https://awesomecatsis.com/firebase-register/
5. firebaseConfigの内容をコピー<span style="color: red; ">(他人に見せてはいけない、githubに上げるのもダメ)</span>
6. rootディレクトリに.envファイルを作成 -> firebaseConfigの内容を記述<br>
    ```
    apiKey=???
    authDomain=???
    ...
    ```
    https://console.firebase.google.com
7. 次も大事

### Firebase開発手順
1. FirebaseにGoogleアカウントでログイン<br>https://firebase.google.com/
2. プロジェクト作成 -> プロジェクト名入力
3. プロジェクトを開いた状態で画面左上の **歯車** -> **プロジェクトの設定**
   ![image](https://user-images.githubusercontent.com/105027725/206466589-52fba1cb-2d1c-484a-91fb-5a4709136e04.png)
4. **全般**タブ -> 下にスクロールして **マイアプリ** -> **</>**
   ![image](https://user-images.githubusercontent.com/105027725/206470358-ce7413ce-1217-4855-91f1-6f979da45c6a.png)
5. アプリ名を登録 -> **Firebase SDK**のconfigをコピー
   ![image](https://user-images.githubusercontent.com/105027725/206472825-40f44cfc-53aa-470a-b43b-f79e21f71246.png)
6. 左のメニューから **構築** -> **Authentication**<br>https://firebase.google.com/products/auth?hl=ja
7. **追加のプロバイダ** -> **Google** -> 有効にする
8. 新しいプロバイダを追加 -> **メールパスワード** -> 有効にする
9. 左のメニューから **構築** -> **Firestore Database**<br>https://firebase.google.com/products/firestore?hl=ja
10. テストモード -> asia-northeast2(Osaka) に設定
11. vscodeを開き、app.vueと同じ場所に **.env** ファイルを作成
12. コピーしたFirebase SDKのconfigを書き込む<span style="color: red; ">( ダブルクォーテーション,  カンマ, 半角スペース は消して文字だけにする)</span><br>
    ![image](https://user-images.githubusercontent.com/105027725/206570480-42dbbfd1-f8b1-4cf3-8c76-b02c50664efd.png)
13. localhost:3000/loginを開き、Googleでログインが動いたら成功

### npm-run-allのインストール
1. ```$ npm install -D npm-run-all```
2. *y-webocket-server* と nuxtを同時起動するために使用する

### テストする
1. サイトの内容順にやってみる
2. >引用 : https://qiita.com/mml/items/9936471c551ee3f15218
---
<br>


# パッケージの使い方に困ったとき
1. Nuxt3 : 今回の基盤になってる<br>
   https://nuxtjs.org/ja/docs/get-started/installation (日本語旧)<br>
   https://nuxt.com/docs/getting-started/introduction (英語最新)
2. TypeScript : Javascriptに型をつけれる<span style="color: red; ">(大事)</span><br>
   https://typescriptbook.jp/reference(日本語公式)
3. @mdi/font : アイコンを仕込める<br>
   https://pictogrammers.github.io/@mdi/font/2.0.46/
   https://materialdesignicons.com/
4. sass : cssをより簡単・便利・分かりやすく書ける(よく分かってない)<br>
   https://www.syngram.co.jp/blog/6520 <br>
   https://sass-lang.com/documentation/ (公式英語)
5. bootstrap : <br>
   https://getbootstrap.jp/
   

---
このあたりサイト見てマークダウン書いてる
>https://qiita.com/Qiita/items/c686397e4a0f4f11683d

>https://qiita.com/kamorits/items/6f342da395ad57468ae3
---


[def]: #目次
