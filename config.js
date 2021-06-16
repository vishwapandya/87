import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyAw_yrjGL51TOn4brh9Yka7Yu9bkjPSxPo",
  authDomain: "book-santa-d1d33.firebaseapp.com",
  projectId: "book-santa-d1d33",
  storageBucket: "book-santa-d1d33.appspot.com",
  messagingSenderId: "1086898961221",
  appId: "1:1086898961221:web:e934d3ec024c8d0876dc2c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
