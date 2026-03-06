// quokkas.js

document.addEventListener('DOMContentLoaded', () => {
    const happinessValues = document.querySelectorAll('.happiness-value');
    
    happinessValues.forEach(el => {
        // Generate random score between 85 and 100
        const score = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
        
        // Let's add an Easter egg: if 100%, make it golden and extra sparkly
        if (score === 100) {
            el.classList.add('gold');
            el.innerHTML = '100%<br><span style="font-size: 1.2rem; display:block; margin-top:10px;">✨ PERFECT ✨</span>';
        } else {
            el.innerHTML = score + '%';
        }
    });
});
