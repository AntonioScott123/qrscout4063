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
    fuelScoringCapability: 3,
    overallImpact: 3,
    hopperEstimate: 0,
    comments: ""
  };

  const MAX_QR_TEXT_LENGTH = 900;
  const QR_HISTORY_STORAGE_KEY = "qrScoutHistory";
  let qrHistoryTexts = [];

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
    if (typeof goToCarouselPage === "function") {
      goToCarouselPage(0);
    }
    document.getElementById('prematch-match-number').value = '';
    const teamField = document.getElementById('prematch-team-number');
    teamField.value = '';
    clearRobotSelection();
    document.getElementById('moved').checked = false;

    ['autoFuelScored', 'autoFuelMissed', 'teleopFuelScored', 'teleopFuelMissed', 'hopperEstimate'].forEach(id => {
      setCounterValue(id, 0);
    });

    document.getElementById('autoClimb').checked = false;
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
    const fuelScoringCapabilityValue = document.getElementById('fuel-score-rating-value');
    if (fuelScoringCapabilityValue) fuelScoringCapabilityValue.textContent = '3';
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



function clearRobotSelection() {
  document.querySelectorAll('.robot-choice.is-selected').forEach((button) => {
    button.classList.remove('is-selected');
  });
}

function initializeRobotButtons() {
  const buttons = document.querySelectorAll('.robot-choice');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-selected'));
      button.classList.add('is-selected');
      const robotField = document.getElementById('prematch-robot');
      if (robotField) {
        robotField.classList.remove('error');
      }
    });
  });
}

function getSelectedRobot() {
  const selected = document.querySelector('.robot-choice.is-selected');
  return selected ? selected.dataset.robot : 'Choose_Answer';
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


let goToCarouselPage = null;

function initializeWidgetCarousel() {
  const dashboard = document.getElementById('dashboard-carousel');
  if (!dashboard) return;

  const widgets = Array.from(dashboard.querySelectorAll('.widget'));
  if (widgets.length === 0) return;

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const progressSlider = document.getElementById('carousel-progress');
  let activeIndex = 0;
  let uniformCardHeight = null;

  const clampIndex = (index) => Math.max(0, Math.min(index, widgets.length - 1));

  const updateCarouselState = () => {
    widgets.forEach((widget, index) => {
      widget.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');

      if (index === activeIndex) {
        widget.classList.add('is-active');
      } else if (index === activeIndex - 1) {
        widget.classList.add('is-prev');
      } else if (index === activeIndex + 1) {
        widget.classList.add('is-next');
      } else {
        widget.classList.add('is-hidden');
      }
    });

    if (uniformCardHeight !== null) {
      dashboard.style.height = `${uniformCardHeight + 24}px`;
    }

    if (prevBtn) prevBtn.disabled = activeIndex === 0;
    if (nextBtn) nextBtn.disabled = activeIndex === widgets.length - 1;
    if (progressSlider) progressSlider.value = String(activeIndex);
  };


  const syncUniformCardHeight = () => {
    widgets.forEach((widget) => {
      widget.style.height = 'auto';
    });

    uniformCardHeight = widgets.reduce((maxHeight, widget) => {
      return Math.max(maxHeight, widget.offsetHeight);
    }, 0);

    widgets.forEach((widget) => {
      widget.style.height = `${uniformCardHeight}px`;
    });
  };

  const goToIndex = (index) => {
    const safeIndex = clampIndex(index);
    if (safeIndex === activeIndex) return;
    activeIndex = safeIndex;
    updateCarouselState();
  };

  goToCarouselPage = goToIndex;

  if (progressSlider) {
    progressSlider.min = '0';
    progressSlider.max = String(widgets.length - 1);
    progressSlider.step = '1';
    progressSlider.value = String(activeIndex);
    progressSlider.addEventListener('input', () => {
      goToIndex(parseInt(progressSlider.value, 10) || 0);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToIndex(activeIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToIndex(activeIndex + 1);
    });
  }

  let touchStartX = null;

  dashboard.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0]?.clientX ?? null;
  }, { passive: true });

  dashboard.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = touchEndX - touchStartX;
    const threshold = 45;

    if (deltaX > threshold) {
      goToIndex(activeIndex - 1);
    } else if (deltaX < -threshold) {
      goToIndex(activeIndex + 1);
    }

    touchStartX = null;
  }, { passive: true });

  window.addEventListener('resize', () => {
    syncUniformCardHeight();
    updateCarouselState();
  });

  syncUniformCardHeight();
  updateCarouselState();
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
  initializeWidgetCarousel();
  initializeCounterInputs();
  initializeCounterButtonInteractions();
  initializeSpeedSlider('endgame-speed', 'endgame-speed-value');
  initializeSpeedSlider('reliability', 'reliability-value');
  initializeSpeedSlider('fuel-score-rating', 'fuel-score-rating-value');
  initializeSpeedSlider('overall-impact', 'overall-impact-value');
  initializeCheckboxAnimations();
  initializeRobotButtons();
  initializeRungButtons();
  initializeRungVisibility();
  loadQrHistory();
  renderHistoryList();
});

