<script lang="ts" setup>
import { getAuth, signOut } from 'firebase/auth';
import { navigateTo } from '#app';

// // ログアウト
const signout = () => {
  //getAuthを関数の中に入れないとエラー出る
  const auth = getAuth();
  signOut(auth).then(() => {
    alert('サインアウトしました。');
    navigateTo('/');
  }).catch((error) => {
    console.error(error);
  })
}

</script>

<template>
  <div>
    <button @click="signout">
      signout
    </button>
  </div>
</template>