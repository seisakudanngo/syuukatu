<script lang="ts" setup>
import { getFirestore, setDoc, doc, increment } from 'firebase/firestore';

const collections = ["soft1", "soft2", "soft3", "soft4", "ai1", "ai2"];

const init = async () => {
  if(process.server) { return; }

  const db = getFirestore();

  for(const col of collections){
    await setDoc(doc(db, col, "2022") , {
      count: 0
    })
  }

  await setDoc( doc(db, "tags", "C言語"), {
    count: 0
  })

  await setDoc( doc( db, "kdData", "soft12022A"), {
    data: `<h1>soft12022Aのデータ</h1>`,
    id: "soft12022A",
    image: "https://media.discordapp.net/attachments/899493248446394388/1052441988336721951/0G04037_8.png?width=429&height=605",
    members: [],
    tags: ["", "", "", ""],
    team_name: "soft12022Aのチーム名",
    title: "soft12022Aのタイトル",
    url: "",
    team_grade: "soft1",
    team_year: "2022",
    team_id: "A",
  })

  // countup
  await setDoc( doc(db, "soft1", "2022"), {
    count: increment(1)
  } )
}

</script>

<template>
  <div>
    <button @click="init">
      初期化ボタン
    </button>
  </div>
</template>