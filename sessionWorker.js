self.onmessage = function(event) {
    const { videoId, mute, autoplay, sessionDuration } = event.data;
    const playbackQualities = ['small', 'medium', 'large', 'hd720'];

    let player;
    let isPlaying = false;

    function initPlayer() {
        player = new YT.Player(event.data.playerId, {
            videoId: videoId,
            playerVars: {
                autoplay: autoplay ? 1 : 0,
                mute: mute ? 1 : 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        if (autoplay) {
            setTimeout(() => event.target.playVideo(), Math.random() * 3000 + 2000); // 2-5 sec delay
        }
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING && !isPlaying) {
            isPlaying = true;
            performRandomActions();
        }
    }

    function performRandomActions() {
        const quality = playbackQualities[Math.floor(Math.random() * playbackQualities.length)];
        player.setPlaybackQuality(quality);

        setTimeout(() => player.pauseVideo(), Math.random() * 15000 + 5000); // Pause after 5-20 sec
        setTimeout(() => player.playVideo(), Math.random() * 5000 + 2000); // Resume after 2-7 sec

        setTimeout(() => {
            player.stopVideo();
            closeWorker();
        }, sessionDuration);
    }

    function closeWorker() {
        self.postMessage({ status: 'done' });
        self.close(); // Close the worker when done
    }

    initPlayer();
};
