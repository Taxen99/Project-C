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
let member = false;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userData = user;
    username = capatalizeFullName(user.displayName);
    let ref = database.ref("permissions/" + userData.uid);
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      member = data > 0 ? true : false;
    });
    ref = database.ref("control");
    ref.on("value", (snapshot) => {
      if(member) {
        let data = snapshot.val();
        createChatFramData(data);
      }
    });
  } else {
    userData = null;
    username = null
    member = false;
  }
});

// Code

function createChatFramData(data) {
  clearMessages();
  let keys = Object.keys(data);
  let links = [];
  for(let i of keys) {
    links.push(data[i]);
  }
  for(let i = 0; i < links.length; i++) {
    let a = document.createElement("a");
    a.href = links[i].link;
    a.appendChild(document.createTextNode(links[i].name));
    links_.appendChild(a);
  }
}

function clearMessages() {
  for(let i = links_.children.length - 1; i >= 0; i--) {
    links_.removeChild(links_.children[i]);
  }
}

function capatalizeFullName(name) {
  let words = name.toLowerCase().split(" ");
  for(let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  return words.join(" ");
}

let links_ = document.getElementById("links");
let back_ = document.getElementById("back");

back_.addEventListener("click", () => {
  window.location.href = "/";
});
