import { getAuth } from "firebase/auth";

//userの確認
export default defineNuxtRouteMiddleware(async () => {
  //クライアント側で処理する
  if (!process.server) {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (!user || !(user.email)?.includes("@st.kobedenshi.ac.jp")) {
        //認証出来てなかったらloginに移動
        navigateTo("/login");
        console.log('no user');
      }
    });
  }
});