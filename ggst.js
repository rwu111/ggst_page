const solBtn = document.getElementById("solBtn");
const kyBtn = document.getElementById("kyBtn");
const happyBtn = document.getElementById("happyBtn");
const leoBtn = document.getElementById("leoBtn");

solBtn.addEventListener("click", () => switchCharacter("sectionSol"));
kyBtn.addEventListener("click", () => switchCharacter("sectionKy"));
happyBtn.addEventListener("click", () => switchCharacter("sectionHappy"));
leoBtn.addEventListener("click", () => switchCharacter("sectionLeo"));

let currentCharacter = null;

// Music Player Variables
let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;
let syncEnabled = true;

// Song data
const songs = [
    {
        name: "Find Your One Way",
        file: "Songs/findyouroneway.mp3",
        character: "sectionSol"
    },
    {
        name: "The Roar of the Spark",
        file: "Songs/theroarofthespark.mp3",
        character: "sectionKy"
    },
    {
        name: "Drift",
        file: "Songs/drift.mp3",
        character: "sectionHappy"
    },
    {
        name: "Hellfire",
        file: "Songs/hellfire.mp3",
        character: "sectionLeo"
    }
];

// DOM Elements for Music Player
const vinylDisc = document.querySelector(".vinyl-disc");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const songNameEl = document.getElementById("songName");
const syncToggle = document.getElementById("syncToggle");

// Music Player Functions
function loadSong(index) {
    const song = songs[index];
    audio.src = song.file;
    songNameEl.textContent = song.name;

    audio.addEventListener("loadedmetadata", () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    if (isPlaying) {
        audio.play().catch(e => console.log("Audio play error:", e));
    }
}

function playSong() {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = "⏸";
    vinylDisc.classList.add("spinning");
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶";
    vinylDisc.classList.remove("spinning");
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateProgress() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Auto-play next song when current ends
audio.addEventListener("ended", () => {
    nextSong();
});

audio.addEventListener("timeupdate", updateProgress);

// Character switching with music sync
async function switchCharacter(scrollTo) {
    let targetCharacter = document.getElementById(scrollTo);
    await changeSection(targetCharacter);

    // Sync music if toggle is enabled
    if (syncEnabled) {
        const songIndex = songs.findIndex(song => song.character === scrollTo);
        if (songIndex !== -1 && songIndex !== currentSongIndex) {
            currentSongIndex = songIndex;
            loadSong(currentSongIndex);
            if (isPlaying) {
                playSong();
            }
        } else if (songIndex !== -1 && songIndex === currentSongIndex) {
            // Restart current song from beginning
            audio.currentTime = 0;
            if (!isPlaying && syncEnabled) {
                playSong();
            }
        }
    }
}

async function changeSection(targetCharacter) {
    if (currentCharacter == targetCharacter) {
        return;
    }

    //current character slides out
    if (currentCharacter) {
        currentCharacter.classList.add("exiting");
        await new Promise(r => setTimeout(r, 1000));
        currentCharacter.classList.remove("exiting");
        currentCharacter.style.display = "none";
    }

    //target character slides in
    currentCharacter = targetCharacter;
    currentCharacter.style.display = "block";
    currentCharacter.classList.add("entering");
    await new Promise(r => setTimeout(r, 1000));
    currentCharacter.classList.remove("entering");
}

// Toggle sync function
function toggleSync() {
    syncEnabled = syncToggle.checked;
}

// Event Listeners for Music Player
playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
progressContainer.addEventListener("click", setProgress);
syncToggle.addEventListener("change", toggleSync);

function main() {
    const characters = document.querySelectorAll(".character");
    characters.forEach((c, i) => {
        c.style.display = (i === 0) ? "block" : "none";
    });
    currentCharacter = characters[0];

    // Load first song but don't autoplay
    currentSongIndex = 0;
    loadSong(0);
}

document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", main) : main();