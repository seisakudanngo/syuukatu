<script lang="ts" setup>
import { useRuntimeConfig } from '#app';
const runtimeConfig = useRuntimeConfig();
</script>

<template>
  <div class="footer p-3">
    <div class="row d-flex text-white d-inline-block">
      <div class="col text-white text-center">
        <a 
          class="text-white"
          href="#"
        >
          Eチーム
        </a> 
        <div class="row text-white">
          <div class="col">
            0J01022
          </div>
          <div class="col">
            0J01023
          </div>
          <div class="col">
            0J01025
          </div>
        </div>
        <div class="row text-white">
          <div class="col">
            0J01027
          </div>
          <div class="col">
            0J01028
          </div>
          <div class="col">
            0J01035
          </div>
        </div>
      </div>
      <div class="col text-center">
        <br>
        <a 
          class="text-white"
          href="#"
        >
          ご意見
        </a> 
      </div>
      <div class="col text-center">
        <br>
        <a 
          class="text-white"
          href="/addData"
        >
          教員はこちら
        </a> 
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer{
  // フッターは伸びても大丈夫
  min-height: 10vh;
  background-color: black;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>