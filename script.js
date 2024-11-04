let playerCount = 0;
const players = [];
const playbackQualities = ['small', 'medium', 'large', 'hd720'];

function generateUrls() {
    const pageNumber = document.getElementById('pageNumber').value;
    const url = document.getElementById('url').value;
    const autoplay = document.getElementById('autoplay').checked ? 1 : 0;
    const mute = document.getElementById('mute').checked ? 1 : 0;
    const outputDiv = document.getElementById('output');

    // Limpar a saída anterior
    outputDiv.innerHTML = '';
    players.length = 0; // Reinicia a lista de players para evitar duplicação

    if (pageNumber < 1 || !url) {
        alert('Por favor, insira um número válido de visualizações e uma URL.');
        return;
    }

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

            console.log(`Criando player com ID: player-${playerCount}`); // Debug

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
        alert("URL do YouTube inválida.");
    }
}

function onPlayerReady(event) {
    const playDelay = Math.floor(Math.random() * 5000) + 2000; // 2 a 7 segundos
    console.log(`Reproduzindo após ${playDelay / 1000} segundos`); // Debug
    setTimeout(() => {
        event.target.playVideo();
    }, playDelay);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        const quality = playbackQualities[Math.floor(Math.random() * playbackQualities.length)];
        event.target.setPlaybackQuality(quality);
        console.log(`Qualidade de reprodução definida para: ${quality}`); // Debug

        const viewDuration = Math.floor(Math.random() * 20000) + 10000; // 10 a 30 segundos
        console.log(`Tempo de visualização simulado: ${viewDuration / 1000} segundos`); // Debug
        setTimeout(() => {
            event.target.pauseVideo();
            console.log('Vídeo pausado'); // Debug

            const resumeDelay = Math.floor(Math.random() * 5000) + 2000; // 2 a 7 segundos
            setTimeout(() => {
                event.target.playVideo();
                console.log('Vídeo retomado'); // Debug
            }, resumeDelay);

        }, viewDuration);
    }
}
