// --- Data and Utility Functions ---

// Only include properties that match the HTML fields.
const gameData = {
    autoMoved: false,         // Checkbox: "MOVED?"
    L4CoralScored: 0,         // Counter for L4 CORAL SCORED
    L4CoralMissed: 0,         // Counter for L4 CORAL MISSED
    L3CoralScored: 0,         // Counter for L3 CORAL SCORED
    L3CoralMissed: 0,         // Counter for L3 CORAL MISSED
    L2CoralScored: 0,         // Counter for L2 CORAL SCORED
    L2CoralMissed: 0,         // Counter for L2 CORAL MISSED
    L1CoralScored: 0,         // Counter for L1 CORAL SCORED
    L1CoralMissed: 0,         // Counter for L1 CORAL MISSED
    AlgaeScored: 0,           // Counter for ALGAE IN BARGE SCORED
    AlgaeMissed: 0,           // Counter for ALGAE IN BARGE MISSED
    endPos: "",               // Selected value from "END POSITION"
    tippedDuringMatch: false, // Checkbox: "TIPPED DURING MATCH?"
    speed: ""                 // Selected value from "ROBOT SPEED"
};

// This object converts specific values to a shorthand if needed.
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
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome
}

// Example team numbers for validation (if needed)
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

// --- Form Functions ---

// Clear the form fields and reset gameData.
function ClearAll() {
    // Clear Auto widget counters and checkbox
    document.getElementById('autoMoved').checked = false;
    // Reset all counters by updating both gameData and the UI.
    const counterIDs = [
        'L4CoralScored', 'L4CoralMissed',
        'L3CoralScored', 'L3CoralMissed',
        'L2CoralScored', 'L2CoralMissed',
        'L1CoralScored', 'L1CoralMissed',
        'AlgaeScored', 'AlgaeMissed'
    ];
    counterIDs.forEach(id => {
        gameData[id] = 0;
        document.getElementById(id).textContent = "0";
    });

    // Clear Endgame widget select
    document.getElementById('End-Position').value = 'Choose_Answer';

    // Clear Postmatch widget
    document.getElementById('TippedDuringMatch').checked = false;
    document.getElementById('RobotSpeed').value = "1"; // default value

    // Update gameData for the remaining fields
    gameData.autoMoved = false;
    gameData.endPos = 'Choose_Answer';
    gameData.tippedDuringMatch = false;
    gameData.speed = "1";
}

// Called by buttons to update a counter.
// The variable name should match a property in gameData and the ID of the corresponding element.
function updateButtonNum(variable, value) {
    gameData[variable] += value;
    gameData[variable] = Math.max(gameData[variable], 0);
    document.getElementById(variable).textContent = gameData[variable];
}

// --- QR Code Generation ---

function updateQRCodeOnSubmit() {
    // Update gameData from current form state:
    gameData.autoMoved = document.getElementById('autoMoved').checked;
    gameData.endPos = document.getElementById('End-Position').value;
    gameData.tippedDuringMatch = document.getElementById('TippedDuringMatch').checked;
    gameData.speed = document.getElementById('RobotSpeed').value;

    /
