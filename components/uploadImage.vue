<script lang="ts" setup>
import { ref } from 'vue';

const base64Image = ref<string>("");
const url = ref<string>("");

const emit = defineEmits(['base64Image']);
const emitImage = (image: string) => emit('base64Image', image);


const mb = 5;
const sizeLimit = 1024 * 1024 * mb;  // 制限サイズ 1mb

const filesInput = (event: Event) => {
  if(!event.target) return;
  const files = ((event.target as HTMLInputElement).files as FileList);
  imageToBase64(files);
}

const filesDragInput = (event: DragEvent) => {
  if(!event.dataTransfer) return;
  const files = event.dataTransfer.files;
  imageToBase64(files);
}

const imageToBase64 = (files: FileList) => {
  // console.log(files);

  if(files.length !== 1) { console.log("複数のファイルが選択されています。"); }
  else if(files[0].type.indexOf("image") !== 0) { console.log("画像ファイルではありません。"); }
  else if(files[0].size > sizeLimit) { console.log(`ファイルの最大サイズは${mb}MBです。`); }
  else{
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    // 変換が終わると実行
    reader.onload = () => {
      let image = (reader.result as string | undefined);
      if(image !== undefined) {
        base64Image.value = image;
      }
    }
  }
}

const setImage = async (image: string) => {
  await emitImage(image);
  base64Image.value = '';
  url.value = '';
}


</script>

<template>
  <div style="display: none;">
    <input
      ref="input"
      style="display: none"
      type="file"
      accept="image/jpeg, image/jpg, image/png"
      @change="filesInput($event)"
    >
  </div>
  <div>
    <!-- 表示する機能 -->
    <div class="modal fade" style="width: 100vw;" id="upload-image" data-bs-backdrop="true" data-bs-keyboard="false" tabindex="4" aria-labelledby="upload-imageLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <!-- <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div> -->
          <div class="modal-body">
            <div v-if="!url" class="">
              <span style="color: black;">画像を挿入します</span>
              <div
                class="droparea"
                @click="() => {($refs.input as any).click()}"
                @dragover.prevent
                @drop.prevent="filesDragInput($event)"
              >
                <span 
                  v-if="!base64Image" 
                  class="drop-span text-white h-100 gap-2 d-flex flex-column justify-content-center align-items-center"
                >
                  <span>ここに画像をドロップ</span>
                  <span>または</span>
                  <button 
                    type="button"
                    class="btn btn-light p-1"
                  >ファイルを選択</button>
                </span>
                <img 
                  class="img-fluid w-100 rounded-0"
                  :src="base64Image"
                >
              </div>
            </div>
            <br>
            <div v-if="!base64Image">
              <input 
                v-model="url"
                type="text"
                style="width: 100%;"
                placeholder="URLを入力"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
              @click="base64Image = ''"
            >
              Cancel
            </button>

            <!--  1mbの制限があるからローカルは保存は出来ないにする -->
            <!-- <button
              v-if="base64Image || url"
              type="button" 
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="setImage(base64Image ? base64Image : url)"
            >
              OK
            </button> -->

            <!-- urlだけ許可されたボタン -->
            <button
              v-if="url"
              type="button" 
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="setImage(url)"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>


.droparea {
  // width: 100%;
  height: 30vh;
  background-color: gray;
}
</style>