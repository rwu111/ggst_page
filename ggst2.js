const solBtn = document.getElementById("sidebarSol");
const kyBtn = document.getElementById("sidebarKy");
const happyBtn = document.getElementById("sidebarHappy");
const leoBtn = document.getElementById("sidebarLeo");

const solTheme = new Audio("findyouroneway.mp3");
const kyTheme = new Audio("theroarofthespark.mp3");
const happyTheme = new Audio("drift.mp3");
const leoTheme = new Audio("hellfire.mp3");

solBtn.addEventListener("click", () => musicAndScroll(solTheme, "sectionSol"));
kyBtn.addEventListener("click", () => musicAndScroll(kyTheme, "sectionKy"));
happyBtn.addEventListener("click", () => musicAndScroll(happyTheme, "sectionHappy"));
leoBtn.addEventListener("click", () => musicAndScroll(leoTheme, "sectionLeo"));

let currentAudio = null;

function musicAndScroll(soundtrack, scrollTo) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;  // Reset to beginning for next time
    }

    soundtrack.play();
    currentAudio = soundtrack;
    const scrollTarget = document.getElementById(scrollTo);
    scrollTarget.scrollIntoView({
        behavior: "smooth"
    });
}