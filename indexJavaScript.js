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
        Object.keys(gameData).forEach(key => {
            const element = document.getElementById(`prematch-${key}`);
            if (element) gameData[key] = element.value;
        });

        generateQRCode(); // Call to generate QR code after form is submitted
    });

    // Function to generate QR code
    function generateQRCode() {
        // Create comma-delimited data string
        const qrCodeData = Object.values(gameData).join(',');

        // Select QR code container
        const qrCodeContainer = document.getElementById('qr-code-popup');
        qrCodeContainer.innerHTML = ''; // Clear previous QR code content

        // Generate QR code using your existing QRCode builder
        new QRCode(qrCodeContainer, {
            text: qrCodeData,
            width: 300,
            height: 300,
        });

        // Display the QR code popup
        document.getElementById('popupQR').style.display = 'flex';
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
        Object.keys(gameData).forEach(key => {
            const element = document.getElementById(`prematch-${key}`);
            if (element) element.value = '';
        });
    }

    // Event listener for resetting the form
    document.getElementById('resetForm').addEventListener('click', resetForm);
});