function updateButtonNum(id, num) {
  const currentValue = getCounterValue(id);
  const newValue = currentValue + num;
  setCounterValue(id, newValue);
}
  
function saveQrHistory() {
  localStorage.setItem(QR_HISTORY_STORAGE_KEY, JSON.stringify(qrHistoryTexts));
}

function loadQrHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(QR_HISTORY_STORAGE_KEY) || '[]');
    if (Array.isArray(parsed)) {
      qrHistoryTexts = parsed.filter((item) => typeof item === 'string');
    }
  } catch (error) {
    qrHistoryTexts = [];
  }
}

function addQrHistoryEntry(text) {
  qrHistoryTexts.unshift(text);
  if (qrHistoryTexts.length > 800) qrHistoryTexts = qrHistoryTexts.slice(0, 800);
  saveQrHistory();
  renderHistoryList();
}

function formatHistoryLabel(qrText, index) {
  const cleaned = qrText.replace(/\r?\n$/, '');
  const fields = cleaned.split('\t');
  const initials = fields[0] || 'NA';
  const matchNum = fields[1] || 'NA';
  const robot = fields[2] || 'NA';
  const team = fields[3] || 'NA';
  return `#${index + 1} • Match ${matchNum} • Team ${team} • ${robot} • ${initials}`;
}

function renderHistoryList() {
  const list = document.getElementById('history-list');
  if (!list) return;
  list.innerHTML = '';

  if (qrHistoryTexts.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = 'No history yet.';
    list.appendChild(empty);
    return;
  }

  qrHistoryTexts.forEach((text, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'history-item-btn';
    button.textContent = formatHistoryLabel(text, index);
    button.addEventListener('click', () => {
      const panel = document.getElementById('history-panel');
      if (panel) panel.style.display = 'none';
      showQrPopup(text);
    });
    list.appendChild(button);
  });
}

function toggleHistoryPanel(show) {
  const panel = document.getElementById('history-panel');
  if (!panel) return;
  panel.style.display = show ? 'flex' : 'none';
  panel.setAttribute('aria-hidden', show ? 'false' : 'true');
  if (show) renderHistoryList();
}

