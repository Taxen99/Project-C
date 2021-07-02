// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyA5CVVLhrFJ6TNLDejFy3MuIMzYfSFPbk4",
  authDomain: "project-p-4b561.firebaseapp.com",
  projectId: "project-p-4b561",
  storageBucket: "project-p-4b561.appspot.com",
  messagingSenderId: "317284365097",
  appId: "1:317284365097:web:32dc315da5309556097d38",
  measurementId: "G-V27QPKNYK0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let ui = new firebaseui.auth.AuthUI(firebase.auth());

let uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      return true;
    },
    uiShown: function() {
      document.getElementById('loader').style.display = 'none';
    }
  },
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '/policies/tos.html',
  privacyPolicyUrl: '/policies/pp.html'
};

ui.start('#firebaseui-auth-container', uiConfig);
