
// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAnalytics } from "@firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "@firebase/app-check";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDOkFPWP7ijPMThVgkQRxBGztQJI41hQmI",
    authDomain: "tesis-creator.firebaseapp.com",
    projectId: "tesis-creator",
    storageBucket: "tesis-creator.appspot.com",
    messagingSenderId: "516391769435",
    appId: "1:516391769435:web:010bd358d40cd187aaf67e",
    measurementId: "G-M1N9FEN29F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("AIzaSyDOkFPWP7ijPMThVgkQRxBGztQJI41hQmI"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: false,
// });


const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore();