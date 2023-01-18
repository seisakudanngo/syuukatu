<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3';
// import BubbleMenu from '@tiptap/extension-bubble-menu'
import { watchEffect, ref, onMounted, nextTick, onBeforeUnmount } from 'vue';

// codeblockに色を付ける 言語ごとに色が変わる
import { lowlight } from 'lowlight/lib/core';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';

// bullist
import BulletList from '@tiptap/extension-bullet-list';
// underline
import Underline from '@tiptap/extension-underline';
// image
import Image from '@tiptap/extension-image';
// TextAlign (文字の場所を変える)
import TextAlign from '@tiptap/extension-text-align';
// Color
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
// urlを表示する
import Link from '@tiptap/extension-link';
//自作
import { HeaderId } from './tiptap_extensions/headingExtension';
// データ保存
import { getFirestore, getDoc, doc, setDoc, updateDoc, increment, getDocs, collection } from "firebase/firestore";
//読み込み
import { getAuth } from 'firebase/auth';

// queryの値を取得
import { useRoute } from 'vue-router';

// collaborative
import * as Y from 'yjs'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { WebsocketProvider } from 'y-websocket';
// 編集できないユーザーは返す
import { navigateTo } from '#app';

// 処理が終わった後に表示
const domFinished = ref(false);

// データベース名
const dbName = "kdData";

// 扱うID
const queryId = ref<string>("");

const setId = async () => {
  const route = useRoute();
  if(route.query.id){
    queryId.value = String(route.query.id);
  }
}

// 共同編集の初期設定
const ydoc = new Y.Doc();
const provider = ref<WebsocketProvider>();
const setRoom = () => {
  provider.value = new WebsocketProvider(
    `ws://${location.hostname}:5000`,
    `${queryId.value ? queryId.value : "undefinedRoom"}`,
    ydoc
  );
  console.log(queryId.value);
}

//codeblockのハイライト設定
lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

// ツール表示非表示
const isActive = ref(true);
const showActive = ref(true);

// 入力切り替え
const isEditable = ref<boolean>(false);

// urlのデータ
const teamUrl = ref<string>("");

// 色のデータ
const colorRef = ref<string>("#000000");
const nameColor = ref<string>("#FFFFFF");
const nameBGColor = ref<string>("#000000");

// tagのデータ取得
const tagboxIndex = ref<number>(0);
const allTags = ref<Array<string>>([]);
const preTags = ref<Array<string>>([]);
const oldTags = ref<Array<string>>([ "", "", "" , ""]);
const newTags = ref<Array<string>>([ "", "", "" , ""]);

//データの更新
const emits = defineEmits(["update:editorContent"]);

//tabでスペース入力できるように https://tiptap.dev/api/commands#lists
const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts(){
    return {
      // ↓ your new keyboard shortcut
      'Tab': ({ editor }) => {
        console.log('tab押されたよ');
        //タブ2つ
        editor.chain().focus().sinkListItem('listItem').command(({ tr }) => {
          tr.insertText('  '); return true
        }).run()
        return true
      },
    }
  }
});

// ユーザーの色をランダムに指定
const setUserColor = () => {
  let bgcolor = 
    "#" +
    Math.round(Math.random() * 255).toString(16) + 
    Math.round(Math.random() * 255).toString(16) + 
    Math.round(Math.random() * 255).toString(16);

  // RGBを文字から切り出し
  let red = parseInt(bgcolor.substring (0, 2), 16);
  let green = parseInt(bgcolor.substring (2, 5), 16);
  let blue = parseInt(bgcolor.substring (5, 7), 16);
  
  // 明るさの計算(0〜255)
  const brightness = ( red * 299 + green * 587 + blue * 114 ) / 1000;
  // 明るさの計算(0〜100)
  const luminance = brightness / 2.55;

  
  // 基準値(50)より数字が大きいときは黒を設定、それ以外は白
  nameBGColor.value = bgcolor;
  nameColor.value = luminance > 50 ? "#000000" : "#ffffff";
}

// これでgetAuth().currentUserから絶対に値を取れる
const getUsername = () => {
  return new Promise((resolve) => {
    var unsubscribe = getAuth().onAuthStateChanged((user) => {
      // user オブジェクトを resolve
      resolve(user);

      // 登録解除
      unsubscribe();
    });
  });
}

