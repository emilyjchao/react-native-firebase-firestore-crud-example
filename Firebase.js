import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

//Change this const in order to change the Firebase connection
const config = {
  apiKey: "AIzaSyD3LbiaTxDFLSzRZQD9qdn1spqp2zDaXaY",
  authDomain: "sleepdata-d5465.firebaseapp.com",
  databaseURL: "https://sleepdata-d5465.firebaseio.com/",
  projectId: "sleepdata-d5465",
  storageBucket: "sleepdata-d5465.appspot.com",
  messagingSenderId: "768093094444"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
