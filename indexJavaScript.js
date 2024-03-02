const gameData = {
			initials: "",
			matchNum: 0,
			robot: "",
			teamNum: 0,
			humanAtAmp: false,
			noShow: false,
			mobility: false,
			ampScored: 0,
			ampMissed: 0,
			speakerScored: 0,
			speakerMissed: 0,
			autoFoul: 0,
			coopertition: false,
			tampScored: 0,
			tampMissed: 0,
			tspeakerScored: 0,
			tspeakerMissed: 0,
			noteTrap: 0,
			teleopFoul: 0,
			endPos: "",
			harmony: "",
			offSkill: "",
			defSkill: "",
			died: false,
			tippedOver: false,
			card: "",
			comments: "",
			dampMissed: 0,
			dampScored: 0,
			dspeakerMissed: 0,
			dspeakerScored: 0,
			dnoteTrap: 0,
			dfouls: 0
			
		
			
            }
		function ClearAll() {
			document.getElementById('prematch-scout-initials').value = '';
			document.getElementById('prematch-match-number').value = '';
			document.getElementById('prematch-robot').value = 'Red 1';
			document.getElementById('prematch-team-number').value = '';
			document.getElementById('prematch-human-player').checked = false;
			document.getElementById('prematch-no-show').checked = false;
			document.getElementById('Mobility').checked = false;
			document.getElementById('Died').checked = false;
			document.getElementById('Tipped-Over').checked = false;
			document.getElementById('Coopertition').checked = false;
			document.getElementById('Spotlight').checked = false;
			document.getElementById('End-Position').value = 'No Climb';
			document.getElementById('Harmony').value = 'Not Completed';
			document.getElementById('Offensive Skill').value = 'Not Effective';
			document.getElementById('Defensive Skill').value = 'Not Effective';
			document.getElementById('Card').value = 'Yellow Card';
			document.getElementById('Comments').value = '';
			
			gameData.initials = '';
			gameData.matchNum = 0;
			gameData.robot = 'Red 1';
			gameData.teamNum = 0;
			gameData.humanAtAmp = false;
			gameData.noShow = false;
			gameData.mobility = false;
			gameData.died = false;
			gameData.tippedOver = false;
			gameData.coopertition = false;
			gameData.endPos = 'No Climb';
			gameData.harmony = 'Not Completed';
			gameData.offSkill = 'Not Effective';
			gameData.defSkill = 'Not Effective';
			gameData.card = 'Yellow Card';
			gameData.comments = '';
			gameData.ampScored = 0;
			gameData.ampMissed = 0;
			gameData.speakerScored = 0;
			gameData.speakerMissed = 0;
			gameData.autoFoul = 0;
			gameData.tampScored = 0;
			gameData.tampMissed = 0;
			gameData.tspeakerScored = 0;
			gameData.tspeakerMissed = 0;
			gameData.noteTrap = 0;
			gameData.teleopFoul = 0;
			gameData.dampMissed = 0;
			gameData.dampScored = 0;
			gameData.dspeakerMissed = 0;
			gameData.dspeakerScored = 0;
			gameData.dnoteTrap = 0;
			gameData.dfouls = 0;

			document.getElementById('ampScored').textContent = gameData.ampScored;
			document.getElementById('ampMissed').textContent = gameData.ampMissed;
			document.getElementById('speakerScored').textContent = gameData.speakerScored;
			document.getElementById('speakerMissed').textContent = gameData.speakerMissed;
			document.getElementById('autoFoul').textContent = gameData.autoFoul;
			document.getElementById('tampScored').textContent = gameData.tampScored;
			document.getElementById('tampMissed').textContent = gameData.tampMissed;
			document.getElementById('tspeakerScored').textContent = gameData.tspeakerScored;
			document.getElementById('tspeakerMissed').textContent = gameData.tspeakerMissed;
			document.getElementById('noteTrap').textContent = gameData.noteTrap;
			document.getElementById('teleopFoul').textContent = gameData.teleopFoul;
			document.getElementById('dampMissed').textContent = gameData.dampMissed
			document.getElementById('dampScored').textContent = gameData.dampScored;
			document.getElementById('dampspeakerMissed').textContent = gameData.dspeakerMissed;
			document.getElementById('speakerScored').textContent = gameData.dspeakerScored;
			document.getElementById('dnoteTrap').textContent = gameData.dnoteTrap;
			document.getElementById('dfouls').textContent = gameData.dfouls;
			teamNumInput.classList.remove('error');
			matchNumInput.classList.remove('error');
			initialsInput.classList.remove('error');

		}


        function updateButtonNum(variable, value) {
    gameData[variable] += value;
    if (variable === 'teleopFoul' || variable === 'dfouls') {
        gameData[variable] = Math.max(gameData[variable], -69);
    } else {
        gameData[variable] = Math.max(gameData[variable], 0);
    }
    // Update HTML element value
    document.getElementById(variable).textContent = gameData[variable];

        function updateGameData(section, key, value) {
            gameData[section][key] = value;
        }
		}
		
        function updateQRCodeOnSubmit() {
		// Update all the gameData fields with the form values
		gameData.initials = document.getElementById('prematch-scout-initials').value;
		gameData.matchNum = parseInt(document.getElementById('prematch-match-number').value);
		gameData.robot = document.getElementById('prematch-robot').value;
		gameData.teamNum = parseInt(document.getElementById('prematch-team-number').value);
		gameData.humanAtAmp = document.getElementById('prematch-human-player').checked;
		gameData.noShow = document.getElementById('prematch-no-show').checked;
		gameData.mobility = document.getElementById('Mobility').checked;
		gameData.died = document.getElementById('Died').checked;
		gameData.tippedOver = document.getElementById('Tipped-Over').checked;
		gameData.coopertition = document.getElementById('Coopertition').checked;
		gameData.endPos = document.getElementById('End-Position').value;
		gameData.harmony = document.getElementById('Harmony').value;
		gameData.offSkill = document.getElementById('Offensive Skill').value;
		gameData.defSkill = document.getElementById('Defensive Skill').value;
		gameData.card = document.getElementById('Card').value;
		gameData.comments = document.getElementById('Comments').value;
		gameData.spotlight = document.getElementById('Spotlight').checked;
		// Update other fields similarly
		
		const initialsInput = document.getElementById('prematch-scout-initials');
		const matchNumInput = document.getElementById('prematch-match-number');
		const teamNumInput = document.getElementById('prematch-team-number');
		
		if (initialsInput.value === '') {
			initialsInput.classList.add('error');
		} 
		else {
			initialsInput.classList.remove('error');
		}

		if (matchNumInput.value === '') {
			matchNumInput.classList.add('error');
		} 
		else {
			matchNumInput.classList.remove('error');
		}

		if (teamNumInput.value === '') {
			teamNumInput.classList.add('error');
		} 
		else {
			teamNumInput.classList.remove('error');
		}
		// Generate QR code with updated gameData
		generateQRCode();
		}

         function generateQRCode() {
    if (
        document.getElementById('prematch-scout-initials').value === "" ||
        document.getElementById('prematch-match-number').value === "" ||
        document.getElementById('prematch-team-number').value === ""
    ) {
        // Fields are empty
    } else {
        const qrCodeData = `${gameData.initials} ${gameData.matchNum} ${gameData.robot} ${gameData.teamNum} ${gameData.humanAtAmp} ${gameData.noShow} ${gameData.mobility} ${gameData.ampScored} ${gameData.ampMissed} ${gameData.speakerScored} ${gameData.speakerMissed} ${gameData.autoFoul} ${gameData.coopertition} ${gameData.tampScored} ${gameData.tampMissed} ${gameData.tspeakerScored} ${gameData.tspeakerMissed} ${gameData.noteTrap} ${gameData.teleopFoul} ${gameData.dampMissed} ${gameData.dampScored} ${gameData.dspeakerMissed} ${gameData.dspeakerScored} ${gameData.dnoteTrap} ${gameData.dfouls} ${gameData.spotlight} ${gameData.endPos} ${gameData.harmony} ${gameData.offSkill} ${gameData.defSkill} ${gameData.died} ${gameData.tippedOver} ${gameData.card}`;
		const qrCodeDataWithCommas = qrCodeData.split(' ').join('~');
		const qrCodeDataWithCommasWithComment = qrCodeDataWithCommas + '~' + gameData.comments;
        const qrCodeContainer = document.getElementById('qr-code-popup');
        qrCodeContainer.innerHTML = '';

        const qrCode = new QRCode(qrCodeContainer, {
            text: qrCodeDataWithCommasWithComment,
            width: 300,
            height: 300,
        });

        document.getElementById('popup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }
}

		function closePopup() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }
