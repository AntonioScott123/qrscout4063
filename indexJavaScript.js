// --- Data and Utility Functions ---
const gameData = {
    autoMoved: false, 
    L4CoralScored: 0, 
    L4CoralMissed: 0, 
    L3CoralScored: 0, 
    L3CoralMissed: 0, 
    L2CoralScored: 0, 
    L2CoralMissed: 0, 
    L1CoralScored: 0, 
    L1CoralMissed: 0, 
    AlgaeScored: 0, 
    AlgaeMissed: 0, 
    endPos: "", 
    tippedDuringMatch: false, 
    speed: "" 
};

function scrollToTop() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
}

// --- Form Functions ---
function ClearAll() {
    // Reset the form to its default values
    document.getElementById('autoMoved').checked = false;
    gameData.autoMoved = false;
    const counterIDs = ['L4CoralScored', 'L4CoralMissed', 'L3CoralScored', 'L3CoralMissed', 
        'L2CoralScored', 'L2CoralMissed', 'L1CoralScored', 'L1CoralMissed', 
        'AlgaeScored', 'AlgaeMissed'];
    
    counterIDs.forEach(id => {
        gameData[id] = 0;
        document.getElementById(id).textContent = 0;
    });
}

// Update the button number for each specific counter
function updateButtonNum(counterID, change) {
    gameData[counterID] += change;
    document.getElementById(counterID).textContent = gameData[counterID];
}

// --- QR Code Generation ---
function updateQRCodeOnSubmit() {
    let qrCodeData = `
        Auto Moved: ${gameData.autoMoved}
        L4 Coral Scored: ${gameData.L4CoralScored} L4 Coral Missed: ${gameData.L4CoralMissed}
        L3 Coral Scored: ${gameData.L3CoralScored} L3 Coral Missed: ${gameData.L3CoralMissed}
        L2 Coral Scored: ${gameData.L2CoralScored} L2 Coral Missed: ${gameData.L2CoralMissed}
        L1 Coral Scored: ${gameData.L1CoralScored} L1 Coral Missed: ${gameData.L1CoralMissed}
        Algae Scored: ${gameData.AlgaeScored} Algae Missed: ${gameData.AlgaeMissed}
        End Position: ${gameData.endPos}
        Tipped During Match: ${gameData.tippedDuringMatch}
        Robot Speed: ${gameData.speed}
        Comments: ${document.getElementById('Comments').value}
    `;

    const qrCode = new QRCode(document.getElementById('qr-code'), {
        text: qrCodeData,
        width: 256,
        height: 256,
    });
}
