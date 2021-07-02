// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5CVVLhrFJ6TNLDejFy3MuIMzYfSFPbk4",
  authDomain: "project-p-4b561.firebaseapp.com",
  databaseURL: "https://project-p-4b561-default-rtdb.firebaseio.com",
  projectId: "project-p-4b561",
  storageBucket: "project-p-4b561.appspot.com",
  messagingSenderId: "317284365097",
  appId: "1:317284365097:web:32dc315da5309556097d38",
  measurementId: "G-V27QPKNYK0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let database = firebase.database();

let userData = null;
let username = null;
let permissions = 0;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userData = user;
    username = capatalizeFullName(user.displayName);
    username_.innerText = username;
    let ref = database.ref("permissions/" + userData.uid);
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      permissions = data || 0;
      disableAccountButtons();
      if(permissions == 0) ref.set(0);
    });
  } else {
    userData = null;
    username = null
    permissions = false;
    username_.innerText = "Please Sign In";
    disableAccountButtons();
  }
});

// Code

function capatalizeFullName(name) {
  let words = name.toLowerCase().split(" ");
  for(let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  return words.join(" ");
}

let logout_ = document.getElementById("logout");
let username_ = document.getElementById("username");
let verify_ = document.getElementById("verify");
let chat_ = document.getElementById("chat");
let control_ = document.getElementById("control");
let console_ = document.getElementById("console");
let login_ = document.getElementById("login");
let contact_ = document.getElementById("contact");

chat_.addEventListener("click", () => {
  window.location.href = "/chat/index.html";
});

logout_.addEventListener("click", () => {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
});

login_.addEventListener("click", () => {
  window.location.href = "/login/index.html";
});

contact_.addEventListener("click", () => {
  window.location.href = "mailto:ggpro79gotohell@gmail.com";
});

control_.addEventListener("click", () => {
  window.location.href = "/control/index.html";
});

console_.addEventListener("click", () => {
  window.location.href = "/console/index.html";
});

verify_.addEventListener("click", () => {
  userData.sendEmailVerification().then(function() {
      alert("Verification Sent")
    }).catch(function(error) {
      alert("error: " + error);
    });
});

function disableAccountButtons() {
  if(userData) logout_.disabled = false;
  if(!(userData)) logout_.disabled = true;
  if(userData) login.disabled = true;
  if(!(userData)) login.disabled = false;
  if(userData) {
    if(userData.emailVerified) verify_.disabled = true;
    if(!(userData.emailVerified)) verify_.disabled = false;
    if(userData.emailVerified) chat_.disabled = false;
    if(!(userData.emailVerified)) chat_.disabled = true;
  } else {
    verify_.disabled = true;
    chat_.disabled = true;
  }
  contact_.disabled = false;
  if(permissions > 0 && permissions) control_.disabled = false;
  if(!(permissions > 0)) control_.disabled = true;
  if(permissions > 2 && permissions) console_.disabled = false;
  if(!(permissions > 2)) console_.disabled = true;
}

disableAccountButtons();
