let playerCount = 0;
const playbackQualities = ['small', 'medium', 'large', 'hd720'];
const workers = [];

function generateUrls() {
    const pageNumber = document.getElementById('pageNumber').value;
    const url = document.getElementById('url').value;
    const autoplay = document.getElementById('autoplay').checked;
    const mute = document.getElementById('mute').checked;
    const outputDiv = document.getElementById('output');

    outputDiv.innerHTML = ''; // Limpar a saída anterior
    workers.forEach(worker => worker.terminate()); // Encerrar qualquer worker existente
    workers.length = 0; // Limpar lista de workers

    if (pageNumber < 1 || !url) {
        alert('Por favor, insira um número válido de visualizações e uma URL.');
        return;
    }

    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        for (let i = 0; i < pageNumber; i++) {
            createWorkerSession(videoId, autoplay, mute, i, outputDiv);
        }
    } else {
        alert("URL do YouTube inválida.");
    }
}

function createWorkerSession(videoId, autoplay, mute, index, outputDiv) {
    const sessionDuration = Math.floor(Math.random() * 20000) + 10000; // 10-30 seconds per session
    const worker = new Worker('sessionWorker.js');

    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'iframe-container';
    iframeContainer.id = `player-${index}`;
    outputDiv.appendChild(iframeContainer);

    worker.postMessage({
        videoId: videoId,
        mute: mute,
        autoplay: autoplay,
        sessionDuration: sessionDuration,
        playerId: `player-${index}`
    });

    worker.onmessage = (event) => {
        if (event.data.status === 'done') {
            outputDiv.removeChild(iframeContainer); // Remove player after session ends
        }
    };

    workers.push(worker);
}