// 全てのタグ名を取得する これを検索に使う
const setSearchTags = async () => {
  const db = getFirestore();
  const querySnapshot = await getDocs(collection(db, "tags"));

  querySnapshot.forEach((doc) => {
    allTags.value.push(doc.id);
  });
}

//チームデータの読み込み
const setTeam = async () => {
  if(process.server) { return; }

  // dbは関数の中に書かないとエラー データをeditorの中に
  const db = getFirestore();
  const docSnap = await getDoc(doc(db, "kdData", queryId.value));
  // const docData = (await getDoc(docRef)).get(queryYear.value)[queryTeamId.value];

  if(docSnap.exists()){
    // データ取得
    const docData = docSnap.data();

    // url表示
    teamUrl.value = docData["url"];

    // tagの表示
    for(let i = 0; i < 4; i++){
      newTags.value[i] = docData["tags"][i];
      oldTags.value[i] = docData["tags"][i];
    }

    //編集可能なユーザーか確認 もし編集画面に入っても編集できないように
    const temp: Array<string> = docData["members"];
    getAuth().onAuthStateChanged((user) => {
      if(user && user.email && user.displayName){
        isEditable.value = temp.includes(user.email);
        // console.log(user.email);
      }
      else{
        // 本番では使えるようにする
        isEditable.value = false;
      }
    });
  }
}

// データを取得するように ユーザー名が絶対取得できるようにした
await setUserColor();
await setSearchTags();
await setId();
await setRoom();
await setTeam();
await getUsername();

//editorの設定
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      history: false
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    CustomBulletList,
    CodeBlockLowlight.configure({
      lowlight, //コードブロックの色
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: "img-fluid",
      }
    }),
    TextStyle,
    Color,
    Highlight.configure({ 
      multicolor: true
    }),
    Underline,
    Link.configure({
      openOnClick: true,
      validate: href => /^https?:\/\//.test(href),
    }),
    HeaderId,
    Collaboration.configure({
      document: ydoc
    }),
    CollaborationCursor.configure({
      provider: provider.value,
      user: {
        name: getAuth().currentUser?.displayName ,
        color: nameBGColor,
      },
    }),
  ],
  editorProps: {
    attributes: {
      style: `
      height: 100%;
      padding: 1.25rem; 
      background-color: none;
      font-size: 1rem;
      outline: none;
      `,
      spellcheck: 'false',
    }
  },
  // content: props.editorContent,
  onUpdate: ({ editor }) => {
    emits("update:editorContent", editor.getHTML());
    // console.log(editor.getHTML());
  },
  editable: isEditable.value,    //入力受け付けるか設定
});

// 画像追加
const addImage = (image: string) => {
  if (image) {
    editor.value?.chain().focus().setImage({ src: image }).run();
  }
}

