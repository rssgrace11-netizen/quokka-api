// docs.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Copy Code functionality
    const copyBtns = document.querySelectorAll('.code-copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const codeBlock = btn.closest('.code-block');
            const codeText = codeBlock.querySelector('code').innerText;
            
            navigator.clipboard.writeText(codeText).then(() => {
                // Change icon to check
                const icon = btn.querySelector('i');
                icon.className = 'fa-solid fa-check';
                btn.classList.add('copied');
                
                // Revert after 2 seconds
                setTimeout(() => {
                    icon.className = 'fa-regular fa-copy';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    // 2. ScrollSpy for Sidebar
    const sections = document.querySelectorAll('.doc-section');
    const navLinks = document.querySelectorAll('.doc-nav a');
    
    // Offset for sticky nav or header
    const offset = 150;

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - offset)) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 3. Live Demo Widget Logic
    const btnAnalyze = document.getElementById('btn-analyze');
    const demoResult = document.getElementById('demo-result');
    const demoProgress = document.getElementById('demo-progress');
    const demoPercent = document.getElementById('demo-percent');
    const demoMsg = document.getElementById('demo-msg');

    if (btnAnalyze) {
        btnAnalyze.addEventListener('click', () => {
            // Reset state
            btnAnalyze.disabled = true;
            btnAnalyze.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
            demoResult.classList.add('hidden');
            demoProgress.style.width = '0%';
            demoPercent.innerText = '0%';

            // Simulate AI Processing delay
            setTimeout(() => {
                const randomScore = Math.floor(Math.random() * (100 - 80 + 1)) + 80; // 80 to 100% since quokkas are happy
                
                let msg = "";
                if (randomScore >= 97) msg = "This quokka is radiating EXPLOSIVE joy! ✨🐹✨";
                else if (randomScore >= 90) msg = "A very happy, smiling quokka! 😊";
                else msg = "This quokka is peacefully content. 🌿";

                demoMsg.innerText = msg;
                demoResult.classList.remove('hidden');

                // Animate progress bar slightly after making result visible
                setTimeout(() => {
                    demoProgress.style.width = randomScore + '%';
                    
                    // Counter animation for text
                    let current = 0;
                    const duration = 1500; // 1.5s
                    const steps = 40;
                    const stepTime = Math.abs(Math.floor(duration / steps));
                    const increment = randomScore / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= randomScore) {
                            current = randomScore;
                            clearInterval(timer);
                        }
                        demoPercent.innerText = Math.round(current) + '%';
                    }, stepTime);

                }, 150);

                btnAnalyze.disabled = false;
                btnAnalyze.innerHTML = '<i class="fa-solid fa-rotate-right" style="margin-right: 8px;"></i>Try Another';
            }, 1800);
        });
    }
});
