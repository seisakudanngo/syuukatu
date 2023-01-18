<script lang="ts" setup>
// https://github.com/firebase/firebaseui-web ここを参考にした
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { onMounted } from "vue";

const ui = new firebaseui.auth.AuthUI(getAuth());
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    { 
      provider: GoogleAuthProvider.PROVIDER_ID,
      buttonColor: 'white'
    }
  ]
};

// dom作成後に実行しないとエラー
onMounted(() => {
  ui.start("#firebaseui-auth-container", uiConfig);
})
</script>
<template>
  <div>
    <div id="firebaseui-auth-container" />
  </div>
</template>