importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD6KuVD2PGaQG5s1x9JzN6rY40VrvB-mgQ",
  authDomain: "mazad-3arabety.firebaseapp.com",
  projectId: "mazad-3arabety",
  storageBucket: "mazad-3arabety.firebasestorage.app",
  messagingSenderId: "147335979279",
  appId: "1:147335979279:web:96e0e9d09186c74f211e7a"
});

const messaging = firebase.messaging();