//urlを設定する
const setLink = (): undefined => {
  const previousUrl = editor.value?.getAttributes('link').href;
  const url = window.prompt('URLを設定 (ページ内リンクする場合は [#指定するヘッダーID] と入力。)', previousUrl);

  // キャンセル
  if(url === null) {
    return;
  }

  // 空
  if(url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  let target = "_blank"
  // リンクを更新 urlが#から始まるリンクなら_self httpじゃないurlならエラー
  if(/^#[-_0-9a-zA-Z]*$/.test(url)) { target = "_self" }
  else if(!(/^https?:\/\//.test(url))) { window.alert("httpから始まるurl または #から始まる英数字のみ入力可能です。"); return ;}

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url, target: target }).run();
  return;
}

//headerのid取得
const updateHeaderId = (): undefined => {
  let hasId = editor.value?.getAttributes('heading').id;
  // let level = editor.value?.getAttributes('heading').level;
  // console.log(level);
  //undefined -> headerタグ以外  他タグは対象外
  if( hasId === undefined ) { 
    window.alert("IDはh1~h6属性のみ設定可能です。")
    return;
  }
  if( hasId === null) hasId = "";

  // null -> headerタグだけどid無いから新規登録
  const id = window.prompt('IDを設定 (重複するとアンカーが正常に動作しません。)', hasId);
  // キャンセル
  if(id === null){
    return;
  }

  // 空
  if(id === ''){
    editor.value?.chain().focus().resetAttributes('heading', ['id']).run();
    return;
  }

  // 更新 or 新規
  editor.value?.chain().focus().updateAttributes('heading', {id: id}).run();
  return;
}

// 色を設定する
const setColor = (event: string) => {
  colorRef.value = event;
}

//保存機能 保存場所は決めてない
const saveFile = async () => {
  const editor_data = editor.value?.getHTML();
  // const data = editor.value?.getJSON();
  const db = getFirestore();
  const kdRef = doc(db, dbName, queryId.value);

  showActive.value = false;
  setTimeout(() => {
    showActive.value = true;
  },3000)

  // const grade = (queryId.value).substring(0, 1);
  // const year = (queryId.value).substring(1, 5);

  if(!isEditable.value && !editor_data){ return; }

  // kdDataに存在する場合
  await updateDoc(
    kdRef,
    {
      data: editor_data,
      url: teamUrl.value,
      tags: newTags.value
    } as any
  )
  
  // データの変化がない場合は返す
  if(oldTags.value === newTags.value) { return; }

  console.log(newTags.value);
  //タグの保存
  for(let index = 0; index < 4; index++){
    // データが変化しない場合は飛ばす
    if(newTags.value[index] === oldTags.value[index]){ continue; }
    
    // 新しいタグにカウントを足す
    if( newTags.value[index] !== "" ) { 
      // tagにデータが存在しない場合は作成する
      if((await getDoc(doc(db, "tags", newTags.value[index]))).exists() === false){
        await setDoc( doc(db, "tags", newTags.value[index]), {count: 0});
      }

      // カウントにプラス
      await setDoc( doc(db, "tags", newTags.value[index]), {count: increment(1)}, {merge: true} );
    }

    // 古いタグからカウントを引く
    if(oldTags.value[index] !== "") {
      await setDoc( doc(db, "tags", oldTags.value[index]), {count: increment(-1)}, {merge: true} );
    }

    console.log(newTags.value[index] + ":" + oldTags.value[index]);

    // oldTagsに保存後のデータを移動
    oldTags.value[index] = newTags.value[index];
  }
}

// 内容を戻す処理
const refreshEditor = async () => {
  if(process.server) { return; }
  const db = getFirestore();
  const docSnap  = await getDoc(doc(db, "kdData", queryId.value));

  if(docSnap.exists()){
    const docData = docSnap.data();
    editor.value?.commands.setContent(docData["data"]);
  }
}

// 文字置き換え エスケープ文字は空文字にする
const checkEscape =  (str: string) => {
  return (str + '')
    .replace(/\\/g, '\\\\')
    .replace(/\./g, '\\\.')
    .replace(/\//g, '\\\/')
    .replace(/[\*\+\?\{\}\(\)\[\]\^\$\|]/, "");
}

// タグの予測検索
const predictionTags = (text: string) => {
  // 数字,英語,ひらがな,カタカナ, 半角カタカナ,漢字,/\.以外は返す + 空文字も返す
  if(!text ||!(/^[0-9A-zぁ-んーァ-ンヴー一-龠\\\.\/\s]+$/i).test(text)) {
    return;
  }

  const regex = new RegExp(text, 'i');
  // 予測結果をpreTagsに保存
  preTags.value = allTags.value.filter(RegExp.prototype.test, regex);
}

// 英数字, ひらがな, カタカナ, 半角カタカナ
const checkTags = (text: string) => {
  text = checkEscape(text);
  if(!text || !(/^[0-9A-zぁ-んーァ-ンヴー一-龠\\\.\/\s]+$/i).test(text)) {
    newTags.value[tagboxIndex.value] = newTags.value[tagboxIndex.value].slice(0, -1);
    // console.log("aaa");
    preTags.value = [];
    return false;
  }

  // console.log(text)
  predictionTags(text);
  return true;
}

// checkboxを監視 falseだとhomeに帰らせる
watchEffect(() => {
  editor.value?.setEditable(isEditable.value);
  if(isEditable.value === false){
    navigateTo("/", {replace: true});
  }
})

// domの処理後
onMounted(() => {
  nextTick(async () => {
    // dom更新後に表示する
    domFinished.value = true;
  })
})

// ページを移動するときは捨てる
onBeforeUnmount(() => {
  editor.value?.destroy()
  provider.value?.destroy()
})

// 確認用
const testlog = (eve: any) => {
  console.log(eve);
  // console.log(editor.value?.getAttributes('textStyle').color);
  // console.log(username.value)
};

</script>

<template>
  <div v-if="domFinished">
    <!-- v-if="editor"の中に書かないとundefinedになる可能性でエラーなる-->
    <div v-if="editor && isEditable">
      <div class="btn-con d-flex flex-wrap justify-content-start">
        <div class="btn-1">
          <button 
            class="rounded-2 me-2"
            :disabled="!editor.can().chain().focus().undo().run()"
            title="戻す[Ctrl + Z]&#13;&#10;元に戻します。"
            @click="editor?.chain().focus().undo().run()"
          >
            <i class="mdi mdi-arrow-u-left-bottom" />
          </button>
        </div>
        <div class="btn-1">
          <button 
            class="rounded-2 me-2"
            :disabled="!editor.can().chain().focus().redo().run()"
            title="繰り返す[Ctrl + Y]&#13;&#10;直前の操作を繰り返します。"
            @click="editor?.chain().focus().redo().run()"
          >
            <i class="mdi mdi-arrow-u-right-bottom" />
          </button>
        </div>
        <div class="btn-1">
          <button 
            class="rounded-2"
            title="ファイル保存&#13;&#10;保存します。"
            @click="saveFile"
          >
            <i v-if="showActive" class="mdi mdi-cloud-upload-outline" />
            <i v-else class="mdi mdi-check-underline" />
          </button>
        </div>
        <div class="ms-auto">
          <button  
            class="
            btn btn-danger 
            rounded-5"
            title="最後に保存した状態に戻す&#13;&#10;※現在作業しているものは保存されません"
            @click="refreshEditor"
          >
            <i class="mdi mdi-reload-alert" />
          </button>
        </div>
      </div>

      <div 
        v-if="isActive"
        class="tools-btn d-flex justify-content-center align-items-center" 
        data-bs-toggle="offcanvas" 
        data-bs-target="#tiptap-toolsbar" 
        aria-controls="offcanvasScrolling"
        @click="isActive=!isActive"
      >
        <i class="mdi mdi-file-edit-outline" />
      </div>
      <div class="offcanvas offcanvas-bottom" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="tiptap-toolsbar">
        <div class="offcanvas-body">
          <!-- メニュー -->
          <div class="row">
            <!-- Convenient -->
            <div class="col">
              <p class="text-center mb-1">
                Convenient
              </p>
              <div class="d-flex flex-wrap justify-content-center">
                <div>
                  <button 
                    :disabled="!editor.can().chain().focus().undo().run()"
                    title="戻す[Ctrl + Z]&#13;&#10;元に戻します。"
                    @click="editor?.chain().focus().undo().run()"
                  >
                    <i class="mdi mdi-arrow-u-left-bottom" />
                  </button>
                </div>
                <div>
                  <button 
                    :disabled="!editor.can().chain().focus().redo().run()"
                    title="繰り返す[Ctrl + Y]&#13;&#10;直前の操作を繰り返します。"
                    @click="editor?.chain().focus().redo().run()"
                  >
                    <i class="mdi mdi-arrow-u-right-bottom" />
                  </button>
                </div>
                <div>
                  <button 
                    title="ファイル保存&#13;&#10;保存します。"
                    @click="saveFile"
                  >
                    <i v-if="showActive" class="mdi mdi-cloud-upload-outline" />
                    <i v-else class="mdi mdi-check-underline" />
                  </button>
                </div>
                <div>
                  <button 
                    title="画像挿入&#13;&#10;画像を挿入します。"
                    type="button"
                    data-bs-toggle="modal" 
                    data-bs-target="#upload-image"
                  >
                    <i class="mdi mdi-file-image" />
                  </button>
                </div>
              </div>
              <div class="d-flex flex-wrap justify-content-center">
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('link') }"
                    title="リンク設定&#13;&#10;リンクを設定します。"
                    @click="setLink"
                  >
                    <i class="mdi mdi-link-variant" />
                  </button>
                </div>
                <div>
                  <button 
                    title="リンク設定取り消し&#13;&#10;設定したリンクを取り消します。"
                    @click="editor?.chain().focus().extendMarkRange('link').unsetLink().run()"
                  >
                    <i class="mdi mdi-link-variant-off" />
                  </button>
                </div>
                <div>
                  <button 
                    title="アンカー設定&#13;&#10;アンカーを設定します。"
                    @click="updateHeaderId"
                  >
                    <i class="mdi mdi-pin-outline" />
                  </button>
                </div>
                <div>
                  <button 
                    title="アンカー設定取り消し&#13;&#10;設定したアンカーを取り消します。"
                    @click="editor?.chain().focus().resetAttributes('heading', ['id']).run()"
                  >
                    <i class="mdi mdi-pin-off-outline" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Fonts -->
            <div class="col">
              <p class="text-center mb-1">
                Fonts
              </p>
              <div class="d-flex flex-wrap justify-content-center">
                <div>
                  <button
                    :class="{ 'is-active': editor.isActive('underline') }"
                    title="下線[Ctrl + U]&#13;&#10;下線を追加します。"
                    @click="editor?.chain().focus().toggleUnderline().run()"
                  >
                    <i class="mdi mdi-format-underline" />
                  </button>
                </div>
                <div>
                  <button
                    :class="{ 'is-active': editor.isActive('bold') }"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    title="太字[Ctrl + B]&#13;&#10;文字列を太字にします。"
                    @click="editor?.chain().focus().toggleBold().run()"
                  >
                    <i class="mdi mdi-format-bold" />
                  </button>
                </div>
                <div>
                  <button
                    :class="{ 'is-active': editor.isActive('italic') }"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    title="斜体[Ctrl + I]&#13;&#10;文字列を斜体にします。"
                    @click="editor?.chain().focus().toggleItalic().run()"
                  >
                    <i class="mdi mdi-format-italic" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('strike') }"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                    title="取り消し線&#13;&#10;取り消し線を引きます。"
                    @click="editor?.chain().focus().toggleStrike().run()"
                  >
                    <i class="mdi mdi-format-strikethrough" />
                  </button>
                </div>
                <div>
                  <button 
                    title="属性全削除&#13;&#10;テキストの属性を全て削除します。"
                    @click="editor?.chain().focus().unsetAllMarks().run()"
                  >  
                    <i class="mdi mdi-trash-can-outline" />
                  </button>
                </div>
              </div>
              <div class="d-flex flex-wrap justify-content-center">
                <div>
                  <input
                    type="color"
                    :value="colorRef"
                    title="カラーパレット&#13;&#10;カラーパレットを設定します。"
                    @change="setColor(($event.target as HTMLInputElement).value)"
                  >
                </div>
                <div>
                  <button
                    :class="{ 'is-active': editor.isActive('textStyle', { color: colorRef })}"
                    title="フォントカラーを設定します。"
                    @click="editor?.chain().focus().setColor(colorRef).run()"
                  >
                    <i 
                      class="mdi mdi-format-text-variant" 
                      :style="{color: colorRef}"
                    />
                  </button>
                </div>
                <div>
                  <button
                    title="フォントカラーの設定を取り消します。"
                    @click="editor?.chain().focus().unsetColor().run()"
                  >
                    <i class="mdi mdi-water-off" />
                  </button>
                </div>
                <div>
                  <button
                    :class="{ 'is-active': editor.isActive('highlight') }"
                    title="背景色を設定します。"
                    @click="editor?.chain().focus().toggleHighlight({ color: colorRef }).run()"
                  >
                    <i 
                      class="mdi mdi-marker" 
                      :style="{color: colorRef}"
                    />
                  </button>
                </div>
                <div>
                  <button
                    title="背景色の取り消し&#13;&#10;背景色を取り消します。"
                    @click="editor?.chain().focus().unsetHighlight().run()"
                  >
                    <i class="mdi mdi-marker-cancel" />
                  </button>
                </div>
                <!-- <div>
                  <button
                    :class="{ 'is-active': editor.isActive('textStyle', { color: '#008000' })}"
                    title="Green&#13;&#10;フォントカラーを緑に設定します。"
                    @click="editor?.chain().focus().setColor('#008000').run()"
                  >
                    <i
                      class="mdi mdi-format-text-variant" 
                      style="color: #008000;" 
                    />
                  </button>
                </div>
                <div>
                  <button
                    :class="{ 'is-active': editor.isActive('textStyle', { color: '#0000FF' })}"
                    title="Blue&#13;&#10;フォントカラーを青に設定します。"
                    @click="editor?.chain().focus().setColor('#0000FF').run()"
                  >
                    <i 
                      class="mdi mdi-format-text-variant" 
                      style="color: #0000FF;" 
                    />
                  </button>
                </div> -->
              </div>
            </div>

            <!-- 閉じるボタン -->
            <button 
              type="button" 
              class="btn-close text-reset" 
              data-bs-dismiss="offcanvas" 
              aria-label="Close" 
              style="font-size: 2rem;"
              @click="isActive=!isActive"
            />

            <!-- Paragraph -->
            <div class="col">
              <p class="text-center mb-1">
                Paragraph
              </p>
              <div class="d-flex flex-wrap justify-content-center">
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
                    title="左揃え[Ctrl + L]&#13;&#10;コンテンツを左に揃えます。"
                    @click="editor?.chain().focus().setTextAlign('left').run()" 
                  >
                    <i class="mdi mdi-format-align-left" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
                    title="中央揃え[Ctrl + E]&#13;&#10;コンテンツを中央に揃えます。"
                    @click="editor?.chain().focus().setTextAlign('center').run()"
                  >
                    <i class="mdi mdi-format-align-center" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
                    title="右揃え[Ctrl + R]&#13;&#10;コンテンツを右に揃えます。"
                    @click="editor?.chain().focus().setTextAlign('right').run()"
                  >
                    <i class="mdi mdi-format-align-right" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
                    title="両端揃え[Ctrl + J]&#13;&#10;コンテンツを均等に配置します。"
                    @click="editor?.chain().focus().setTextAlign('justify').run()"
                  >
                    <i class="mdi mdi-format-align-justify" />
                  </button>
                </div>
                <!-- <div>
                  <button 
                    title="配置設定取り消し&#13;&#10;コンテンツの配置設定を取り消します。"  
                    @click="editor?.chain().focus().unsetTextAlign().run()"
                  >
                    <i class="ri-file-list-line" />
                  </button>
                </div> -->
              </div>
              <div class="d-flex flex-wrap justify-content-center">
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('bulletList') }"
                    title="箇条書き&#13;&#10;箇条書きの段落を作成します。"
                    @click="editor?.chain().focus().toggleBulletList().run()"
                  >
                    <i class="mdi mdi-format-list-bulleted" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('orderedList') }"
                    title="段落番号&#13;&#10;番号付きの段落を作成します。"
                    @click="editor?.chain().focus().toggleOrderedList().run()"
                  >
                    <i class="mdi mdi-format-list-numbered" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('blockquote') }"
                    title="クォート&#13;&#10;クォート"
                    @click="editor?.chain().focus().toggleBlockquote().run()" 
                  >
                    <i class="mdi mdi-format-quote-close" />
                  </button>
                </div>
                <div>
                  <button 
                    title="境界線&#13;&#10;境界線を引きます。"
                    @click="editor?.chain().focus().setHorizontalRule().run()"
                  >
                    <i class="mdi mdi-minus" />
                  </button>
                </div>
                <!-- <div>
                  <button 
                    title="改行&#13;&#10;改行をします。"
                    @click="editor?.chain().focus().setHardBreak().run()"
                  >
                    <i class="ri-text-wrap" />
                  </button>
                </div> -->
              </div>
            </div>

            <!-- Styles -->
            <div class="col">
              <p class="text-center mb-1">
                Styles
              </p>
              <div class="d-flex flex-wrap justify-content-center">
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                    title="h1&#13;&#10;h1タグを適用します。"
                    @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
                  >
                    <i class="mdi mdi-format-header-1" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                    title="h2&#13;&#10;h2タグを適用します。"
                    @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                  >
                    <i class="mdi mdi-format-header-2" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                    title="h3&#13;&#10;h3タグを適用します。"
                    @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" 
                  >
                    <i class="mdi mdi-format-header-3" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
                    title="h4&#13;&#10;h4タグを適用します。"
                    @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
                  >
                    <i class="mdi mdi-format-header-4" />
                  </button>
                </div>
              </div>
              <div class="d-flex flex-wrap justify-content-center">
                <div>
                  <button
                    :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
                    title="h5&#13;&#10;h5タグを適用します。"
                    @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"
                  >
                    <i class="mdi mdi-format-header-5" />
                  </button>
                </div>
                <!-- <div>
                  <button
                    :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
                    title="h6&#13;&#10;h6タグを適用します。"
                    @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"
                  >
                    <i class="mdi mdi-format-header-6" />
                  </button>
                </div> -->
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('codeBlock') }"
                    title="コード入力&#13;&#10;コード入力ができます。"
                    @click="editor?.chain().focus().toggleCodeBlock().run()"
                  >
                    <i class="mdi mdi-xml" />
                  </button>
                </div>
                <div>
                  <button 
                    :class="{ 'is-active': editor.isActive('paragraph') }"
                    title="標準フォント&#13;&#10;標準フォントにします。"
                    @click="editor?.chain().focus().setParagraph().run()"
                  >
                    <i class="mdi mdi-format-paragraph" />  
                  </button>
                </div>
                <div>
                  <button 
                    title="フォント設定取り消し&#13;&#10;フォントの設定をすべて取り消します。"
                    @click="editor?.chain().focus().clearNodes().run()"
                  >
                    <i class="mdi mdi-format-clear" />
                  </button>
                </div>
              </div>
            </div>
            <!--  -->
          </div>
        </div>
      </div>
    </div>

    <div class="tiptapeditor-editor bg-white p-1 border border-dark border-2 rounded-4">
      <editor-content
        class="h-100"
        :editor="editor"
      />
    </div>

    <div 
      class="my-4 p-4 rounded-4"
      style="background-color: rgb(239, 239, 239); box-shadow: 0rem 0rem 0.2rem 0rem black;"
    >
      <div class="team-url mb-4">
        <div class="fs-5">
          <b>コード参照ページの追加</b>
        </div>
        <div class="team-url m-1">
          <input
            v-model="teamUrl"
            class="
            input-group
            rounded-2
            w-100
            "
            type="text"
            placeholder="URLを入力"
            size="60"
          >
        </div>
      </div>
      <div class="team-tags mb-4">
        <div class="fs-5">
          <b>タグの追加</b>
        </div>
        <div class="d-flex flex-wrap justify-content-between">
          <div class="m-1">
            <input 
              v-model="newTags[0]"
              class="input-group rounded-2"
              type="text"
              placeholder="タグを入力"
              @input="checkTags(($event.target as HTMLInputElement).value)"
              @focus="() => tagboxIndex = 0"
            >
          </div>
          <div class="m-1">
            <input
              v-model="newTags[1]"
              class="input-group rounded-2"
              type="text"
              @input="checkTags(($event.target as HTMLInputElement).value)"
              @focus="() => tagboxIndex = 1"
            >
          </div>
          <div class="m-1">
            <input
              v-model="newTags[2]"
              class="input-group rounded-2"
              type="text"
              @input="checkTags(($event.target as HTMLInputElement).value)"
              @focus="() => tagboxIndex = 2"
            >
          </div>
          <div class="m-1">
            <input
              v-model="newTags[3]"
              class="input-group rounded-2"
              type="text"
              @input="checkTags(($event.target as HTMLInputElement).value)"
              @focus="() => tagboxIndex = 3"
            >
          </div>
        </div>
      </div>
      
      <div>
        <div class="fs-5">
          <b>こんなタグがあります</b>
        </div>
        <div class="d-flex flex-wrap gap-2 p-2">
          <span
            v-for="(pretag, index) in preTags" 
            :key="index"
            class="pretag px-2 rounded-4"
            @click="() => (newTags[tagboxIndex] = pretag)"
          >
            {{ pretag }}
          </span>
        </div>
      </div>
    </div>

    <UploadImage
      @base64Image="addImage"
    />
  </div>
