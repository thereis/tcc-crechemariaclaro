import firebase from "firebase";

var config = {
  apiKey: "AIzaSyDDiOH3kq1Kl1UH3UZBmLKAJLabZIpJ56I",
  authDomain: "crechemariaclaro-b4c27.firebaseapp.com",
  databaseURL: "https://crechemariaclaro-b4c27.firebaseio.com",
  projectId: "crechemariaclaro-b4c27",
  storageBucket: "crechemariaclaro-b4c27.appspot.com",
  messagingSenderId: "862758918084"
};

firebase.initializeApp(config);
let firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

export { firebase, firestore };
