import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBk0RTsXFVkkSGqwN7yHn-A86RYkh0ETv8",
  authDomain: "multisense-glove.firebaseapp.com",
  databaseURL: "https://multisense-glove-default-rtdb.firebaseio.com",
  projectId: "multisense-glove",
  storageBucket: "multisense-glove.firebasestorage.app",
  messagingSenderId: "489169959219",
  appId: "1:489169959219:web:eea63e2e2fc548356ca646"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Gesture
onValue(ref(db, "gesture"), (snapshot) => {

  const gesture = snapshot.val();

  document.getElementById("gestureText").innerText =
    gesture || "Waiting...";

  document.getElementById("voiceOutput").innerText =
    gesture || "--";

  document.getElementById("ttsText").innerText =
    gesture || "Waiting...";

  document.getElementById("oledGesture").innerText =
    gesture || "--";
});

// Thumb
onValue(ref(db, "thumb"), (snapshot) => {

  const value = snapshot.val() || 0;

  document.getElementById("thumbValue").innerText = value;

  document.getElementById("thumbFill").style.width =
    (value / 4095 * 100) + "%";
});

// Index
onValue(ref(db, "index"), (snapshot) => {

  const value = snapshot.val() || 0;

  document.getElementById("indexValue").innerText = value;

  document.getElementById("indexFill").style.width =
    (value / 4095 * 100) + "%";
});

// Middle
onValue(ref(db, "middle"), (snapshot) => {

  const value = snapshot.val() || 0;

  document.getElementById("middleValue").innerText = value;

  document.getElementById("middleFill").style.width =
    (value / 4095 * 100) + "%";
});

// Ring
onValue(ref(db, "ring"), (snapshot) => {

  const value = snapshot.val() || 0;

  document.getElementById("ringValue").innerText = value;

  document.getElementById("ringFill").style.width =
    (value / 4095 * 100) + "%";
});

// Pinky
onValue(ref(db, "little"), (snapshot) => {

  const value = snapshot.val() || 0;

  document.getElementById("pinkyValue").innerText = value;

  document.getElementById("pinkyFill").style.width =
    (value / 4095 * 100) + "%";
});

// Connection status
document.getElementById("wifiStatus").innerText =
  "Firebase Connected";

document.getElementById("wifiStatusCard").innerText =
  "Online";

document.getElementById("esp32Status").innerText =
  "Connected";
