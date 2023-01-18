<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3';
// import BubbleMenu from '@tiptap/extension-bubble-menu'
import { watchEffect, ref } from 'vue';

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
// 自作
import { HeaderId } from './tiptap_extensions/headingExtension';
// 移動
import { navigateTo } from "#app";

//読み込み
import { onMounted, nextTick } from "vue";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from '@firebase/auth';

// queryの値を取得
import { useRoute } from 'vue-router';

const dbName = "kdData";

// 扱うID
const queryId = ref<string>("");
const route = useRoute();
if(route.query.id){
  queryId.value = String(route.query.id);
}

//入力ボタン切り替え
const isEditable = ref<boolean>(false);

// urlのデータ
const teamUrl = ref<string>("");


//codeblockのハイライト設定
lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

const props = defineProps({
  editorContent: {
    type: String,
    default: `<p>default value</p>`
  }
});

//データの更新
const emits = defineEmits(["update:editorContent"]);

//tabでスペース入力できるように https://tiptap.dev/api/commands#lists
const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts(){
    return {
      // ↓ your new keyboard shortcut
      'Tab': () => {
        console.log('tab押されたよ');
        //タブ2つ
        editor.value?.chain().focus().sinkListItem('listItem').command(({ tr }) => {
          tr.insertText('  '); return true
        }).run()

        return true
      },
    }
  }
});


//editorの設定
const editor = useEditor({
  extensions: [
    StarterKit,
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
      protocols: ['ftp', 'mailto'],
    }),
    HeaderId,
  ],
  editorProps: {
    attributes: {
      style: `
      min-height: 50vh;
      height: 100%;
      padding: 1.25rem; 
      background-color: none;
      font-size: 1rem;
      outline: none;
      `,
      spellcheck: 'false',
    }
  },
  content: props.editorContent,
  onUpdate: ({ editor }) => {
    emits("update:editorContent", editor.getHTML());
    // console.log(editor.getHTML());
  },
  editable: false,    //入力受け付けるか設定
});

// firestoreからデータの読み取り
const setTeam = async () => {
  if(process.server) { return; }

  // dbは関数の中に書かないとエラー データをeditorの中に
  const db = getFirestore();
  const docSnap  = await getDoc(doc(db, dbName, queryId.value));

  if(docSnap.exists()){
    // データ取得
    const docData = docSnap.data();

    // firestoreのデータを表示 データをeditorの中に
    editor.value?.commands.setContent(docData["data"]);

    //編集可能なユーザーか確認 もし編集画面に入っても編集できないように
    const temp: Array<string> = docData["members"];
    getAuth().onAuthStateChanged((user) => {
      if(user && user.email){
        isEditable.value = temp.includes(user.email);
        // console.log(user.email);
      }
    });
    
    // url表示
    const getUrl = docData["url"];
    if(getUrl.substring(0, 7) == "http://" || getUrl.substring(0, 8) == "https://"){
      teamUrl.value = getUrl;
      console.log(teamUrl);
    }
  }
}

onMounted(() => {
  nextTick(() => {
    setTeam();
  })
})

</script>

<template>
  <div>
    <a 
      v-if="isEditable"
      class="btn-edit text-white d-flex justify-content-center align-items-center rounded-4 p-2 my-1"
      :href="`/tiptapEditor?id=${queryId}`"
    >
      <i class="mdi mdi-file-edit-outline" />
      ファイルを編集する
    </a>
    <div>
      <div 
        class="p-1 border border-dark border-2 rounded-4 bg-white"
      >
        <editor-content
          class="h-100"
          :editor="editor"
        />
      </div>
      <a 
        v-if="teamUrl"
        class="teamUrl text-white d-flex justify-content-center align-items-center rounded-4 p-2 my-1"
        :href="teamUrl"
      >
        コードなどの詳細はこちらから！
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.teamUrl{
  font-size: 1.5rem;
  background-color: grey;
  text-decoration: none;

  &:hover {
    filter:brightness(1.2);
  }
}

/*ツール*/
.btn-edit{
  background: skyblue;
  z-index: 100;
  font-size: 1.5rem;
  text-decoration: none;
  a {
    i {
      font-size: 2rem;
    }
  }

  &:hover {
    filter: brightness(0.9);
  }
}

.is-active {
  background-color: lightblue;
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
  input{
    min-width: 200px;
  }
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