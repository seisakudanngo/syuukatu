<script setup lang="ts">
import { ref } from "vue";

// componentsにデータを渡す
const mainContent = ref("<p></p>" as string);

</script>

<template>
  <div>
    <div class="teampage-editor mx-auto p-1">
      <PageView
        v-model:editorContent="mainContent"
      />
    </div>
    <div 
      class="pagetop-btn d-flex justify-content-center align-items-center" 
      style="display: block;"
    >
      <a 
        class="d-block"
        href="#"
      >
        <i class="mdi mdi-chevron-up text-white" />
      </a>
    </div>
  </div>
</template>


<style lang="scss" scoped>
/* Basic editor styles */
.teampage-editor {
  max-width: 1000px;
}

/* ツールボタン */
.pagetop-btn{
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
</style>