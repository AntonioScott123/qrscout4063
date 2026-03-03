// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
          console.log('ServiceWorker registration successful with scope:', registration.scope);
        })
        .catch(function (err) {
          console.log('ServiceWorker registration failed:', err);
        });
    });
  } else {
    const prematchWidget = document.getElementById("prematch-widget");
    if (prematchWidget) {
      prematchWidget.style.display = "none";
    }
  }
  
  // Global gameData object holds all form data
  const gameData = {
    initials: "",
    matchNum: 0,
    robot: "",
    moved: false,
    L1autoscored: 0,
    L1automissed: 0,
    L2autoscored: 0,
    L2automissed: 0,
    L3autoscored: 0,
    L3automissed: 0,
    L4autoscored: 0,
    L4automissed: 0,
    L1Telescored: 0,
    L1Telemissed: 0,
    L2Telescored: 0,
    L2Telemissed: 0,
    L3Telescored: 0,
    L3Telemissed: 0,
    L4Telescored: 0,
    L4Telemissed: 0,
    // We'll sum the algae scores from Auto and TeleOp:
    AlgaeScoredinBarge: 0,
    AlgaeMissedBarge: 0,
    climbed: "",
    TippedDuring: false,
    DefenseDuring: false,
    speed: "",
    comments: "",
    ProcessorScored_Auto: 0,
    ProcessorMissed_Auto:0,
    ProcessorScored_TeleOp: 0,
    ProcessorMissed_TeleOp: 0
    


  };
  
  // Optional smallify object for abbreviating common values
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
  
  // Example teams competing array
  var teamsCompeting = [67,70,78,114,175,179,219,226,578,604,1058,1114,1160,1288,1318,1391,1410,1458,1501,1533,1591,1727,1730,1731,2073,2338,2522,2609,2611,2614,2689,2713,2930,2987,3075,3341,3534,3539,3544,4063,4125,4285,4322,4400,4501,4630,5417,5427,5461,5712,5885,5892,6217,6329,6413,6459,6586,6740,6800,6902,7174,7428,7457,7763,8019,8033,8840,9431,9452,9458,9483,9498,9535,9636,9764];
  
  function openPopup() {
    document.getElementById('popup').style.display = 'block';
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  
  function checkIfTeam(enteredTeam) {
    return true
  }
  
  function ClearAll() {
    // Clear Prematch fields
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    document.getElementById('prematch-match-number').value = '';
    document.getElementById('prematch-team-number').value = '';
    document.getElementById('moved').checked = false;
    
    // Clear Auto widget counters
    ['L1autoscored', 'L1automissed', 'L2autoscored', 'L2automissed', 'L3autoscored', 'L3automissed', 'L4autoscored', 'L4automissed',
     'AlgaeScoredinBarge_Auto', 'AlgaeMissedBarge_Auto','ProcessorScored_Auto','ProcessorMissed_Auto'
    ].forEach(id => {
      setCounterValue(id, 0);
    });
    
    // Clear TeleOp widget counters
    ['L1Telescored', 'L1Telemissed', 'L2Telescored', 'L2Telemissed', 'L3Telescored', 'L3Telemissed', 'L4Telescored', 'L4Telemissed',
     'AlgaeScoredinBarge_TeleOp', 'AlgaeMissedBarge_TeleOp','ProcessorScored_TeleOp','ProcessorMissed_TeleOp'
    ].forEach(id => {
      setCounterValue(id, 0);
    });
    
    // Clear Endgame widget fields
    document.getElementById('climbed').value = 'Choose_Answer';
    document.getElementById('speed').value = '0';
    document.getElementById('Tipped-During-Match').checked = false;
    // Clear Postmatch field
    document.getElementById('Comments').value = '';
  }
  
function getCounterValue(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const raw = el.tagName === 'INPUT' ? el.value : el.textContent;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function setCounterValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const safeValue = Math.max(0, value);
  if (el.tagName === 'INPUT') {
    el.value = safeValue;
  } else {
    el.textContent = safeValue;
  }
}

function addPressFeedback(button) {
  if (!button) return;
  button.classList.add('counter-button-active');
  setTimeout(() => button.classList.remove('counter-button-active'), 140);
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

function initializeCounterInputs() {
  const counterIds = new Set();
  const buttons = document.querySelectorAll('button[onclick*="updateButtonNum("]');
  buttons.forEach((button) => {
    const match = button.getAttribute('onclick').match(/updateButtonNum\('([^']+)'/);
    if (match) counterIds.add(match[1]);
  });

  counterIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el || el.tagName === 'INPUT') return;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.inputMode = 'numeric';
    input.setAttribute('pattern', '[0-9]*');
    input.setAttribute('enterkeyhint', 'done');
    input.className = 'counter-input';
    input.value = getCounterValue(id);

    input.addEventListener('input', () => {
      const digitsOnly = input.value.replace(/\D/g, '');
      input.value = digitsOnly === '' ? '' : String(parseInt(digitsOnly, 10));
    });

    input.addEventListener('focus', () => {
      input.select();
    });

    input.addEventListener('blur', () => {
      if (input.value.trim() === '') input.value = '0';
    });

    el.replaceWith(input);
  });
}

