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
let admin = 0;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userData = user;
    username = capatalizeFullName(user.displayName);
    let ref = database.ref("permissions/" + userData.uid);
    ref.on("value", (snapshot) => {
      let data = snapshot.val();
      admin = data === 3 ? true : false;
      if(!admin) noAuth();
      if(admin) {
        displayResponse(`Welcome ${username} to the console.`, true);
        displayResponse("If you need help type .help in the textbox", true);
      }
    });
  } else {
    userData = null;
    username = null
    admin = false;
    noAuth;
  }
});

// Code

function noAuth() {
  clearAll();
  displayResponse("You are not authorised", true);
  body_.style.color = "red";
}

function displayResponse(response, raw) {
  let p = document.createElement("p");
  p.innerText = raw || Number(response) ? response : JSON.stringify(response);
  commands_.appendChild(p);
}

function newLine() {
  let p = document.createElement("p");
  p.innerText = "\n";
  commands_.appendChild(p);
}

function capatalizeFullName(name) {
  let words = name.toLowerCase().split(" ");
  for(let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  return words.join(" ");
}

function clearAll() {
  for(let i = commands_.children.length - 1; i >= 0; i--) {
    commands_.removeChild(commands_.children[i]);
  }
}

function storeSettings() {
  localStorage.setItem("fc", body_.style.color);
  localStorage.setItem("bc", body_.style.backgroundColor);
}

function loadSettings() {
  body_.style.color = localStorage.getItem("fc");
  body_.style.backgroundColor = localStorage.getItem("bc");
}

let commandList = {clear: sub => {clearAll()},
  nl: sub => {newLine();},
  back: sub => {window.location.href = "/";},
  color: sub => {body_.style.color = sub; storeSettings();},
  background: sub => {body_.style.backgroundColor = sub; storeSettings();},
  read: sub => {
    let ref = firebase.database().ref(sub + "");
    ref.get().then((snapshot) => {
      if (snapshot.exists()) {
        displayResponse(snapshot.val());
      } else {
        return displayResponse("No data available");
      }
    }).catch((error) => {
      return displayResponse(error);
    });
  },
  write: sub => {
    let ref = firebase.database().ref(sub[0]);
    ref.set(sub[1]);
    if(sub[1]) displayResponse(sub[1]);
  },
  chat: sub => {
    let message = {name: sub[1] || username, mess: sub[0], date: sub[2] || new Date().getTime()};
    let ref = database.ref("chat");
    ref.push(message);
    displayResponse(message);
  },
  account: sub => {
    if(sub[0] == "uid") {
      return displayResponse(userData.uid);
    }
    let ref = database.ref("permissions/" + sub[0]);
    ref.set(Number(sub[1]) || 0);
    displayResponse(Number(sub[1]) || 0);
  },
  help: sub => {
    if(sub.length) return displayResponse(help[sub[0]] || "Invalid Command", true);
    displayResponse(".clear - Clears the console", true);
    displayResponse(".nl - Creates a new line in the console", true);
    displayResponse(".back - Returns to Home Page", true);
    displayResponse(".color - Sets foreground color - COLOR", true);
    displayResponse(".background - Sets background color - COLOR", true);
    displayResponse(".read - Reads data from specified path - PATH", true);
    displayResponse(".write - Writes to the specified path - PATH DATA", true);
    displayResponse(".chat - Creates a new post in the chat - TEXT NAME TIME", true);
    displayResponse(".account - Gets uid if the first argument is 'uid'", true);
    displayResponse(".account - Sets permissions for the specified uid - UID PERMISSION_LEVEL", true);
    displayResponse(".help - Displays the help menu or information about a specific command if specified - COMMAND", true);
    displayResponse(".log - Logs data to the console - DATA RAW", true);
    displayResponse("Commands that don't start with a '.' will be executed as regular javascript", true);
  },
  log: sub => {displayResponse(sub[0], sub[1]);}
}

let help = {
  clear: "Clears all text in the console, even the welcome text. This will not undo any commands and will not stop any ongoing commands and and arguments passed in will be ignored.",
  nl: "Creates a new line, all agruments will be ignored.",
  back: "Returns to the home page, all agruments will be ignored.",
  color: "Sets the text color, the first argument is color. Examples: .color.red .color.#ff558a.",
  background: "Sets the background color, the first argument is color. Examples: .background.blue .background.#a5f4dd.",
  read: "Reads data from the specified path, will not return data if you don't have permissions to acsess, the first argument is the path. Examples: .read.chat .read.control/danyar/link.",
  write: "Writes data the specified path, will not write data if you don't have permissions to acsess, the first argument is the path and the second is data. Example: .write.test/testing.12345.",
  chat: "Adds a messsge to the chat, the first argument is message, the second is username, the default is the current username and the third is time, the default is the current time. Examples: .chat.hi .chat.i am first.a guy.1",
  account: "If first argument is 'uid' then it will return the current uid, else it will change the permissions of the specified account, the first argument is 'uid' or the uid of the account you want to change the permissions of, the second is permission 0 is default 1 is member 3 is admin. Examples: .account.uid .account.MlgeWrkbBcR9tFW1OVOz6PuuCsI3.3",
  help: "If no arguments are specified then it will display the help menu, else it will display help for the specified command, the first argument is the command you want to get help with. Examples: .help .help.nl .help.chat",
  log: "Logs a message to the console, this will not effect anyting and it is purely visual, the first argument is the messege to log. Example: .log.this is a test!"
};

function runCommand(command) {
  let commands = command.slice(1).split(".");
  commandList[commands[0]](commands.slice(1));
}

let body_ = document.querySelector("body");
let commands_ = document.getElementById("commands");
let command_ = document.getElementById("command");

loadSettings();

let preCommands = [];
let preCount = 0;

command_.addEventListener("keyup", e => {
  if(e.key === "Enter" && admin) {
    preCommands.push(command_.value);
    let input = command_.value;
    command_.value = "";
    if(input[0] === ".") return runCommand(input);
    let response = eval(input);
    if(response !== undefined) displayResponse(response);
  }
  if(e.key === "ArrowUp" && admin && preCommands.length != 0) {
    if(preCount > 0) preCount--;
    command_.value = preCommands[preCommands.length - 1 - preCount];
  }
  if(e.key === "ArrowDown" && admin && preCommands.length != 0) {
    if(preCommands.length - 1 > preCount) preCount++;
    command_.value = preCommands[preCommands.length - 1 - preCount];
  }
});
