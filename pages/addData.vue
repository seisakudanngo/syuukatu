<script lang="ts" setup>
import { getFirestore, setDoc, doc, getDoc, increment } from 'firebase/firestore';
import { ref, watchEffect, watch } from 'vue';

const team_grade = ref<string>("soft1");
const team_year = ref<number>(2022);
const team_id = ref<string>("A");
//とりあえず8個
const member = ref<string>("");
const members = ref<Array<string>>([]);
const team_name = ref<string>("");
const title = ref<string>("");
const image = ref<string>("");

//これは他で管理した方が良い
// const grades = ["soft1", "soft2", "soft3", "soft4", "ai1", "ai2"]
const dbName = "kdData";

// 検索する値, 指定する桁
const checkDigit = (value: number, digit: number): boolean => {
  if(!(String(value).length > digit)){
    console.log(String(value).length)
    return true;
  }else{
    return false;
  }
}

// 年
watch(() => team_year.value, () => {
  checkDigit(team_year.value, 4) ? "" : team_year.value = Math.floor(team_year.value / 10);
});

// チームID upperCaseに入ると2桁の値の更新になるので、2周することになる
watch(() => team_id.value, () => {
  // console.log(team_id.value)
  if(!(/^[A-Z]/.test(team_id.value))){
    // console.log("koko")
    if(/^[a-z]/.test(team_id.value)){
      team_id.value = team_id.value.toUpperCase();
    }else{
      team_id.value = "A";
    }
  }else if(team_id.value.length !== 1){
    team_id.value = team_id.value.charAt(1);
  }
});

const addMembers = () => {
  if(!members.value) return;
  
  members.value.push(member.value + "@st.kobedenshi.ac.jp");
  member.value = "";
}

const addData = async () => {
  if(process.server) return;

  const _id = team_grade.value + String(team_year.value) + team_id.value;
  const db = getFirestore();
  const docRef = doc(db, dbName, _id);

  const docData = {
    data: `<h1>${_id}</h1>`,
    id: _id,
    image: image.value,
    members: members.value,
    tags: ["", "", "", ""],
    team_name: team_name.value,
    title: title.value,
    url: "",
    team_grade: team_grade.value,
    team_year: String(team_year.value),
    team_id: team_id.value,
  }
  // データ保存
  await setDoc(docRef, docData, {merge: true});

  // チーム数のカウント
  const softDoc = doc(db, team_grade.value, String(team_year.value));
  // データが存在する場合
  if( (await getDoc(softDoc)).exists() === false ){
    await setDoc( softDoc, {count: 1} );
  }else{
    await setDoc( softDoc, {count: increment(1)}, {merge: true} );
  }
  // console.log(grades[team_grade.value - 1]);

  member.value = "";
  members.value = [];
  team_name.value = "";
  title.value = "";
  image.value = "";
}


</script>

<template>
  <div class="d-flex justify-content-center">
    <div
      class="p-2 bg-white border rounded-3 p-3"
      style="min-width: 25vw;"
    >
      <div class="d-inline-block">
        <h3>コースを選択</h3>
        <!-- <h1>{{ grade }}</h1> -->
        <div class="form-radio">
          <div class="row">
            <div>
              <label>
                <input class="form-check-input fs-4 me-1" type="radio" name="radio" value="soft1" v-model="team_grade" checked/>
                <span class="fs-4 me-3">ソフトⅠ</span>
              </label>
              <label>
                <input class="form-check-input fs-4 me-1" type="radio" name="radio" value="soft2" v-model="team_grade" />
                <span class="fs-4 me-3">ソフトⅡ</span>
              </label>
              <label>
                <input class="form-check-input fs-4 me-1" type="radio" name="radio" value="soft3" v-model="team_grade" />
                <span class="fs-4 me-3">ソフトⅢ</span>
              </label>
              <label>
                <input class="form-check-input fs-4 me-1" type="radio" name="radio" value="soft4" v-model="team_grade" />
                <span class="fs-4 me-3">ソフトⅣ</span>
              </label>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label>
                <input class="form-check-input fs-4 me-1" type="radio" name="radio" value="ai1" v-model="team_grade" />
                <span class="fs-4 me-3">AIⅠ</span>
              </label>
              <label>
                <input class="form-check-input fs-4 me-1" type="radio" name="radio" value="ai2" v-model="team_grade" />
                <span class="fs-4">AIⅡ</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 class="mx-auto">年度を入力</h3>
        <!-- <h1>{{ team_year }}</h1> -->
        <input 
          v-model.number="team_year"
          type="number"
          class="form-control form-control-lg w-100"
          id="year"
        >
      </div>
      <div class="teamId">
        <h3>チームのIDを入力(A-Z)</h3>
        <input 
          v-model="team_id"
          type="text"
          class="form-control form-control-lg w-100"
          id="teamId"
        >
      </div>
      <!-- ここからオブジェクトの中身 -->
      <div class="mail">
        <h3>メンバーのメールアドレスを入力</h3>
        <!-- (kd1234567@st.kobedenshi.ac.jpの形式で入力) -->
        <div class="input-group mb-3 w-100">
          <input type="text" class="form-control" placeholder="kd1234567" v-model="member" id="mail">
          <span class="input-group-text" id="basic-addon2">@st.kobedenshi.ac.jp</span>
          <button @click="addMembers" class="btn btn-outline-primary">
            追加
          </button>
        </div>
        <div
          v-for="(item, index) in members" 
          :key="item"
        >
          {{ index + 1 }}人 : {{ item }}
          <button @click="members.splice(index, 1)" class="btn btn-outline-danger">
            削除
          </button>
        </div>
      </div>
      <div>
        <h3>チーム名を入力</h3>
        <input v-model="team_name" class="form-control form-control-lg w-100">
      </div>
      <div class="title">
        <h3>作品タイトルを入力</h3>
        <input v-model="title" class="form-control form-control-lg w-100" id="title">
      </div>
      <div class="poster">
        <h3>ポスターのURL設定</h3>
        <input v-model="image" class="form-control form-control-lg w-100" id="poster">
      </div>
      <div class="button mt-3">
        <button @click="addData" class="btn btn-primary btn-lg p-2">
          追加する
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>