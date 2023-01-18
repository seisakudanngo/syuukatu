<template>
  <div class="text-center pt-5">
    <img src="/_nuxt/assets/404.jpg" class="img-fluid w-25">
    <h3>申し訳ございません。<br>ご指定のページが見つかりませんでした。</h3>
    <a href="/" class="btn btn-edit text-white">ホームへ戻る</a>
  </div>
</template>

<style lang="scss" scoped>

.btn-edit{
  background: skyblue;
  z-index: 100;
  font-size: 1.2rem;
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

</style>