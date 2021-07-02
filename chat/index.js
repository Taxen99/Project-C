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
let ref = database.ref("chat");
ref.on("value", (snapshot) => {
  let data = snapshot.val();
  createChatFramData(data);
});

let userData = null;
let username = null;
let admin = false;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userData = user;
    username = capatalizeFullName(user.displayName);
    let ref = database.ref("permissions/" + userData.uid);
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      admin = data === 3 ? true : false;
      disableRemoveButtons();
    });
  } else {
    userData = null;
    username = null
    admin = false;
    disableRemoveButtons();
  }
});

// Code

function createChatFramData(data) {
  clearMessages();
  let keys = Object.keys(data);
  let messages = [];
  for(let i of keys) {
    messages.push({m: data[i], k: i});
  }
  messages.sort((a, b) => a.m.date - b.m.date);
  for(let i = 0; i < messages.length; i++) {
    let div = document.createElement("div");
    div.classList.add("message");
    let p = document.createElement("p");
    p.classList.add("mp");
    let button = document.createElement("button");
    button.classList.add("delete");
    p.appendChild(document.createTextNode(messages[i].m.mess + " - " + messages[i].m.name));
    button.appendChild(document.createTextNode("Delete"));
    div.appendChild(p);
    div.appendChild(button);
    messages_.appendChild(div);
    button.addEventListener("click", () => {
      let ref = database.ref("chat/" + messages[i].k);
      ref.set(null);
    });
  }
  disableRemoveButtons();
}

function capatalizeFullName(name) {
  let words = name.toLowerCase().split(" ");
  for(let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  return words.join(" ");
}

function clearMessages() {
  for(let i = messages_.children.length - 1; i >= 0; i--) {
    messages_.removeChild(messages_.children[i]);
  }
}

let messages_ = document.getElementById("messages");
let message_ = document.getElementById("message");
let back_ = document.getElementById("back");
let send_ = document.getElementById("send");

back_.addEventListener("click", () => {
  window.location.href = "/index.html";
});

send_.addEventListener("click", () => {
  let message = {name: username, mess: message_.value, date: new Date().getTime()};
  let ref = database.ref("chat");
  ref.push(message);
  message_.value = "";
});

function disableRemoveButtons() {
  let buttons = document.getElementsByClassName("delete");
  for(let i of buttons) {
    i.disabled = !admin;
  }
}