</template>

<style lang="scss">

/* ツールボタン */
.tools-btn{
  // margin: 80px auto;
  position: fixed;
  bottom: 10vh;
  right: 10vw;
  width: 5rem;
  height: 5rem;
  color: aliceblue;
  background: skyblue;
  border-radius: 50%;
  cursor: pointer;

  z-index: 100;
  i {
    font-size: 3rem;
  }
  
  &:hover{
    filter: brightness(1.1);
  }
}

.offcanvas.offcanvas-bottom {
  background: skyblue;
  height: 22vh;
  box-shadow: 0rem 0rem 0.5rem 0rem black;
}

.floating-menu {
  display: flex;
  background-color: #2d19e07e;
  padding: 0.2rem;
  border-radius: 0.5rem;

}

// メニューの中身
.row {
  .col {
    p {
      font-size: 1.5rem;
      text-align: center;
      color: #0D0D0D;
    }
    
    button {
      border: none;
      border-radius: .6rem;
      width: 3rem;
      height: 3rem;
      opacity: 1;

      &:hover,
      &.is-active {
        opacity: 0.6;
      }

      i {
        vertical-align: middle;
        font-size: 2rem;
      }
    }
    
    input {
      width: 3rem;
      height: 3rem;
    }
  }
}

.pretag {
  background-color: antiquewhite;
  box-shadow: 0 5px 8px 0 rgba(76, 85, 88, 0.5);
  cursor: pointer;

  &:hover {
    color: blue;
  }
}

