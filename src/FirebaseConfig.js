import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBnJf39lB5wjEc6CxHWMhOgauOUZurKKc8",
    authDomain: "scrum-poker-8410b.firebaseapp.com",
    databaseURL: "https://scrum-poker-8410b.firebaseio.com",
    projectId: "scrum-poker-8410b",
    storageBucket: "scrum-poker-8410b.appspot.com",
    messagingSenderId: "776481092580",
    appId: "1:776481092580:web:d5981806e91221e5ad8df1",
    measurementId: "G-X60WV364K1"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
