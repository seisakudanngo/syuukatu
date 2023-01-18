<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getFirestore, getDocs, collection} from '@firebase/firestore';

// これは別のファイルで管理した方が良い
const grades: { [K: string]: string } = {
  soft1: "ソフトⅠ",
  soft2: "ソフトⅡ",
  soft3: "ソフトⅢ",
  soft4: "ソフトⅣ",
  ai1: "AIⅠ",
  ai2: "AIⅡ"
}
const grade = ref<string>("");
const year = ref<number>();

// タグのデータ取得
const tags: { [K: string]: number } = {};
const db = getFirestore();
const querySnapshot = await getDocs(collection(db, "tags"));

// tagsにタグのデータ追加
querySnapshot.forEach((doc) => {
  tags[doc.id] = doc.data().count;
})
// console.log(tags);

// 値確認
const checkDigit = (value: number, digit: number): boolean => {
  if(!(String(value).length > digit)){
    console.log(String(value).length)
    return true;
  }else{
    return false;
  }
}

// 年
watch(() => year.value, () => {
  if(!year.value) { return; }
  checkDigit(year.value, 4) ? "" : year.value = Math.floor(year.value / 10);
});

</script>
<template>
  <div class="modal fade" id="search-component" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="centerboxes">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable w-auto">
        <div class="modal-content">
          <div class="modal-header text-center">
            <h5 class="modal-title w-100" id="staticBackdropLabel">検索画面</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            オプション
            <div class="search-options mt-1">
              <div class="option d-flex align-items-center my-1">
                <span class="text-end px-2">
                  コース名 :
                </span>
                <select 
                  v-model="grade"
                  class="w-50 form-select p-1"
                >
                  <option value="">
                    なし
                  </option>
                  <option 
                    v-for="(_grade, key ) in grades" 
                    :key="key" 
                    :value="key"
                  >
                    {{ _grade }}
                  </option>
                </select>
              </div>
              <div class="option d-flex align-items-center my-1">
                <span class="text-end px-2">
                  年度 :
                </span>
                <!-- <h1>{{ team_year }}</h1> -->
                <input 
                  id="year"
                  v-model.number="year"
                  type="number"
                  class="form-control p-1 w-50"
                >
              </div>
            </div>
            <hr>
            
            タグ
            <div class="text-center mt-1">
              <span 
                v-for="(value, tag , index) in tags" 
                :key="tag"
                class="px-1 btn-outline-info"
              >
                <a 
                  class="frame text-dark" 
                  :href="
                    `/displayTeams?search=${tag}` + 
                      (grade !== ``? `&grade=${grade}` : ``) +
                      (typeof year === `number` ? `&year=${String(year)}` : ``)
                  "
                >
                  {{ tag }}<span class="badge rounded-pill bg-light text-dark">{{ value }}</span>
                </a>
                <div v-if=" (index + 1) % 4 === 0">
                  <br>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.search-options {
  span {
    width: 40%;
  }

  .form-select, .form-control {
    background-color: whitesmoke;
    &:focus {
      border-color: none;
      box-shadow: none;
    }
  }
}

.modal-dialog{
  max-width: 100%;
  // width: auto !important;
  display: inline-block;
}
.frame{
  padding:0.4rem;
  justify-content: center;
  align-items: center;
  text-decoration-line: none;
  // color: rgb(0, 0, 0);
  background-color: rgba(255, 248, 240, 0.899);
  border-radius: 3em;
  box-shadow: 0 5px 8px 0 rgba(76, 85, 88, 0.5);
}
.frame:hover{
  color: blue;
}
.centerboxes{
  justify-content: center;
  align-items: center;
  text-align: center; 
  margin-top: 30vh;
}
.badge{
  font-size: 1rem;
}
</style>