//editorの入力部分 .ProseMirror
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
  
  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #68CEF8;
    }
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #e91111;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #FBBC88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #B9F18D;
    }

    .hljs-title,
    .hljs-section {
      color: #FAF594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70CFF8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }

  blockquote {
    padding-left: 1rem;
    border-left: 3px solid rgba(#0D0D0D, 0.1);
  }

  a {
    cursor: pointer;
  }
}

mark {
  padding: 0.125em 0;
  border-radius: 0.25em;
  box-decoration-break: clone;
}

.team-tags{
  .m-1 {
    flex-grow: 1;
    min-width: 20%;
    input{
      max-width: 100%;
    }
  }
}

.btn-con{
  div {
    margin-bottom: 0.8rem;
  }

  .btn-1 {
    button {
      width: 6.8rem;
      height: 3.6rem;
      background-color: rgb(239, 239, 239);

      i {
        vertical-align: middle;
        font-size: 1.9rem;
      }
    }
  }
  
  button {
    width: 10rem;
    height: 3.6rem;

    i {
      vertical-align: middle;
      font-size: 1.8rem;
    }
  }

  @media screen and (max-width: 768px){
    .btn-1{
      button{
        width: 6rem;
        height: 3rem;
        background-color: rgb(239, 239, 239);

      i {
          vertical-align: middle;
          font-size: 1.5rem;
        }
      }
    }

    button{
      width: 7rem;
    height: 3rem;

    i {
          vertical-align: middle;
          font-size: 1.5rem;
        }
    }
  }

  @media screen and (max-width: 576px){
    .btn-1{
      button{
        width: 5rem;
      height: 3rem;
      background-color: rgb(239, 239, 239);

      i {
          vertical-align: middle;
          font-size: 1.5rem;
        }
      }
    }

    button{
      width: 6rem;
    height: 3rem;

    i {
          vertical-align: middle;
          font-size: 1.5rem;
        }
    }
  }
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: v-bind(nameColor);
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

// safariだけtoolボタンの表示がおかしいから直した
::-webkit-full-page-media, :future, :root .col {
  -webkit-text-fill-color: black; //フォントの色を変更
  font-size: 0.5rem;
}

// ページ内リンクがヘッダーで隠れる部分を修正
:target::before {
  content: "";
  display: block;
  height: 18vh; /* ずらしたい高さ */
  margin-top: -18vh; /* heightに対するネガティブマージン */
  visibility: hidden,
}
</style>