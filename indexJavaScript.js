// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed:', err);
      });
  });
} else {
  const prematchWidget = document.getElementById("prematch-widget");
  if (prematchWidget) {
    prematchWidget.style.display = "none";
  }
}

// Global gameData object (holds form data)
const gameData = {
  initials: "",
  matchNum: 0,
  robot: "",
  teamNum: 0,
  speakerScored: 0,
  speakerMissed: 0,
  tampScored: 0,
  tampMissed: 0,
  tspeakerScored: 0,
  tspeakerMissed: 0,
  noteTrap: 0,
  endPos: "",
  harmony: "",
  offSkill: "",
  defSkill: "",
  died: false,
  tippedOver: false,
  card: "",
  comments: "",
  speed: "",
  centerlineNotes: false,
  spotlight: ""
};

// Optional shortcut object
let smallify = {
  "Not_Observed": "NOB",
  "Choose_Answer": "CAN",
  "false": "no",
  "true": "yes",
  "NOB": "NOB",
  "CAN": "CAN",
  "yes": "yes",
  "no": "no"
};

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Teams competing array (example list)
var teamsCompeting = [67, 70, 78, 114, 175, 179, 219, 226, 578, 604, 1058, 1114, 1160, 1288, 1318, 1391, 1410, 1458, 1501, 1533, 1591, 1727, 1730, 1731, 2073, 2338, 2522, 2609, 2611, 2614, 2689, 2713, 2930, 2987, 3075, 3341, 3534, 3539, 3544, 4063, 4125, 4285, 4322, 4400, 4501, 4630, 5417, 5427, 5461, 5712, 5885, 5892, 6217, 6329, 6413, 6459, 6586, 6740, 6800, 6902, 7174, 7428, 7457, 7763, 8019, 8033, 8840, 9431, 9452, 9458, 9483, 9498, 9535, 9636, 9764];

function openPopup() {
  document.getElementById('popup').style.display = 'block';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function checkIfTeamSigma(enteredTeam) {
  return teamsCompeting.includes(enteredTeam);
}

function ClearAll() {
  document.getElementById('prematch-match-number').value = '';
  document.getElementById('prematch-team-number').value = '';
  document.getElementById('Died').checked = false;
  document.getElementById('Tipped-Over').checked = false;
  document.getElementById('Spotlight').checked = false;
  document.getElementById("centerlineNotes").checked = false;
  document.getElementById('End-Position').value = 'Choose_Answer';
  document.getElementById("Offensive Skill").value = 0;
  document.getElementById("Defensive Skill").value = 0;
  document.getElementById('Harmony').value = 'Choose_Answer';
  document.getElementById('Card').value = 'No_Card';
  document.getElementById('Comments').value = '';
  document.getElementById('Speed').value = 0;

  // Reset gameData values
  gameData.initials = '';
  gameData.matchNum = 0;
  gameData.robot = 'Choose_Answer';
  gameData.teamNum = 0;
  gameData.died = false;
  gameData.tippedOver = false;
  gameData.centerlineNotes = false;
  gameData.endPos = 'Choose_Answer';
  gameData.harmony = 'Choose_Answer';
  gameData.offSkill = 0;
  gameData.defSkill = 0;
  gameData.card = 'No_Card';
  gameData.comments = '';
  gameData.speakerScored = 0;
  gameData.speakerMissed = 0;
  gameData.tampScored = 0;
  gameData.tampMissed = 0;
  gameData.tspeakerScored = 0;
  gameData.tspeakerMissed = 0;
  gameData.noteTrap = 0;

  // Update displayed counters
  document.getElementById('speakerScored').textContent = gameData.speakerScored;
  document.getElementById('speakerMissed').textContent = gameData.speakerMissed;
  document.getElementById('tampScored').textContent = gameData.tampScored;
  document.getElementById('tampMissed').textContent = gameData.tampMissed;
  document.getElementById('tspeakerScored').textContent = gameData.tspeakerScored;
  document.getElementById('tspeakerMissed').textContent = gameData.tspeakerMissed;
  document.getElementById('noteTrap').textContent = gameData.noteTrap;
}

function updateButtonNum(variable, value) {
  gameData[variable] += value;
  gameData[variable] = Math.max(gameData[variable], 0);
  document.getElementById(variable).textContent = gameData[variable];
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', function(event) {
  event.preventDefault();
  deferredPrompt = event;
});

