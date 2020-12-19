const firebase = require("firebase")

const firebaseConfig = {
    apiKey: "AIzaSyCBlhD8OR0KBeFEg0NEZ8l3NDHn3vDCtwo",
    authDomain: "react-f6828.firebaseapp.com",
    databaseURL: "https://react-f6828.firebaseio.com",
    projectId: "react-f6828",
    storageBucket: "react-f6828.appspot.com",
    messagingSenderId: "390339261983",
    appId: "1:390339261983:web:bfe770e42fd025bdba072a",
    measurementId: "G-XN1E6FX9G6"
  };

firebase.initializeApp(firebaseConfig);
// module.exports = firebase.firestore()
// console.log(firebase)
exports.firebase = firebase.firestore();