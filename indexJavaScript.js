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

function checkIfTeamSigma(enteredTeam) 
{
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
    // Update HTML element value
    document.getElementById(variable).textContent = gameData[variable];

        function updateGameData(section, key, value) {
            gameData[section][key] = value;
        }
		}
		
        function updateQRCodeOnSubmit() {
		// Update all the gameData fields with the form values
		gameData.initials = document.getElementById('prematch-scout-initials').value.split(' ').join('');
		gameData.matchNum = parseInt(document.getElementById('prematch-match-number').value.split(' ').join(''));
		if(document.getElementById('prematch-robot').value in smallify)
		{
			gameData.robot = smallify[document.getElementById('prematch-robot').value];
		}
		else
		{
			gameData.robot = document.getElementById('prematch-robot').value;
		}
		gameData.teamNum = parseInt(document.getElementById('prematch-team-number').value.split(' ').join(''));
		gameData.died = smallify[document.getElementById('Died').checked];
		gameData.tippedOver = smallify[document.getElementById('Tipped-Over').checked];
		gameData.centerlineNotes = smallify[document.getElementById('centerlineNotes').checked];
		if(document.getElementById('End-Position').value in smallify)
		{
			gameData.endPos = smallify[document.getElementById('End-Position').value];
		}
		else
		{
			gameData.endPos = document.getElementById('End-Position').value;
		}
		if(gameData.harmony = document.getElementById('Harmony').value in smallify)
		{
			gameData.harmony = smallify[document.getElementById('Harmony').value];
		}
		else
		{
			gameData.harmony = document.getElementById('Harmony').value;
		}
		
		if(document.getElementById('Offensive Skill').value in smallify)
		{
			gameData.offSkill = smallify[document.getElementById('Offensive Skill').value];
		}
		else
		{
			gameData.offSkill = document.getElementById('Offensive Skill').value;
		}

		if(document.getElementById('Defensive Skill').value in smallify)
		{
			gameData.defSkill = smallify[document.getElementById('Defensive Skill').value];
		}
		else
		{
			gameData.defSkill = document.getElementById('Defensive Skill').value
		}

		if (document.getElementById('Card').value in smallify)
		{
			gameData.card = smallify[document.getElementById('Card').value]
		}
		else
		{
			gameData.card = document.getElementById('Card').value
		}
		gameData.comments = document.getElementById('Comments').value;
		gameData.spotlight = smallify[document.getElementById('Spotlight').checked];
		if(document.getElementById('Speed').value in smallify)
		{
			gameData.speed = smallify[document.getElementById('Speed').value];
		}
		else
		{
			gameData.speed = document.getElementById('Speed').value;
		}
		// Update other fields similarl
		// Generate QR code with updated gameData
		teamNumTrue = checkIfTeamSigma(gameData.teamNum)
		if(teamNumTrue)
		{
			generateQRCode();
		}
		else
		{
			openPopup();
		}
		}
let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(event) {
	event.preventDefault();
	deferredPrompt = event;

});

		function generateQRCode() {
	if (
		document.getElementById('prematch-scout-initials').value === "" ||
		document.getElementById('prematch-match-number').value === "" ||
		document.getElementById('prematch-team-number').value === "" ||
		document.getElementById('prematch-robot').value === "Choose_Answer"
	) {
	} else {
		const qrCodeData = `${gameData.initials.toUpperCase()} ${gameData.matchNum} ${gameData.robot} ${gameData.teamNum} ${gameData.centerlineNotes} ${gameData.speakerScored} ${gameData.speakerMissed} ${gameData.tampScored} ${gameData.tampMissed} ${gameData.tspeakerScored} ${gameData.tspeakerMissed} ${gameData.noteTrap} ${gameData.spotlight} ${gameData.endPos} ${gameData.harmony} ${gameData.offSkill} ${gameData.defSkill} ${gameData.speed} ${gameData.died} ${gameData.tippedOver} ${gameData.card}`;
		const qrCodeDataWithCommas = qrCodeData.split(' ').join('~');
		const qrCodeDataWithCommasWithComment = qrCodeDataWithCommas + '~' + gameData.comments;
		const qrCodeContainer = document.getElementById('qr-code-popup');
		qrCodeContainer.innerHTML = '';
		
		const qrCode = new QRCode(qrCodeContainer, {
			text: qrCodeDataWithCommasWithComment,
			width: 300,
			height: 300,
		});
		
		document.getElementById('popupQR').style.display = 'block';
		document.getElementById('overlay').style.display = 'block';
	}
}
		
function closePopupQR() {
	document.getElementById('popupQR').style.display = 'none';
	document.getElementById('overlay').style.display = 'none';
}
