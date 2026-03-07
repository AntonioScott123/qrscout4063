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
    teamNum: 0,
    moved: false,
    autoFuelScored: 0,
    autoFuelMissed: 0,
    autoClimb: false,
    intakeSpeed: 3,
    endgameSpeed: 3,
    intakeFloor: false,
    intakeDepot: false,
    intakeOutpost: false,
    teleopFuelScored: 0,
    teleopFuelMissed: 0,
    attemptedClimb: false,
    successfulClimb: false,
    rung: "",
    reliability: 3,
    fuelScoreRating: 3,
    overallImpact: 3,
    comments: ""
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
  
  function openPopup() {
    document.getElementById('popup').style.display = 'block';
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  
  function checkIfTeam(enteredTeam) {
    if (window.allowAllTeams === true) return true;
    if (!Array.isArray(window.teamsCompeting)) return true;
    return window.teamsCompeting.includes(Number(enteredTeam));
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

    ['autoFuelScored', 'autoFuelMissed', 'teleopFuelScored', 'teleopFuelMissed'].forEach(id => {
      setCounterValue(id, 0);
    });

    document.getElementById('autoClimb').checked = false;
    document.getElementById('speed').value = '3';
    const speedValue = document.getElementById('speed-value');
    if (speedValue) speedValue.textContent = '3';
    document.getElementById('endgame-speed').value = '3';
    const endgameSpeedValue = document.getElementById('endgame-speed-value');
    if (endgameSpeedValue) endgameSpeedValue.textContent = '3';
    document.getElementById('intakeFloor').checked = false;
    document.getElementById('intakeDepot').checked = false;
    document.getElementById('intakeOutpost').checked = false;
    document.getElementById('attemptedClimb').checked = false;
    document.getElementById('successfulClimb').checked = false;
    clearRungSelection();
    const rungContainer = document.getElementById('rung-container');
    if (rungContainer) rungContainer.style.display = 'none';

    document.getElementById('reliability').value = '3';
    const reliabilityValue = document.getElementById('reliability-value');
    if (reliabilityValue) reliabilityValue.textContent = '3';
    document.getElementById('fuel-score-rating').value = '3';
    const fuelScoreRatingValue = document.getElementById('fuel-score-rating-value');
    if (fuelScoreRatingValue) fuelScoreRatingValue.textContent = '3';
    document.getElementById('overall-impact').value = '3';
    const overallImpactValue = document.getElementById('overall-impact-value');
    if (overallImpactValue) overallImpactValue.textContent = '3';

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
    const onclickValue = button.getAttribute('onclick') || '';
    const match = onclickValue.match(/updateButtonNum\('([^']+)'\s*,\s*(-?\d+)/);
    if (!match) return;

    const counterId = match[1];
    const delta = parseInt(match[2], 10);
    button.removeAttribute('onclick');

    let holdTimer = null;
    let repeatTimer = null;
    let wasLongPress = false;
    let suppressNextClick = false;

    const stepCounter = () => {
      updateButtonNum(counterId, delta);
      addPressFeedback(button);
    };

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

    const startHold = () => {
      button.classList.add('counter-button-active');
      holdTimer = setTimeout(() => {
        wasLongPress = true;
        repeatTimer = setInterval(() => {
          stepCounter();
        }, 90);
      }, 260);
    };

    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (suppressNextClick || wasLongPress) {
        suppressNextClick = false;
        return;
      }
      stepCounter();
    });

    button.addEventListener('touchstart', startHold, { passive: true });
    button.addEventListener('touchend', () => {
      if (!wasLongPress) {
        stepCounter();
      }
      suppressNextClick = true;
      clearTimers();
    });
    button.addEventListener('touchcancel', clearTimers);

    button.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return;
      startHold();
    });
    button.addEventListener('mouseup', clearTimers);
    button.addEventListener('mouseleave', clearTimers);
  });
}


function initializeSpeedSlider(sliderId = 'speed', valueId = 'speed-value') {
  const speedSlider = document.getElementById(sliderId);
  const speedValue = document.getElementById(valueId);
  if (!speedSlider || !speedValue) return;

  const syncSpeed = () => {
    speedValue.textContent = speedSlider.value;
  };

  speedSlider.addEventListener('input', syncSpeed);
  syncSpeed();
}

function initializeCheckboxAnimations() {
  const checkboxes = document.querySelectorAll('.custom-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      if (!label) return;

      if (checkbox.checked) {
        label.classList.remove('checkbox-true-pop');
        void label.offsetWidth;
        label.classList.add('checkbox-true-pop');
        return;
      }

      label.classList.remove('checkbox-false-pop');
      void label.offsetWidth;
      label.classList.add('checkbox-false-pop');
    });
  });
}