function initializeCounterButtonInteractions() {
  const buttons = document.querySelectorAll('button[onclick*="updateButtonNum("]');
  buttons.forEach((button) => {
    const match = button.getAttribute('onclick').match(/updateButtonNum\('([^']+)'\s*,\s*(-?\d+)/);
    if (!match) return;

    const counterId = match[1];
    const delta = parseInt(match[2], 10);
    let holdTimer = null;
    let repeatTimer = null;
    let wasLongPress = false;

    const clearTimers = () => {
      if (holdTimer) clearTimeout(holdTimer);
      if (repeatTimer) clearInterval(repeatTimer);
      holdTimer = null;
      repeatTimer = null;
      setTimeout(() => {
        wasLongPress = false;
      }, 0);
      button.classList.remove('counter-button-active');
    };

    const startHold = (event) => {
      if (event) {
        event.preventDefault();
      }
      button.classList.add('counter-button-active');
      holdTimer = setTimeout(() => {
        wasLongPress = true;
        repeatTimer = setInterval(() => {
          updateButtonNum(counterId, delta);
          addPressFeedback(button);
        }, 90);
      }, 260);
    };

    button.addEventListener('click', (event) => {
      if (wasLongPress) {
        event.preventDefault();
        return;
      }
      addPressFeedback(button);
    });

    button.addEventListener('touchstart', startHold, { passive: false });
    button.addEventListener('touchend', clearTimers);
    button.addEventListener('touchcancel', clearTimers);

    button.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return;
      startHold(event);
    });
    button.addEventListener('mouseup', clearTimers);
    button.addEventListener('mouseleave', clearTimers);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeCounterInputs();
  initializeCounterButtonInteractions();
});