// The updateQRCodeOnSubmit function gathers all form values, creates a comma-delimited string,
// and generates a QR code in a pop-up—this pattern is similar to what the FRC Red Hawks app uses.
function updateQRCodeOnSubmit() {
  console.log("updateQRCodeOnSubmit called");
  
  // Validate required fields
  const scoutInitials = document.getElementById('prematch-scout-initials').value;
  const matchNumber = document.getElementById('prematch-match-number').value;
  const teamNumber = document.getElementById('prematch-team-number').value;
  const robot = document.getElementById('prematch-robot').value;
  
  if (scoutInitials === "" || matchNumber === "" || teamNumber === "" || robot === "Choose_Answer") {
    console.log("Validation failed: missing required fields");
    return;
  }
  
  // Update gameData with current form values
  gameData.initials = scoutInitials;
  gameData.matchNum = matchNumber;
  gameData.teamNum = teamNumber;
  gameData.robot = robot;
  gameData.centerlineNotes = document.getElementById('centerlineNotes').checked ? "yes" : "no";
  
  // Auto widget values
  gameData.speakerScored = document.getElementById('speakerScored').textContent;
  gameData.speakerMissed = document.getElementById('speakerMissed').textContent;
  
  // TeleOp widget values
  gameData.tampScored = document.getElementById('tampScored').textContent;
  gameData.tampMissed = document.getElementById('tampMissed').textContent;
  gameData.tspeakerScored = document.getElementById('tspeakerScored').textContent;
  gameData.tspeakerMissed = document.getElementById('tspeakerMissed').textContent;
  gameData.noteTrap = document.getElementById('noteTrap').textContent;
  
  // Endgame widget values
  gameData.spotlight = document.getElementById('Spotlight').checked ? "yes" : "no";
  gameData.endPos = document.getElementById('End-Position').value;
  gameData.harmony = document.getElementById('Harmony').value;
  
  // Postmatch widget values
  gameData.offSkill = document.getElementById("Offensive Skill").value;
  gameData.defSkill = document.getElementById("Defensive Skill").value;
  gameData.speed = document.getElementById('Speed').value;
  gameData.died = document.getElementById('Died').checked ? "yes" : "no";
  gameData.tippedOver = document.getElementById('Tipped-Over').checked ? "yes" : "no";
  gameData.card = document.getElementById('Card').value;
  gameData.comments = document.getElementById('Comments').value;
  
  // Create a comma-delimited string from all the values
  const qrData = [
    gameData.initials.toUpperCase(),
    gameData.matchNum,
    gameData.robot,
    gameData.teamNum,
    gameData.centerlineNotes,
    gameData.speakerScored,
    gameData.speakerMissed,
    gameData.tampScored,
    gameData.tampMissed,
    gameData.tspeakerScored,
    gameData.tspeakerMissed,
    gameData.noteTrap,
    gameData.spotlight,
    gameData.endPos,
    gameData.harmony,
    gameData.offSkill,
    gameData.defSkill,
    gameData.speed,
    gameData.died,
    gameData.tippedOver,
    gameData.card,
    gameData.comments
  ].join(',');
  
  console.log("QR Data:", qrData);
  
  // Check if the QRCode library is loaded
  if (typeof QRCode === 'undefined') {
    console.error("QRCode library is not loaded!");
    return;
  }
  
  // Generate the QR code in the pop-up container
  const qrCodeContainer = document.getElementById('qr-code-popup');
  qrCodeContainer.innerHTML = '';
  new QRCode(qrCodeContainer, {
    text: qrData,
    width: 300,
    height: 300,
  });
  
  // Display the QR code pop-up and overlay
  document.getElementById('popupQR').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function closePopupQR() {
  document.getElementById('popupQR').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}
