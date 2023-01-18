<template>
  <div class="teams">
    <div v-if="teamsList[0]" class="d-flex flex-wrap justify-content-around">
      <div
        v-for="item in teamsList"
        :key="item.id"
        class="panel"
      >
        <div
          class="card border-0"
        >
          <!-- vhで指定することで横幅の変化でサイズが変わらないように -->
          <div 
            style="height: 45vh; display: flex; align-items: center;"
            class="product-box"
          >
            <a :href="'teampage?id=' + item.id">
              <img
                :src="item.image"
                class="card-img-top img-fluid rounded-0"
                onerror="
                  this.src='https://1.bp.blogspot.com/-D2I7Z7-HLGU/Xlyf7OYUi8I/AAAAAAABXq4/jZ0035aDGiE5dP3WiYhlSqhhMgGy8p7zACNcBGAsYHQ/s1600/no_image_square.jpg';
                "
              >
            </a>
          </div>
          <div class="card-body pt-0 ps-1 pe-1">
            <h5 
              class="card-title display-title mb-0"
            >
              {{ item.title }}
            </h5><br>
            <h5 
              class="card-title display-name mb-0"
            >
              {{ item.team_name }}
            </h5><br>
            <span 
              class="card-text"
              style="font-size: 0.8rem;"
            >
              {{ item.team_grade }}コース {{ item.team_year }}年度 {{ item.team_id }}チーム
            </span>
            <!-- <span class="card-text">[チーム名] {{ item.teamName }}</span> -->
            <div class="card-text display-tags">
              <div
                v-for="tag in item.tags"
                :key="tag"
                class="display-tag"
              >
                <a 
                  :href="`/displayTeams?search=${tag}`"
                  :title="`${tag}`"
                >
                  {{ tag }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-else
      style="height: 50vh;"
      class="px-5 gap-2 d-flex flex-column justify-content-center align-items-center"
    >
      <h1 class="h1">
        一致する情報は見つかりませんでした。
      </h1>
      <a 
        href="/" 
        class="btn btn-backhome text-dark"
      >
        ホームへ戻る
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router'
import { getFirestore, collection, getDocs, query, where, Query } from "firebase/firestore";

const route = useRoute();
const dbName = "kdData";

const teamsList = ref<any>([]);
// const team = ref<any>([]);
// const img = ref<any>([]);

// クエリの取得
const getQuery = (): Array<string | undefined> => {
  let _grade = route.query.grade ? String(route.query.grade) : undefined;  // 学年 ここでは objectのプロパティから検索
  let _year = route.query.year ? String(route.query.year) : undefined;     // 年
  let _search = String(route.query.search);  // 検索する文字列

  return [_grade, _year, _search];
}

// データを変数に入れる
const setData = async (_query: Query) => {
  const querySnapshot = await getDocs(_query);
  querySnapshot.forEach((doc) => {
    teamsList.value.push(doc.data());
  });
}

// 学年の一覧
const getGradeObject = async (_grade: string) => {
  if(process.server) { return; }

  const db = getFirestore();
  const _query = query( collection(db, dbName), where("team_grade", "==", _grade));
  
  setData(_query);
}

// 学年 + 年の一覧
const getObject = async (_grade: string, _year: string) => {
  if(process.server) { return; }

  const db = getFirestore();
  const _query = query( collection(db, dbName), where("team_grade", "==", _grade), where("team_year", "==", _year));
  
  setData(_query);
}

// 検索
const searchObject = async () => {
  if(process.server) { return; }
  //関数の中に書かないと値がundefinedになった
  const [_grade, _year, _search] = getQuery();
  if(!_search) { return; }

  console.log("searchObjの値:" + _search + ":" + _grade + ":" + _year );
  const db = getFirestore();
  const kdRef = collection(db, dbName);

  // 検索
  let _query: Query ;
  if( _grade && _year ){
    _query = query( kdRef, where("team_grade", "==", _grade), where("team_year", "==", _year) ,where("tags", "array-contains", _search));
  }else if(_grade){
    _query = query( kdRef, where("team_grade", "==", _grade), where("tags", "array-contains", _search));
  }else if(_year){
    _query = query( kdRef, where("team_year", "==", _year) , where("tags", "array-contains", _search));
  }else{
    _query = query( kdRef, where("tags", "array-contains", _search));
  }

  console.log(_grade);
  setData(_query);
}

// 初期データ
const gradeInit = async () => {
  if(process.server){ return; }
  // 検索するtagが存在する場合
  if( route.query.search ){
    // クエリパラメータは中で取得
    await searchObject();
  }
  // 学年に値がある場合
  else if( route.query.grade !== undefined ){
    let queryGrade = String(route.query.grade);
    if( route.query.year && queryGrade ){
      getObject(queryGrade, String(route.query.year));
    }else if( queryGrade ){
      getGradeObject(queryGrade);
    }else{
      // 値が変換できない場合
      return;
    }
  }
  //値がない場合
  else{
    return;
  }
}

// クエリパラメータ取得をdom更新後に実行
onMounted(() => {
  nextTick(() => {
    gradeInit();
  })
})

</script>

<style lang="scss" scoped>
.teams {
  .panel{
    width: 30vh;

    .product-box:hover{
        padding: 0.2rem;
        border: 1px solid var(--text-color);
    }
    
    .display-tags{
      height: 1.5rem;
      display: flex;
      justify-content: space-around;
      color: #fff;
      border-radius: 100vh;
      background: #fa4141;
      text-align: center;
    }
    .display-title{
      width: 100%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      line-height: normal;
    }
    .display-name{
      font-size: 1rem;
      width: 100%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      line-height: normal;
    }
    .display-tag{
      width: 22%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: normal;
      
      a {
        color: white;
        text-decoration: none;

        &:hover{
          text-decoration: underline;
        }
      }
    }
  }
}

.btn-backhome{
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
