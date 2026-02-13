export function createTag(text, type) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = text;
    if (type === "like") {
        span.style.backgroundColor = "#e1bee7"; 
        span.style.color = "#7b1fa2";
    }
    return span;
}

export function resetLoveBtn(loveBtn) {
    loveBtn.querySelector("i").classList.remove("fa-solid");
    loveBtn.querySelector("i").classList.add("fa-regular");
    loveBtn.style.color = "#aaa";
}
