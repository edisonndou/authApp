// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcXJQgDByCwBAtBq-ow-qJ48Lu762z_3U",
  authDomain: "authapp-56fd6.firebaseapp.com",
  projectId: "authapp-56fd6",
  storageBucket: "authapp-56fd6.appspot.com",
  messagingSenderId: "650352489099",
  appId: "1:650352489099:ios:0c2f00376588c132191a8e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
