let playerCount = 0;
const players = [];
const playbackQualities = ['small', 'medium', 'large', 'hd720'];

function generateUrls() {
    const pageNumber = document.getElementById('pageNumber').value;
    const url = document.getElementById('url').value;
    const autoplay = document.getElementById('autoplay').checked ? 1 : 0;
    const mute = document.getElementById('mute').checked ? 1 : 0;
    const outputDiv = document.getElementById('output');

    // Clear previous output
    outputDiv.innerHTML = '';

    // Validate input
    if (pageNumber < 1 || !url) {
        alert('Please enter a valid number of pages and URL.');
        return;
    }

    // Check if the URL is a YouTube link
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        for (let i = 0; i < pageNumber; i++) {
            const iframeContainer = document.createElement('div');
            iframeContainer.className = 'iframe-container';

            const iframe = document.createElement('div');
            iframe.id = `player-${playerCount}`;

            iframeContainer.appendChild(iframe);
            outputDiv.appendChild(iframeContainer);

            const player = new YT.Player(`player-${playerCount}`, {
                videoId: videoId,
                playerVars: {
                    autoplay: autoplay,
                    mute: mute
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });

            players.push(player);
            playerCount++;
        }
    } else {
        alert("Invalid YouTube URL.");
    }
}

// Function to play video after a delay to simulate different start times
function onPlayerReady(event) {
    const playDelay = Math.floor(Math.random() * 5000) + 2000; // 2 to 7 seconds
    setTimeout(() => {
        event.target.playVideo();
    }, playDelay);
}

// Randomize playback quality and introduce pauses
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        // Set random playback quality
        const quality = playbackQualities[Math.floor(Math.random() * playbackQualities.length)];
        event.target.setPlaybackQuality(quality);

        // Randomize view duration
        const viewDuration = Math.floor(Math.random() * 20000) + 10000; // 10 to 30 seconds
        setTimeout(() => {
            event.target.pauseVideo();

            // Random delay before resuming video (simulate human interaction)
            const resumeDelay = Math.floor(Math.random() * 5000) + 2000; // 2 to 7 seconds
            setTimeout(() => {
                event.target.playVideo();
            }, resumeDelay);

        }, viewDuration);
    }
}
