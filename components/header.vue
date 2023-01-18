<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDocs, collection, query, Query, where } from '@firebase/firestore';
import { navigateTo } from '#app';

//これは別のファイルで管理した方が良い
const grades: { [K: string]: string } = {
  soft1: "ソフトⅠ",
  soft2: "ソフトⅡ",
  soft3: "ソフトⅢ",
  soft4: "ソフトⅣ",
  ai1: "AIⅠ",
  ai2: "AIⅡ"
}

const yearsData = ref<{[K: string]: Array<string>}>({});
const email = ref<string>("");
const myTeam = ref<{[K: string]: string}>({});

// // ログアウト
const signout = () => {
  //getAuthを関数の中に入れないとエラー出る
  const auth = getAuth();
  if(window.confirm('サインアウトします。')){
    signOut(auth).then(() => {
      navigateTo('/login');
    }).catch((error) => {
      console.error(error);
    })
  }
}

// 学年のデータをセット
const setGrade = async () => {

  const db = getFirestore();

  // 後からプロパティが追加できる構造
  const years: { [K: string]: Array<string> } = {};
  
  // gradesが変化しても配列が作れるように
  for(const grade in grades){
    const querySnapshot = await getDocs(collection(db, grade));

    // オブジェクトにプロパティ追加
    years[grade] = [];

    // 値を追加
    querySnapshot.forEach((doc) => {
      years[grade].push(doc.id);
    });

    // test
    // for(let i = 0; i <= 30; i++){
    //   years[grade].push(String(i))
    // }

    // console.log(years);
  }

  yearsData.value = years;
}

// これが無いとメアド取れない
const setEmail = async () => {
  getAuth().onAuthStateChanged((user) => {
    if(user && user.email){
      email.value = user.email;
    }
  });
}

// データを変数に入れる
const setData = async (_query: Query) => {
  const querySnapshot = await getDocs(_query);
  querySnapshot.forEach((doc) => {
    myTeam.value[doc.data().team_grade] = doc.id;
  });

  // console.log(myTeam.value);
}

// myteamを取得
const setMyTeam = async () => {
  const db = getFirestore();

  if(email.value){
    const gradeRef = collection(db, "kdData");
    // email検索
    const _query = query( gradeRef, where("members", "array-contains", email.value));
    await setData(_query);
  }
}

// メアド取得
await setEmail();

onMounted(async () => {
  console.log("header loaded");
  await setGrade();
  await setMyTeam();
});

</script>
<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img width="220" src="../assets/KDHub(影).png">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#headerNav" aria-controls="headerNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <div 
        id="headerNav"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav w-100 justify-content-around pe-2">
          <li 
            v-for="(value, key) in grades"
            :key="key"
            class="nav-item dropdown rounded-2"
          >
            <a 
              :id="`navbarDropdown-${key}`"
              class="nav-link text-white dropdown-toggle"
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ value }}
            </a>
            <ul 
              class="dropdown-menu"
              :aria-labelledby="`navbarDropdown-${key}`"
            >
              <!-- 全て表示 -->
              <li>
                <a
                  class="dropdown-item text-white text-center"
                  :href="`/displayTeams?grade=${key}`"
                >
                  全て表示
                </a>
                <hr class="dropdown-divider">
              </li>
              <!-- 自分のチーム -->
              <li v-if="myTeam[key]">
                <a
                  class="dropdown-item text-white text-center"
                  :href="`/teampage?id=${myTeam[key]}`"
                >
                  マイチーム
                </a>
                <hr class="dropdown-divider">
              </li>
              <!-- 年度一覧 -->
              <li 
                v-for="year in yearsData[key]"
                :key="year"
                class="text-center p-0"
              >
                <a 
                  class="dropdown-item  text-white d-block"
                  :href="`/displayTeams?grade=${key}&year=${year}`"
                >
                  {{ year }}年度
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div class="align-items-end">
          <h1 class="m-0 d-flex justify-content-center">
            <i 
              class="mdi mdi-magnify me-4" 
              data-bs-toggle="modal" 
              data-bs-target="#search-component"
              style="color:#ffffff; font-size: 3rem;" 
            />
            <i 
              class="mdi mdi-logout" 
              style="color:#ffffff; font-size: 2.8rem" 
              @click="signout" 
            />
          </h1>
        </div>
      </div>
    </div>
  </nav>
  <SearchComponent />
</template>

<style lang="scss" scoped>
.navbar {

  &,.dropdown-menu,.dropdown-item {
    background: rgb(85, 172, 196);
    font-size: 1.5rem;
  }

  .dropdown-menu {
    // border: 0.1rem solid black;
    max-height: 200px;
    overflow-y: scroll;
  }

  .dropdown-item:hover {
    opacity: 0.5;
  }

  .nav-link:hover {
    opacity: 0.5;
  }

  .mdi{
    cursor: pointer;
  }

  .mdi:hover{
    opacity: 0.5;
  }
}
</style>
