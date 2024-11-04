let playerCount = 0;
const playbackQualities = ['small', 'medium', 'large', 'hd720'];
const players = [];

function generateUrls() {
    const pageNumber = document.getElementById('pageNumber').value;
    const url = document.getElementById('url').value;
    const autoplay = document.getElementById('autoplay').checked ? 1 : 0;
    const mute = document.getElementById('mute').checked ? 1 : 0;
    const outputDiv = document.getElementById('output');

    outputDiv.innerHTML = ''; // Limpar a saída anterior
    players.length = 0; // Reinicia a lista de players para evitar duplicação

    if (pageNumber < 1 || !url) {
        alert('Por favor, insira um número válido de visualizações e uma URL.');
        return;
    }

    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        for (let i = 0; i < pageNumber; i++) {
            createPlayerSession(videoId, autoplay, mute, i, outputDiv);
        }
    } else {
        alert("URL do YouTube inválida.");
    }
}

function createPlayerSession(videoId, autoplay, mute, index, outputDiv) {
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'iframe-container';
    iframeContainer.id = `player-${index}`;
    outputDiv.appendChild(iframeContainer);

    const player = new YT.Player(`player-${index}`, {
        videoId: videoId,
        playerVars: {
            autoplay: autoplay,
            mute: mute
        },
        events: {
            'onReady': (event) => onPlayerReady(event, index),
            'onStateChange': onPlayerStateChange
        }
    });

    players.push(player);
}

// Função para gerenciar a simulação de interações
async function onPlayerReady(event, index) {
    const playDelay = Math.floor(Math.random() * 5000) + 2000; // 2 a 7 segundos de atraso
    await sleep(playDelay);
    event.target.playVideo();

    simulateUserInteraction(event.target, index);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        // Randomize playback quality
        const quality = playbackQualities[Math.floor(Math.random() * playbackQualities.length)];
        event.target.setPlaybackQuality(quality);
        console.log(`Qualidade de reprodução definida para: ${quality}`);
    }
}

// Função para simular comportamento humano com pausas e retomadas
async function simulateUserInteraction(player, index) {
    const sessionDuration = Math.floor(Math.random() * 20000) + 10000; // 10 a 30 segundos de sessão
    const endSession = Date.now() + sessionDuration;

    while (Date.now() < endSession) {
        const actionDelay = Math.floor(Math.random() * 5000) + 2000; // Atraso entre ações 2 a 7 seg
        await sleep(actionDelay);

        if (Math.random() > 0.5) {
            player.pauseVideo();
            console.log(`Player ${index} pausado.`);
        } else {
            player.playVideo();
            console.log(`Player ${index} retomado.`);
        }

        // Alterar qualidade aleatoriamente durante a sessão
        const quality = playbackQualities[Math.floor(Math.random() * playbackQualities.length)];
        player.setPlaybackQuality(quality);
        console.log(`Qualidade de reprodução alterada para: ${quality}`);
    }

    player.stopVideo();
    console.log(`Sessão do Player ${index} finalizada.`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