function updateButtonNum(id, num) {
  const currentValue = getCounterValue(id);
  const newValue = currentValue + num;
  setCounterValue(id, newValue);
}
  
  function updateQRCodeOnSubmit() {
    // Get required fields
    let initialsField = document.getElementById('prematch-scout-initials');
    let matchNumField = document.getElementById('prematch-match-number');
    let teamNumField = document.getElementById('prematch-team-number');
    let robotField = document.getElementById('prematch-robot');
    
    // Remove previous error styling if any
    initialsField.classList.remove('error');
    matchNumField.classList.remove('error');
    teamNumField.classList.remove('error');
    robotField.classList.remove('error');
    
    // Validate required fields
    let valid = true;
    if (initialsField.value.trim() === "") {
      initialsField.classList.add('error');
      valid = false;
    }
    if (matchNumField.value.trim() === "") {
      matchNumField.classList.add('error');
      valid = false;
    }
    if (teamNumField.value.trim() === "") {
      teamNumField.classList.add('error');
      valid = false;
    }
    // Assuming "Choose_Answer" means not selected
    if (robotField.value === "Choose_Answer") {
      robotField.classList.add('error');
      valid = false;
    }
    
    // If any required field is invalid, scroll to top and exit
    if (!valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    // All required fields are filled—capture the values.
    gameData.initials = initialsField.value.trim();
    gameData.matchNum = parseInt(matchNumField.value.trim());
    gameData.robot = smallify[robotField.value] || robotField.value;
    gameData.teamNum = parseInt(teamNumField.value.trim());
    gameData.moved = document.getElementById('moved').checked;
    
    // Capture Auto widget values
    gameData.L1autoscored = getCounterValue('L1autoscored');
    gameData.L1automissed = getCounterValue('L1automissed');
    gameData.L2autoscored = getCounterValue('L2autoscored');
    gameData.L2automissed = getCounterValue('L2automissed');
    gameData.L3autoscored = getCounterValue('L3autoscored');
    gameData.L3automissed = getCounterValue('L3automissed');
    gameData.L4autoscored = getCounterValue('L4autoscored');
    gameData.L4automissed = getCounterValue('L4automissed');
    gameData.ProcessorScored_Auto = getCounterValue('ProcessorScored_Auto');
    gameData.ProcessorMissed_Auto = getCounterValue('ProcessorMissed_Auto');
    
    
    // Capture TeleOp widget values
    gameData.L1Telescored = getCounterValue('L1Telescored');
    gameData.L1Telemissed = getCounterValue('L1Telemissed');
    gameData.L2Telescored = getCounterValue('L2Telescored');
    gameData.L2Telemissed = getCounterValue('L2Telemissed');
    gameData.L3Telescored = getCounterValue('L3Telescored');
    gameData.L3Telemissed = getCounterValue('L3Telemissed');
    gameData.L4Telescored = getCounterValue('L4Telescored');
    gameData.L4Telemissed = getCounterValue('L4Telemissed');
    gameData.ProcessorScored_TeleOp = getCounterValue('ProcessorScored_TeleOp');
    gameData.ProcessorMissed_TeleOp = getCounterValue('ProcessorMissed_TeleOp');
    
    // Capture additional algae data from Auto and TeleOp sections
    
    // Capture Endgame widget values
    gameData.climbed = document.getElementById('climbed').value;
    gameData.speed = document.getElementById('speed').value;
    gameData.TippedDuring = document.getElementById('Tipped-During-Match').checked ? "Yes" : "No";

    
    // Capture Postmatch widget value
    gameData.comments = document.getElementById('Comments').value;
    
    // Validate team number using teamsCompeting array (or your custom logic)
    if (checkIfTeam(gameData.teamNum)) {
      generateQRCode();
    } else {
      openPopup();  
    }
  }
  
  
  
  function generateQRCode() {
    // Create a string from gameData (using spaces then replace with tilde delimiter)
    const autoAlgaeScored = getCounterValue('AlgaeScoredinBarge_Auto');
    const autoAlgaeMissed = getCounterValue('AlgaeMissedBarge_Auto');
    const teleopAlgaeScored = getCounterValue('AlgaeScoredinBarge_TeleOp');
    const teleopAlgaeMissed = getCounterValue('AlgaeMissedBarge_TeleOp');
    const qrCodeData = `${gameData.initials.toUpperCase()} ${gameData.matchNum} ${gameData.robot} ${gameData.teamNum} ${gameData.moved} ${gameData.L1autoscored} ${gameData.L1automissed} ${gameData.L2autoscored} ${gameData.L2automissed} ${gameData.L3autoscored} ${gameData.L3automissed} ${gameData.L4autoscored} ${gameData.L4automissed} ${autoAlgaeScored} ${autoAlgaeMissed} ${gameData.ProcessorScored_Auto} ${gameData.ProcessorMissed_Auto} ${gameData.L1Telescored} ${gameData.L1Telemissed} ${gameData.L2Telescored} ${gameData.L2Telemissed} ${gameData.L3Telescored} ${gameData.L3Telemissed} ${gameData.L4Telescored} ${gameData.L4Telemissed} ${teleopAlgaeScored} ${teleopAlgaeMissed} ${gameData.ProcessorScored_TeleOp} ${gameData.ProcessorMissed_TeleOp} ${gameData.climbed} ${gameData.TippedDuring} ${gameData.speed}`;
    
    const qrCodeContainer = document.getElementById('qr-code-popup');
    qrCodeContainer.innerHTML = '';  // Clear previous QR code content
    
    // Generate QR code using a tilde delimiter
    new QRCode(qrCodeContainer, {
      text: qrCodeData.split(' ').join('~') + "~" + gameData.comments,
      width: 300,
      height: 300,
    });

    
    // Display the QR code popup
    document.getElementById('popupQR').style.display = 'flex';
  }
  
  function closePopupQR() {
    document.getElementById('popupQR').style.display = 'none';
    document.getElementById('qr-code-popup').innerHTML = '';
  }
  
