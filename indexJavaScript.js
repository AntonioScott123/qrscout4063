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
  
  function checkIfTeamSigma(enteredTeam) {
    return true
  }
  
  function ClearAll() {
    // Clear Prematch fields
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    document.getElementById('prematch-scout-initials').value = '';
    document.getElementById('prematch-match-number').value = '';
    document.getElementById('prematch-team-number').value = '';
    document.getElementById('prematch-robot').value = 'Choose_Answer';
    document.getElementById('moved').checked = false;
    
    // Clear Auto widget counters
    ['L1autoscored', 'L1automissed', 'L2autoscored', 'L2automissed', 'L3autoscored', 'L3automissed', 'L4autoscored', 'L4automissed',
     'AlgaeScoredinBarge_Auto', 'AlgaeMissedBarge_Auto','ProcessorScored_Auto','ProcessorMissed_Auto'
    ].forEach(id => {
      document.getElementById(id).textContent = '0';
    });
    
    // Clear TeleOp widget counters
    ['L1Telescored', 'L1Telemissed', 'L2Telescored', 'L2Telemissed', 'L3Telescored', 'L3Telemissed', 'L4Telescored', 'L4Telemissed',
     'AlgaeScoredinBarge_TeleOp', 'AlgaeMissedBarge_TeleOp','ProcessorScored_TeleOp','ProcessorMissed_TeleOp'
    ].forEach(id => {
      document.getElementById(id).textContent = '0';
    });
    
    // Clear Endgame widget fields
    document.getElementById('climbed').value = 'Choose_Answer';
    document.getElementById('speed').value = '0';
    document.getElementById('Tipped-During-Match').checked = false;
    document.getElementById('Defense-During-Match').checked = false;
    
    // Clear Postmatch field
    document.getElementById('Comments').value = '';
  }
  function updateButtonNum(id, num) {
    var el = document.getElementById(id);
  let currentValue = parseInt(el.textContent);
  let newValue = currentValue + num;
  if (newValue < 0) {
    newValue = 0;
  }
  el.textContent = newValue;
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
    gameData.L1autoscored = parseInt(document.getElementById('L1autoscored').textContent);
    gameData.L1automissed = parseInt(document.getElementById('L1automissed').textContent);
    gameData.L2autoscored = parseInt(document.getElementById('L2autoscored').textContent);
    gameData.L2automissed = parseInt(document.getElementById('L2automissed').textContent);
    gameData.L3autoscored = parseInt(document.getElementById('L3autoscored').textContent);
    gameData.L3automissed = parseInt(document.getElementById('L3automissed').textContent);
    gameData.L4autoscored = parseInt(document.getElementById('L4autoscored').textContent);
    gameData.L4automissed = parseInt(document.getElementById('L4automissed').textContent);
    gameData.ProcessorScored_Auto = parseInt(document.getElementById('ProcessorScored_Auto').textContent);
    gameData.ProcessorMissed_Auto = parseInt(document.getElementById('ProcessorMissed_Auto').textContent);
    
    
    // Capture TeleOp widget values
    gameData.L1Telescored = parseInt(document.getElementById('L1Telescored').textContent);
    gameData.L1Telemissed = parseInt(document.getElementById('L1Telemissed').textContent);
    gameData.L2Telescored = parseInt(document.getElementById('L2Telescored').textContent);
    gameData.L2Telemissed = parseInt(document.getElementById('L2Telemissed').textContent);
    gameData.L3Telescored = parseInt(document.getElementById('L3Telescored').textContent);
    gameData.L3Telemissed = parseInt(document.getElementById('L3Telemissed').textContent);
    gameData.L4Telescored = parseInt(document.getElementById('L4Telescored').textContent);
    gameData.L4Telemissed = parseInt(document.getElementById('L4Telemissed').textContent);
    gameData.ProcessorScored_TeleOp = parseInt(document.getElementById('ProcessorScored_TeleOp').textContent);
    gameData.ProcessorMissed_TeleOp = parseInt(document.getElementById('ProcessorMissed_TeleOp').textContent);
    
    // Capture additional algae data from Auto and TeleOp sections
    
    // Capture Endgame widget values
    gameData.climbed = document.getElementById('climbed').value;
    gameData.speed = document.getElementById('speed').value;
    gameData.TippedDuring = document.getElementById('Tipped-During-Match').checked ? "Yes" : "No";
    gameData.DefenseDuring = document.getElementById('Defense-During-Match').checked ? "Yes" : "No";
    
    // Capture Postmatch widget value
    gameData.comments = document.getElementById('Comments').value;
    
    // Validate team number using teamsCompeting array (or your custom logic)
    if (checkIfTeamSigma(gameData.teamNum)) {
      generateQRCode();
    } else {
      openPopup();  
    }
  }
  
  
  
  function generateQRCode() {
    // Create a string from gameData (using spaces then replace with tilde delimiter)
    const autoAlgaeScored = parseInt(document.getElementById('AlgaeScoredinBarge_Auto').textContent);
    const autoAlgaeMissed = parseInt(document.getElementById('AlgaeMissedBarge_Auto').textContent);
    const teleopAlgaeScored = parseInt(document.getElementById('AlgaeScoredinBarge_TeleOp').textContent);
    const teleopAlgaeMissed = parseInt(document.getElementById('AlgaeMissedBarge_TeleOp').textContent);
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
  
