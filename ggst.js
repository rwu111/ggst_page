let currentSoundtrack = null;

function musicAndScroll(trackName, sectionId) {
    const soundtrack = new Audio(trackName)
    if (currentSoundtrack) {
        currentSoundtrack.pause();
        currentSoundtrack.currentTime = 0;  // Reset to beginning for next time
    }

    soundtrack.play();
    currentSoundtrack = soundtrack;
    let scrollTarget = document.getElementById(sectionId);
    scrollTarget.scrollIntoView({
        behavior: "smooth"
    });
}