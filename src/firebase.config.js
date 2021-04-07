import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyD1ZNGirlaxWU4jZwdBl_9l_ppCTawzpbw",
    authDomain: "tototrivia.firebaseapp.com",
    projectId: "tototrivia",
    storageBucket: "tototrivia.appspot.com",
    messagingSenderId: "382271449481",
    appId: "1:382271449481:web:cad213ffddb26cd4dfd958",
    measurementId: "G-HB8TWY4MNW"
  };

  const firebaseApp=firebase.initializeApp(firebaseConfig);
  const db=firebase.firestore();

export default db;