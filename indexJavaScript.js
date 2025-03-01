document.addEventListener('DOMContentLoaded', function() {
    // Variables for game data
    const gameData = {
        initials: '',
        matchNum: '',
        teamNum: '',
        robot: '',
        centerlineNotes: '',
        speakerScored: '',
        speakerMissed: '',
        tampScored: '',
        tampMissed: '',
        tspeakerScored: '',
        tspeakerMissed: '',
        noteTrap: '',
        spotlight: '',
        endPos: '',
        harmony: '',
        offSkill: '',
        defSkill: '',
        speed: '',
        died: '',
        tippedOver: '',
        card: '',
        comments: ''
    };

    // Event listener for form submission
    document.getElementById('submitInfo').addEventListener('click', function() {
        gameData.initials = document.getElementById('prematch-scout-initials').value;
        gameData.matchNum = document.getElementById('prematch-match-number').value;
        gameData.teamNum = document.getElementById('prematch-team-number').value;
        gameData.robot = document.getElementById('prematch-robot').value;
        gameData.centerlineNotes = document.getElementById('prematch-centerline-notes').value;
        gameData.speakerScored = document.getElementById('prematch-speaker-scored').value;
        gameData.speakerMissed = document.getElementById('prematch-speaker-missed').value;
        gameData.tampScored = document.getElementById('prematch-tamp-scored').value;
        gameData.tampMissed = document.getElementById('prematch-tamp-missed').value;
        gameData.tspeakerScored = document.getElementById('prematch-tspeaker-scored').value;
        gameData.tspeakerMissed = document.getElementById('prematch-tspeaker-missed').value;
        gameData.noteTrap = document.getElementById('prematch-note-trap').value;
        gameData.spotlight = document.getElementById('prematch-spotlight').value;
        gameData.endPos = document.getElementById('prematch-end-pos').value;
        gameData.harmony = document.getElementById('prematch-harmony').value;
        gameData.offSkill = document.getElementById('prematch-off-skill').value;
        gameData.defSkill = document.getElementById('prematch-def-skill').value;
        gameData.speed = document.getElementById('prematch-speed').value;
        gameData.died = document.getElementById('prematch-died').value;
        gameData.tippedOver = document.getElementById('prematch-tipped-over').value;
        gameData.card = document.getElementById('prematch-card').value;
        gameData.comments = document.getElementById('prematch-comments').value;

        generateQRCode(); // Call to generate QR code after form is submitted
    });

    // Function to generate QR code
    function generateQRCode() {
        if (
            document.getElementById('prematch-scout-initials').value === "" ||
            document.getElementById('prematch-match-number').value === "" ||
            document.getElementById('prematch-team-number').value === "" ||
            document.getElementById('prematch-robot').value === "Choose_Answer"
        ) {
            return; // If any required field is missing, do nothing
        } else {
            // Prepare the data for QR code generation
            const qrCodeData = `${gameData.initials.toUpperCase()} ${gameData.matchNum} ${gameData.robot} ${gameData.teamNum} ${gameData.centerlineNotes} ${gameData.speakerScored} ${gameData.speakerMissed} ${gameData.tampScored} ${gameData.tampMissed} ${gameData.tspeakerScored} ${gameData.tspeakerMissed} ${gameData.noteTrap} ${gameData.spotlight} ${gameData.endPos} ${gameData.harmony} ${gameData.offSkill} ${gameData.defSkill} ${gameData.speed} ${gameData.died} ${gameData.tippedOver} ${gameData.card}`;
            
            const qrCodeDataWithCommas = qrCodeData.split(' ').join('~');
            const qrCodeDataWithCommasWithComment = qrCodeDataWithCommas + '~' + gameData.comments;

            // Generate the QR code in the popup container
            const qrCodeContainer = document.getElementById('qr-code-popup');
            qrCodeContainer.innerHTML = ''; // Clear previous QR codes if any
            
            const qrCode = new QRCode(qrCodeContainer, {
                text: qrCodeDataWithCommasWithComment,
                width: 300,
                height: 300,
            });
            
            // Display the popup with the QR code
            document.getElementById('popupQR').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }
    }

    // Function to close the QR code popup
    function closePopupQR() {
        // Remove the QR code from the container and hide the popup
        document.getElementById('popupQR').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('qr-code-popup').innerHTML = ''; // Clear the QR code from the container
    }

    // Event listener for closing the QR code popup
    document.getElementById('closePopupQR').addEventListener('click', closePopupQR);

    // Function to reset form
    function resetForm() {
        document.getElementById('prematch-scout-initials').value = '';
        document.getElementById('prematch-match-number').value = '';
        document.getElementById('prematch-team-number').value = '';
        document.getElementById('prematch-robot').value = 'Choose_Answer';
        document.getElementById('prematch-centerline-notes').value = '';
        document.getElementById('prematch-speaker-scored').value = '';
        document.getElementById('prematch-speaker-missed').value = '';
        document.getElementById('prematch-tamp-scored').value = '';
        document.getElementById('prematch-tamp-missed').value = '';
        document.getElementById('prematch-tspeaker-scored').value = '';
        document.getElementById('prematch-tspeaker-missed').value = '';
        document.getElementById('prematch-note-trap').value = '';
        document.getElementById('prematch-spotlight').value = '';
        document.getElementById('prematch-end-pos').value = '';
        document.getElementById('prematch-harmony').value = '';
        document.getElementById('prematch-off-skill').value = '';
        document.getElementById('prematch-def-skill').value = '';
        document.getElementById('prematch-speed').value = '';
        document.getElementById('prematch-died').value = '';
        document.getElementById('prematch-tipped-over').value = '';
        document.getElementById('prematch-card').value = '';
        document.getElementById('prematch-comments').value = '';
    }

    // Event listener for resetting the form
    document.getElementById('resetForm').addEventListener('click', resetForm);
});