function exportHistoryCsv() {
  if (qrHistoryTexts.length === 0) return;
  const headers = [
    'initials', 'matchNum', 'robot', 'teamNum', 'moved', 'autoFuelScored', 'autoFuelMissed',
    'autoClimb', 'intakeFloor', 'intakeDepot', 'intakeOutpost', 'teleopFuelScored',
    'teleopFuelMissed', 'attemptedClimb', 'successfulClimb', 'rung', 'endgameSpeed',
    'reliability', 'fuelScoringCapability', 'overallImpact', 'hopperEstimate', 'comments'
  ];

  const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const rows = qrHistoryTexts.map((text) => {
    const cleaned = text.replace(/\r?\n$/, '');
    const cells = cleaned.split('\t');
    while (cells.length < headers.length) cells.push('');
    return cells.slice(0, headers.length).map(escapeCsv).join(',');
  });

  const csvText = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qr-history.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function showQrPopup(qrText) {
  const qrCodeContainer = document.getElementById('qr-code-popup');
  qrCodeContainer.innerHTML = '';
  new QRCode(qrCodeContainer, {
    text: qrText,
    width: 300,
    height: 300,
  });
  document.getElementById('popupQR').style.display = 'flex';
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
    if (getSelectedRobot() === "Choose_Answer") {
      robotField.classList.add('error');
      valid = false;
    }

    if (!valid) {
      if (typeof goToCarouselPage === "function") {
        goToCarouselPage(0);
      }
      return;
    }

    gameData.initials = initialsField.value.trim();
    gameData.matchNum = parseInt(matchNumField.value.trim(), 10);
    const selectedRobot = getSelectedRobot();
    gameData.robot = smallify[selectedRobot] || selectedRobot;
    gameData.teamNum = parseInt(teamNumField.value.trim(), 10);
    gameData.moved = document.getElementById('moved').checked;

    gameData.autoFuelScored = getCounterValue('autoFuelScored');
    gameData.autoFuelMissed = getCounterValue('autoFuelMissed');
    gameData.autoClimb = document.getElementById('autoClimb').checked;

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
    gameData.fuelScoringCapability = document.getElementById('fuel-score-rating').value;
    gameData.overallImpact = document.getElementById('overall-impact').value;
    gameData.hopperEstimate = getCounterValue('hopperEstimate');
    const commentsField = document.getElementById('Comments');
    const payloadFields = [
      gameData.initials.toUpperCase(),
      gameData.matchNum,
      gameData.robot,
      gameData.teamNum,
      gameData.moved,
      gameData.autoFuelScored,
      gameData.autoFuelMissed,
      gameData.autoClimb,
      gameData.intakeFloor,
      gameData.intakeDepot,
      gameData.intakeOutpost,
      gameData.teleopFuelScored,
      gameData.teleopFuelMissed,
      gameData.attemptedClimb,
      gameData.successfulClimb,
      gameData.rung,
      gameData.endgameSpeed,
      gameData.reliability,
      gameData.fuelScoringCapability,
      gameData.overallImpact,
      gameData.hopperEstimate
    ];
    const basePayload = payloadFields.join('	') + '	';
    const allowedCommentLength = Math.max(0, MAX_QR_TEXT_LENGTH - (basePayload.length + 2));
    commentsField.maxLength = allowedCommentLength;
    gameData.comments = commentsField.value.replace(/[\t\n\r]+/g, ' ').slice(0, allowedCommentLength);


    if (checkIfTeam(gameData.teamNum)) {
      generateQRCode();
    } else {
      openPopup();
    }
  }

  function generateQRCode() {
    // Keep output format scanner-friendly with tab-delimited fields.
    const payloadFields = [
      gameData.initials.toUpperCase(),
      gameData.matchNum,
      gameData.robot,
      gameData.teamNum,
      gameData.moved,
      gameData.autoFuelScored,
      gameData.autoFuelMissed,
      gameData.autoClimb,
      gameData.intakeFloor,
      gameData.intakeDepot,
      gameData.intakeOutpost,
      gameData.teleopFuelScored,
      gameData.teleopFuelMissed,
      gameData.attemptedClimb,
      gameData.successfulClimb,
      gameData.rung,
      gameData.endgameSpeed,
      gameData.reliability,
      gameData.fuelScoringCapability,
      gameData.overallImpact,
      gameData.hopperEstimate
    ];
    const basePayload = payloadFields.join('	') + '	';

    // Truncate comments when needed so long notes stay QR-friendly.
    const allowedCommentLength = Math.max(0, MAX_QR_TEXT_LENGTH - (basePayload.length + 2));
    const safeComment = (gameData.comments || '').replace(/[\t\n\r]+/g, ' ').slice(0, allowedCommentLength);

    const qrText = basePayload + safeComment + '\r\n';
    addQrHistoryEntry(qrText);
    showQrPopup(qrText);
  }

  function closePopupQR() {
    document.getElementById('popupQR').style.display = 'none';
    document.getElementById('qr-code-popup').innerHTML = '';
  }
