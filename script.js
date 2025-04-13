const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let names = [];
const colors = ["#FF5733", "#C70039", "#900C3F", "#581845", "#2874A6", "#1ABC9C", "#8E44AD", "#2E4053"];
let rotationAngle = 0;
let isSpinning = false;

canvas.style.cursor = 'pointer'; // Makes the cursor a pointer when hovering over the wheel

// Add click event listener to the canvas
canvas.addEventListener('click', function (e) {
    spin();
});

function truncateText(text, maxLength = 15) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function drawWheel() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Calculate segment angle based on number of names
    const segmentAngle = 360 / names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel segments
    names.forEach((name, i) => {
        const angle = i * segmentAngle;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius,
            (angle + rotationAngle) * Math.PI / 180,
            (angle + segmentAngle + rotationAngle) * Math.PI / 180);

        // Use colors array for better visibility
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.stroke();

        // Draw names
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(((angle + segmentAngle / 2 + rotationAngle)) * Math.PI / 180);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';

        // Truncate the name if it's too long
        const truncatedName = truncateText(name);
        ctx.fillText(truncatedName, radius - 20, 5); // Added vertical offset of 5px
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();

    // Draw arrow
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius - 20, centerY - 15);
    ctx.lineTo(centerX + radius - 20, centerY + 15);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function spin() {
    if (isSpinning) return;
    if (names.length < 2) {
        alert("Please add at least 2 names!");
        return;
    }

    isSpinning = true;
    const spinButton = document.querySelector('.spin-button');
    spinButton.disabled = true;

    const segmentAngle = 360 / names.length; // Calculate segment angle here too
    const numRotations = 5 + Math.random() * 5;
    const finalAngle = numRotations * 360 + Math.random() * 360;
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentRotation = finalAngle * easeOut;

        rotationAngle = currentRotation % 360;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinButton.disabled = false;

            const winningSegment = Math.floor(((360 - (rotationAngle % 360)) / segmentAngle));
            const winner = names[winningSegment % names.length];

            const winnerModal = new bootstrap.Modal(document.getElementById('winnerModal'));
            document.getElementById('winnerName').textContent = winner;
            winnerModal.show();
        }
    }

    requestAnimationFrame(animate);
}

function addName() {
    const nameInput = document.getElementById('nameInput');
    const inputText = nameInput.value;

    // Split text by newlines and filter empty lines
    names = inputText.split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

    drawWheel();
}

function removeWinner() {
    const winner = document.getElementById('winnerName').textContent;
    const nameInput = document.getElementById('nameInput');

    // Get current names from textarea
    let currentNames = nameInput.value.split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

    // Remove the winner from the list
    currentNames = currentNames.filter(name => name !== winner);

    // Update textarea
    nameInput.value = currentNames.join('\n');

    // Update wheel
    addName();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('winnerModal'));
    modal.hide();
}

function shuffleNames() {
    // Ambil nilai dari textarea
    const textarea = document.getElementById('nameInput');
    const names = textarea.value.split('\n').filter(name => name.trim() !== '');

    // Shuffle array menggunakan Fisher-Yates algorithm
    for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
    }

    // Update textarea dengan hasil shuffle
    textarea.value = names.join('\n');

    // Update wheel setelah shuffle
    addName();
}

// Event listener tetap sama
document.getElementById('nameInput').addEventListener('input', function (e) {
    addName();
});

// Initial draw
drawWheel();
