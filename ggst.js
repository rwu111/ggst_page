const solBtn = document.getElementById("solBtn");
const kyBtn = document.getElementById("kyBtn");
const happyBtn = document.getElementById("happyBtn");
const leoBtn = document.getElementById("leoBtn");

solBtn.addEventListener("click", () => switchCharacter("Songs/findyouroneway.mp3", "sectionSol"));
kyBtn.addEventListener("click", () => switchCharacter("Songs/theroarofthespark.mp3","sectionKy"));
happyBtn.addEventListener("click", () => switchCharacter("Songs/drift.mp3", "sectionHappy"));
leoBtn.addEventListener("click", () => switchCharacter("Songs/hellfire.mp3", "sectionLeo"));

let currentCharacter = null;

function switchCharacter(song, scrollTo) {
    //changeSong(song);
    let targetCharacter = document.getElementById(scrollTo);
    changeSection(targetCharacter);
}

async function changeSection(targetCharacter) {
    if(currentCharacter == targetCharacter) {
        return;
    }

    //current character slides out
    if(currentCharacter) {
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

function main() {
    const characters = document.querySelectorAll(".character");
    characters.forEach((c, i) => {
        c.style.display = (i === 0)? "block" : "none";
    });
    currentCharacter = characters[0];
}

document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", main) : main();