<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";

// componentsにデータを渡す
const mainContent = ref<string>("<p></p>");

// 編集されたデータをセットする
const setContent = (text: any) => {
  mainContent.value = text;
}

// とりあえず毎回でるようにする
onMounted(() => {
  onbeforeunload = () => {
    console.log('beforeunload');
    return 'window onbeforeunload';
  }
})

</script>

<template>
  <div>
    <div class="editorpage-editor mx-auto p-1">
      <Tiptap
        v-model:editorContent="mainContent"
      />
      <div 
        class="p-4 rounded-4"
        style="background-color: rgb(239, 239, 239); background-color: rgb(239, 239, 239); box-shadow: 0rem 0rem 0.2rem 0rem black;"
      >
        <div class="fs-5">
          <b>HTMLコード</b>
        </div>
        <p 
          class="html-data w-100 text-nowrap overflow-hidden m-1 p-3 bg-white rounded-4"
        >
          {{ mainContent }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Basic editor styles */

.editorpage-editor {
  max-width: 1000px;
}

.html-data {
  cursor: pointer;
  user-select: all;
  text-overflow: ellipsis;
  box-shadow: 0rem 0rem 0.2rem 0rem grey;
}
</style>