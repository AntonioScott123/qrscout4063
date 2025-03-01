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
			centerlineNotes: false
		}

let smallify = {};

smallify["Not_Observed"] = "NOB";
smallify["Choose_Answer"] = "CAN";
smallify["false"] = "no";
smallify["true"] = "yes";
smallify["NOB"] = "NOB";
smallify["CAN"] = "CAN";
smallify["yes"] = "yes";
smallify["no"] = "no";

function scrollToTop() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome
}

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

	Object.assign(gameData, {
		initials: '',
		matchNum: 0,
		robot: 'Choose_Answer',
		teamNum: 0,
		died: false,
		tippedOver: false,
		centerlineNotes: false,
		endPos: 'Choose_Answer',
		harmony: 'Choose_Answer',
		offSkill: 0,
		defSkill: 0,
		card: 'No_Card',
		comments: '',
		speakerScored: 0,
		speakerMissed: 0,
		tampScored: 0,
		tampMissed: 0,
		tspeakerScored: 0,
		tspeakerMissed: 0,
		noteTrap: 0
	});

	['speakerScored', 'speakerMissed', 'tampScored', 'tampMissed', 'tspeakerScored', 'tspeakerMissed', 'noteTrap'].forEach(id => {
		document.getElementById(id).textContent = gameData[id];
	});
}

function updateButtonNum(variable, value) {
	gameData[variable] += value;
	gameData[variable] = Math.max(gameData[variable], 0);
	document.getElementById(variable).textContent = gameData[variable];
}

function updateQRCodeOnSubmit() {
	// Update all the gameData fields with the form values
	gameData.initials = document.getElementById('prematch-scout-initials').value.trim();
	gameData.matchNum = parseInt(document.getElementById('prematch-match-number').value.trim());
	gameData.teamNum = parseInt(document.getElementById('prematch-team-number').value.trim());
	
	['robot', 'endPos', 'harmony', 'Offensive Skill', 'Defensive Skill', 'Card', 'Speed'].forEach(field => {
		let value = document.getElementById(field).value;
		gameData[field.replaceAll(' ', '').toLowerCase()] = smallify[value] || value;
	});

	gameData.comments = document.getElementById('Comments').value;
	gameData.spotlight = smallify[document.getElementById('Spotlight').checked];

	if (checkIfTeamSigma(gameData.teamNum)) {
		generateQRCode();
	} else {
		openPopup();
	}
}

function generateQRCode() {
	const qrCodeData = `${gameData.initials.toUpperCase()} ${gameData.matchNum} ${gameData.robot} ${gameData.teamNum}`;
	const qrCodeDataWithCommas = qrCodeData.split(' ').join('~');
	const qrCodeDataWithComments = `${qrCodeDataWithCommas}~${gameData.comments}`;
	
	const qrCodeContainer = document.getElementById('qr-code-popup');
	qrCodeContainer.innerHTML = '';

	new QRCode(qrCodeContainer, {
		text: qrCodeDataWithComments,
		width: 300,
		height: 300
	});

	document.getElementById('popupQR').style.display = 'block';
	document.getElementById('overlay').style.display = 'block';
}

function closePopupQR() {
	document.getElementById('popupQR').style.display = 'none';
	document.getElementById('overlay').style.display = 'none';
}
