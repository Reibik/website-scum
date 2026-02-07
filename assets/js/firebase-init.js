// assets/js/firebase-init.js

// ВСТАВЬ СЮДА СВОИ ДАННЫЕ ИЗ КОНСОЛИ FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAgUn4cTjXCqWAKtenBgav8WY2KpHlmv1o",
    authDomain: "elonscumweb.firebaseapp.com",
    databaseURL: "https://elonscumweb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "elonscumweb",
    storageBucket: "elonscumweb.firebasestorage.app",
    messagingSenderId: "754190799787",
    appId: "1:754190799787:web:65a5f67d4787527816b8ee",
    measurementId: "G-DTRXD42HGV"
  };

// Инициализация (Не трогать)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();