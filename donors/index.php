<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Donor Benefits | Motion Picture Mafia</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="mpm logo.png">    
<style>
body{
    background: #000;
    color:#fff;
    font-family:'Poppins',sans-serif;
    min-height:100vh;
    margin:0;
    padding:0;
    position:relative;
    overflow-x: hidden;
}

/* === LOADING ANIMATION === */
#loader {
    position: fixed;
    inset: 0;
    background: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 1s ease, visibility 1s ease;
}

#loader.hidden {
    opacity: 0;
    visibility: hidden;
}

.loader-logo {
    font-size: clamp(2.5rem, 10vw, 4rem);
    font-weight: 800;
    background: linear-gradient(135deg, #ff3c3c, #ffb347, #ff7b00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 30px;
    animation: pulse 2s infinite;
}

.loader-spinner {
    width: 80px;
    height: 80px;
    border: 6px solid rgba(255,60,60,0.2);
    border-top: 6px solid #ff3c3c;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Main Content - Hidden until loaded */
.main-content {
    opacity: 0;
    transition: opacity 1.2s ease;
}

.main-content.loaded {
    opacity: 1;
}

.container{
    padding: 80px 20px 120px;
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
}

h1{
    text-align:center;
    margin-bottom:60px;
    font-size: clamp(2.5rem, 8vw, 3.5rem);
    font-weight:800;
    background:linear-gradient(135deg,#ff3c3c,#ffb347,#ff7b00);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    text-shadow: 0 0 30px rgba(255,123,0,0.4);
    animation: fadeUp 1s ease;
}

/* Tier Cards (same premium style) */
.tiers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 40px;
    margin: 0 auto;
}

.tier {
    position: relative;
    background: rgba(15,15,15,0.75);
    backdrop-filter: blur(20px);
    border-radius: 30px;
    padding: 50px 30px 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.9);
    transition: all 0.5s cubic-bezier(0.25,0.8,0.25,1);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    animation: fadeUp 0.8s ease forwards;
    opacity: 0;
}

.tier:nth-child(1) { animation-delay: 0.4s; }
.tier:nth-child(2) { animation-delay: 0.6s; }
.tier:nth-child(3) { animation-delay: 0.8s; }
.tier:nth-child(4) { animation-delay: 1.0s; }

.tier:nth-child(1) { border-top: 5px solid #ff3c3c; }
.tier:nth-child(2) { border-top: 5px solid #ff7b00; }
.tier:nth-child(3) { border-top: 5px solid #ffb347; }
.tier:nth-child(4) { border-top: 5px solid #ffd700; }

.tier::before {
    content: attr(data-tier);
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg,#ff3c3c,#ff7b00);
    color: #fff;
    padding: 10px 35px;
    border-radius: 0 0 20px 20px;
    font-weight: 700;
    font-size: 1.1rem;
    box-shadow: 0 10px 20px rgba(255,60,60,0.4);
    z-index: 2;
}
.tier:nth-child(2)::before { background: linear-gradient(135deg,#ff7b00,#ffb347); }
.tier:nth-child(3)::before { background: linear-gradient(135deg,#ffb347,#ffd700); box-shadow: 0 10px 20px rgba(255,179,71,0.5); }
.tier:nth-child(4)::before { background: linear-gradient(135deg,#ffd700,#ffffff); color:#000; box-shadow: 0 10px 30px rgba(255,215,0,0.6); }

.tier:hover {
    transform: translateY(-20px) scale(1.03);
    box-shadow: 0 40px 100px rgba(255,60,60,0.4);
}
.tier:nth-child(3):hover { box-shadow: 0 40px 100px rgba(255,179,71,0.5); }
.tier:nth-child(4):hover { box-shadow: 0 40px 100px rgba(255,215,0,0.7); }

.tier h2 {
    text-align: center;
    font-size: clamp(2rem, 6vw, 2.6rem);
    margin: 20px 0 10px;
    background: linear-gradient(135deg,#ff3c3c,#ffb347);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
}

.tier .price {
    text-align: center;
    font-size: clamp(1.8rem, 5vw, 2.2rem);
    font-weight: 800;
    color: #ffb347;
    margin: 20px 0 30px;
    padding: 15px;
    background: rgba(255,179,71,0.15);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
}
.tier .price::after {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(30deg);
    animation: shine 5s infinite;
}

@keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(30deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(30deg); }
}

.tier ul {
    list-style: none;
    padding: 0;
    margin: 30px 0;
}

.tier ul li {
    padding: 16px 0;
    padding-left: 45px;
    position: relative;
    line-height: 1.7;
    font-size: 1.05rem;
    border-bottom: 1px dashed rgba(255,255,255,0.1);
}

.tier ul li:last-child { border-bottom: none; }

.tier ul li::before {
    content: "✔";
    position: absolute;
    left: 0;
    font-size: 1.6rem;
    font-weight: bold;
    background: linear-gradient(135deg,#ff3c3c,#ff7b00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.donor-btn {
    display: block;
    width: 100%;
    text-align: center;
    padding: 18px;
    margin-top: 30px;
    font-weight: 700;
    font-size: 1.2rem;
    border-radius: 30px;
    text-decoration: none;
    background: linear-gradient(135deg,#ff3c3c,#ff7b00);
    color: #fff;
    transition: all 0.5s ease;
    box-shadow: 0 10px 30px rgba(255,60,60,0.5);
    position: relative;
    overflow: hidden;
}

.donor-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(255,60,60,0.8);
    color: #fff;
}

.donor-btn::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
}

.donor-btn:hover::before {
    transform: translateX(100%);
}

@keyframes fadeUp{
    from{opacity:0; transform:translateY(60px);}
    to{opacity:1; transform:translateY(0);}
}

/* Background (fixed) */
#particle-canvas, .background-animation {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
    .container { padding: 60px 15px 100px; }
    .tiers { gap: 30px; }
    .tier { padding: 40px 25px 35px; }
    .tier::before { font-size: 1rem; padding: 8px 30px; }
}
</style>
</head>
<body>

<!-- LOADING SCREEN -->
<div id="loader">
    <div class="loader-logo">MPM</div>
    <div class="loader-spinner"></div>
</div>

<!-- MAIN CONTENT (initially hidden) -->
<div class="main-content">
    <canvas id="particle-canvas"></canvas>

    <div class="background-animation">
      <div class="orb"></div>
      <div class="orb"></div>
      <div class="orb"></div>
    </div>

    <div class="container">
        <h1>Exclusive Donor Benefits</h1>

        <section class="tiers" id="tiers">
          <div class="tier" data-tier="Basic">
            <h2>Basic</h2>
            <div class="price">LKR 150 / Month</div>
            <ul>
              <li>MPM Gaming Telegram communities Direct Access.</li>
              <li>MPM Bot Group Access - ඔයාට direct links WhatsApp Documents විදියට ගන්න පුලුවන්. ඊට අමතරව තව ගොඩක් ගොඩක් වැඩ කරන්න පුලුවන්.</li>
              <li>Internet එකෙන් හොයාගන්න පුලුවන් අවශ්‍ය ඕනෑම movie එකක් series එකක් පැය 24ක් ඇතුලත WhatsApp හෝ අත්‍යවශ්‍ය නම් Telegram, upload කරදීම. (විශාල series සදහා වඩා වැඩි කාලයක් ගත ගතවිය හැක. ඒ වගේම විශාල series සදහා සීමා සහිතයි.)</li>
              <li>2 GB ට අඩු Softwares, Files WhatsApp හෝ Telegram upload කරදීම හෝ අවශ්‍ය නම් Direct Link එකක් ලබාදීම.</li>
              <li>Monthly Quota 50GB</li>
            </ul>
            <a href="https://wa.link/mwj2n8" class="donor-btn">Become Basic Donor</a>
          </div>

          <div class="tier" data-tier="Silver">
            <h2>Silver</h2>
            <div class="price">LKR 300 / Month</div>
            <ul>
              <li>Basic මට්ටමේ වාසි සියල්ල සමග</li>
              <li>FitGirl හා DODI sites දෙකේ පවතින අවශ්‍ය ඕනෑම game එකක් දින කිහිපයක් ඇතුලත WhatsApp හෝ අත්‍යවශ්‍ය නම් Telegram, upload කරදීම.</li>
              <li>ඔබට අවශ්‍ය telegram files සදහා දිගු කාලයක් online පවතින direct link එකක් පැය 24ක් ඇතුලත ලබාදීම.</li>
              <li>8 GB ට අඩු Softwares, Files WhatsApp හෝ Telegram upload කරදීම හෝ අවශ්‍ය නම් Direct Link එකක් ලබාදීම.</li>
              <li>Monthly Quota 100GB</li>
            </ul>
            <a href="https://wa.link/mwj2n8" class="donor-btn">Become Silver Donor</a>
          </div>

          <div class="tier" data-tier="Gold">
            <h2>Gold</h2>
            <div class="price">LKR 500 / Month</div>
            <ul>
              <li>Silver මට්ටමේ වාසි සියල්ල සමග</li>
              <li>Internet එකේ පවතින ඕනෑම file එකක් (NSFW දේවල් අදාල නොවේ.) WhatsApp හෝ අත්‍යවශ්‍ය නම් Telegram, upload කරදීම. (files පිලිබද වගකීමක් අපි දරන්නේ නැත.)</li>
              <li>ඔයාල Telegram එකෙන් එවන video files, size එක ගොඩක් අඩු වෙන විදියට encode කරල දෙනවා.</li>
              <li>Monthly Quota 200GB</li>
            </ul>
            <a href="https://wa.link/mwj2n8" class="donor-btn">Become Gold Donor</a>
          </div>

          <div class="tier" data-tier="Platinum">
            <h2>Platinum</h2>
            <div class="price">LKR 700 / Month</div>
            <ul>
              <li>Gold මට්ටමේ වාසි සියල්ල සමග</li>
              <li>ඔබට අවශ්‍ය ඕනෑම movie / series එකක සිංහල subtitles අප විසින් නිර්මාණය කරදීම. (විශාල series සදහා ගතවන කාලය වැඩි විය හැක.)</li>
              <li>තව මෙතන නැති ඒත් අපෙන් සේවාවක් විදියට ගන්න පුලුවන් දේවල් තියෙනවා කියල හිතනවනම් අපිට msg එකක් දාල ඒ ගැන අහන්න ඔයාලට පුලුවන්!</li>
              <li>Monthly Quota 300GB</li>
            </ul>
            <a href="https://wa.link/mwj2n8" class="donor-btn">Become Platinum Donor</a>
          </div>
        </section>
<a href="https://mpm-donor.free.nf/donors/login.php" class="donor-btn">Donor Login Portal</a>
    </div>
</div>

<script>
// Loading Animation + Particle System
const loader = document.getElementById('loader');
const mainContent = document.querySelector('.main-content');

window.addEventListener('load', () => {
    // Start particles first
    initParticles();

    // Hide loader and reveal content after a short delay
    setTimeout(() => {
        loader.classList.add('hidden');
        mainContent.classList.add('loaded');
    }, 800); // Adjust timing if needed
});

// Particle System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = window.innerWidth < 768 ? 50 : 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#ff3c3c' : '#ff7b00';
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
</script>

</body>
</html>