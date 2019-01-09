import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
  apiKey: "AIzaSyBa-cegrexbrmpiLh6r6PidPEotyqdJyvQ",
  authDomain: "intellsleep.firebaseapp.com",
  databaseURL: "https://intellsleep.firebaseio.com/",
  projectId: "intellsleep",
  storageBucket: "intellsleep.appspot.com",
  messagingSenderId: "774096563327"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