function clearRungSelection() {
  const selected = document.querySelector('.rung-button.is-selected');
  if (selected) {
    selected.classList.remove('is-selected');
  }
}

function initializeRungButtons() {
  const buttons = document.querySelectorAll('.rung-button');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-selected'));
      button.classList.add('is-selected');
    });
  });
}

function getSelectedRung() {
  const selected = document.querySelector('.rung-button.is-selected');
  return selected ? selected.dataset.rung : 'NA';
}

function initializeRungVisibility() {
  const successfulClimb = document.getElementById('successfulClimb');
  const rungContainer = document.getElementById('rung-container');
  if (!successfulClimb || !rungContainer) return;

  const syncRung = () => {
    const show = successfulClimb.checked;
    rungContainer.style.display = show ? 'block' : 'none';
    if (!show) {
      clearRungSelection();
    }
  };

  successfulClimb.addEventListener('change', syncRung);
  syncRung();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeCounterInputs();
  initializeCounterButtonInteractions();
  initializeSpeedSlider('speed', 'speed-value');
  initializeSpeedSlider('endgame-speed', 'endgame-speed-value');
  initializeSpeedSlider('reliability', 'reliability-value');
  initializeSpeedSlider('fuel-score-rating', 'fuel-score-rating-value');
  initializeSpeedSlider('overall-impact', 'overall-impact-value');
  initializeCheckboxAnimations();
  initializeRungButtons();
  initializeRungVisibility();
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
    if (robotField.value === "Choose_Answer") {
      robotField.classList.add('error');
      valid = false;
    }

    if (!valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    gameData.initials = initialsField.value.trim();
    gameData.matchNum = parseInt(matchNumField.value.trim(), 10);
    gameData.robot = smallify[robotField.value] || robotField.value;
    gameData.teamNum = parseInt(teamNumField.value.trim(), 10);
    gameData.moved = document.getElementById('moved').checked;

    gameData.autoFuelScored = getCounterValue('autoFuelScored');
    gameData.autoFuelMissed = getCounterValue('autoFuelMissed');
    gameData.autoClimb = document.getElementById('autoClimb').checked;

    gameData.intakeSpeed = document.getElementById('speed').value;
    gameData.endgameSpeed = document.getElementById('endgame-speed').value;
    gameData.intakeFloor = document.getElementById('intakeFloor').checked;
    gameData.intakeDepot = document.getElementById('intakeDepot').checked;
    gameData.intakeOutpost = document.getElementById('intakeOutpost').checked;
    gameData.teleopFuelScored = getCounterValue('teleopFuelScored');
    gameData.teleopFuelMissed = getCounterValue('teleopFuelMissed');

    gameData.attemptedClimb = document.getElementById('attemptedClimb').checked;
    gameData.successfulClimb = document.getElementById('successfulClimb').checked;
    gameData.rung = gameData.successfulClimb ? getSelectedRung() : 'NA';

    gameData.reliability = document.getElementById('reliability').value;
    gameData.fuelScoreRating = document.getElementById('fuel-score-rating').value;
    gameData.overallImpact = document.getElementById('overall-impact').value;
    gameData.comments = document.getElementById('Comments').value;

    if (checkIfTeam(gameData.teamNum)) {
      generateQRCode();
    } else {
      openPopup();
    }
  }

  function generateQRCode() {
    // Keep output format: space-separated payload, then replace spaces with tildes.
    const qrCodeData = `${gameData.initials.toUpperCase()} ${gameData.matchNum} ${gameData.robot} ${gameData.teamNum} ${gameData.moved} ${gameData.autoFuelScored} ${gameData.autoFuelMissed} ${gameData.autoClimb} ${gameData.intakeSpeed} ${gameData.intakeFloor} ${gameData.intakeDepot} ${gameData.intakeOutpost} ${gameData.teleopFuelScored} ${gameData.teleopFuelMissed} ${gameData.attemptedClimb} ${gameData.successfulClimb} ${gameData.rung} ${gameData.endgameSpeed} ${gameData.reliability} ${gameData.fuelScoreRating} ${gameData.overallImpact}`;

    const qrCodeContainer = document.getElementById('qr-code-popup');
    qrCodeContainer.innerHTML = '';

    new QRCode(qrCodeContainer, {
      text: qrCodeData.split(' ').join('~') + "~" + gameData.comments,
      width: 300,
      height: 300,
    });

    document.getElementById('popupQR').style.display = 'flex';
  }

  function closePopupQR() {
    document.getElementById('popupQR').style.display = 'none';
    document.getElementById('qr-code-popup').innerHTML = '';
  }
  
