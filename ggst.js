"use strict";
const solBtn = document.getElementById("solBtn");
const kyBtn = document.getElementById("kyBtn");
const happyBtn = document.getElementById("happyBtn");
const leoBtn = document.getElementById("leoBtn");
const optionBtn = document.getElementById("optionBtn");
if (solBtn) {
    solBtn.addEventListener("click", () => switchCharacter("sectionSol"));
}
if (kyBtn) {
    kyBtn.addEventListener("click", () => switchCharacter("sectionKy"));
}
if (happyBtn) {
    happyBtn.addEventListener("click", () => switchCharacter("sectionHappy"));
}
if (leoBtn) {
    leoBtn.addEventListener("click", () => switchCharacter("sectionLeo"));
}
if (optionBtn) {
    optionBtn.addEventListener("click", () => toggleSidebar(sidebarToggled));
}
// phone port sidebar toggle
let sidebarToggled = false;
const border = document.getElementById("border");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
function toggleSidebar(sidebarToggled) {
    if (!sidebar || !sidebarOverlay || !border)
        return;
    if (!sidebarToggled) {
        sidebar.classList.remove("smallScreenClosed");
        sidebar.classList.add("smallScreenOpened");
        sidebarOverlay.classList.add("active");
        border.style.display = "inline";
        sidebarToggled = true;
    }
    else {
        sidebar.classList.remove("smallScreenOpened");
        sidebar.classList.add("smallScreenClosed");
        sidebarOverlay.classList.remove("active");
        border.style.display = "none";
        sidebarToggled = false;
    }
}
let currentCharacter = null;
// Music Player Variables
let currentSongIndex = 0;
let audio = new Audio();
let cover = document.getElementById("songCover");
let isPlaying = false;
let syncEnabled = true;
// Song data
const songs = [
    {
        name: "Find Your One Way",
        file: "Songs/findyouroneway.mp3",
        character: "sectionSol",
        cover: "Images/solSongCover.jpg"
    },
    {
        name: "The Roar of the Spark",
        file: "Songs/theroarofthespark.mp3",
        character: "sectionKy",
        cover: "Images/kySongCover.jpg"
    },
    {
        name: "Drift",
        file: "Songs/drift.mp3",
        character: "sectionHappy",
        cover: "Images/happySongCover.jpg"
    },
    {
        name: "Hellfire",
        file: "Songs/hellfire.mp3",
        character: "sectionLeo",
        cover: "Images/leoSongCover.jpg"
    }
];
// DOM Elements for Music Player
const vinylDisc = document.querySelector(".vinyl-disc");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
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
    if (cover instanceof Image)
        cover.src = song.cover;
    if (songNameEl)
        songNameEl.textContent = song.name;
    audio.addEventListener("loadedmetadata", () => {
        if (durationEl)
            durationEl.textContent = formatTime(audio.duration);
    });
    if (isPlaying) {
        audio.play().catch(e => console.log("Audio play error:", e));
    }
}
async function playSong() {
    audio.play();
    isPlaying = true;
    if (!playBtn)
        return;
    if (!pauseBtn)
        return;
    if (!vinylDisc)
        return;
    playBtn.classList.add("disappear");
    pauseBtn.classList.add("appear");
    await new Promise(r => setTimeout(r, 500));
    playBtn.classList.remove("disappear");
    pauseBtn.classList.remove("appear");
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline";
    vinylDisc.classList.add("spinning");
}
async function pauseSong() {
    audio.pause();
    isPlaying = false;
    if (!pauseBtn)
        return;
    if (!playBtn)
        return;
    pauseBtn.classList.add("disappear");
    playBtn.classList.add("appear");
    await new Promise(r => setTimeout(r, 500));
    pauseBtn.classList.remove("disappear");
    playBtn.classList.remove("appear");
    pauseBtn.style.display = "none";
    playBtn.style.display = "inline";
    if (vinylDisc)
        vinylDisc.classList.remove("spinning");
}
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    }
    else {
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
    if (isNaN(seconds))
        return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
function updateProgress() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        if (progressBar instanceof HTMLElement)
            progressBar.style.width = `${progressPercent}%`;
        if (currentTimeEl)
            currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}
function setProgress(e) {
    if (!progressContainer)
        return;
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
    if (targetCharacter)
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
        }
        else if (songIndex !== -1 && songIndex === currentSongIndex) {
            // Restart current song from beginning
            audio.currentTime = 0;
            if (!isPlaying && syncEnabled) {
                playSong();
            }
        }
    }
}
async function changeSection(targetCharacter) {
    if (currentCharacter == (targetCharacter || null)) {
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
    if (syncToggle instanceof HTMLInputElement)
        syncEnabled = syncToggle.checked;
}
// Event Listeners for Music Player
if (playBtn)
    playBtn.addEventListener("click", togglePlayPause);
if (pauseBtn)
    pauseBtn.addEventListener("click", togglePlayPause);
if (prevBtn)
    prevBtn.addEventListener("click", prevSong);
if (nextBtn)
    nextBtn.addEventListener("click", nextSong);
if (progressContainer)
    progressContainer.addEventListener("click", (e) => { setProgress(e); });
if (syncToggle)
    syncToggle.addEventListener("change", toggleSync);
function main() {
    const characters = document.querySelectorAll(".character");
    characters.forEach((c, i) => {
        if (c instanceof HTMLElement)
            c.style.display = (i === 0) ? "block" : "none";
    });
    currentCharacter = characters[0];
    if (playBtn)
        playBtn.style.display = "inline";
    if (pauseBtn)
        pauseBtn.style.display = "none";
    // Load first song but don't autoplay
    currentSongIndex = 0;
    loadSong(0);
    if (sidebar) {
        if (window.matchMedia("(max-width: 999px) and (pointer: coarse)").matches) {
            sidebar.classList.add("smallScreenClosed");
        }
    }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", main) : main();
