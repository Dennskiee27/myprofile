const main = document.getElementById('main');
const images = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg"
];

let current = 0;
let playing = false;
let parts = [];

// --- THEME PERSISTENCE & BUG FIX ---
const btn = document.getElementById('theme-toggle');
const icon = document.getElementById('theme-icon');

const applyTheme = (theme) => {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (icon) icon.innerText = "LIGHT";
    } else {
        document.body.classList.remove('light-mode');
        if (icon) icon.innerText = "DARK";
    }
};

// Check for saved theme immediately
const savedTheme = localStorage.getItem('aurora-theme') || 'dark';
applyTheme(savedTheme);

if (btn) {
    btn.onclick = () => {
        const isLight = document.body.classList.toggle('light-mode');
        const themeToSave = isLight ? 'light' : 'dark';
        localStorage.setItem('aurora-theme', themeToSave);
        applyTheme(themeToSave);
    };
}

// --- AUTOMATED SLIDER LOGIC ---
if (main) {
    const cols = 3;
    for (let col = 0; col < cols; col++) {
        let part = document.createElement('div');
        part.className = 'part';
        let el = document.createElement('div');
        el.className = "section";
        let img = document.createElement('img');
        img.src = images[current];
        el.appendChild(img);
        part.style.setProperty('--x', -100/cols*col+'vw');
        part.appendChild(el);
        main.appendChild(part);
        parts.push(part);
    }

    window.go = function(dir) {
        if (playing) return;
        playing = true;
        current = (current + dir + images.length) % images.length;
        parts.forEach((part, p) => {
            let next = document.createElement('div');
            next.className = "section";
            let img = document.createElement('img');
            img.src = images[current];
            next.appendChild(img);
            if (p % 2) {
                part.prepend(next);
                gsap.to(part, {duration: 0, y: -window.innerHeight});
                gsap.to(part, {duration: 1.5, y: 0, ease: "power4.inOut", onComplete: () => {
                    if(part.children[1]) part.children[1].remove(); 
                    playing = false;
                }});
            } else {
                part.appendChild(next);
                gsap.to(part, {duration: 1.5, y: -window.innerHeight, ease: "power4.inOut", onComplete: () => {
                    if(part.children[0]) part.children[0].remove(); 
                    gsap.to(part, {duration: 0, y: 0}); 
                    playing = false;
                }});
            }
        });
    };

    setInterval(() => window.go(1), 5000);
}