(function() {
    // 1. Inject CSS for the banner and animations
    const styles = `
        .avurudu-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(to right, #c62828, #f57f17, #2e7d32); /* Traditional Red, Gold, Green */
            color: #ffffff;
            text-align: center;
            padding: 12px 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 16px;
            font-weight: 600;
            z-index: 99999;
            box-shadow: 0 -4px 15px rgba(0,0,0,0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 25px;
            flex-wrap: wrap;
        }
        .avurudu-greeting {
            display: flex;
            align-items: center;
            gap: 8px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        .close-avurudu-banner {
            cursor: pointer;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.4);
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            margin-left: auto;
            font-size: 14px;
            transition: background 0.3s ease;
        }
        .close-avurudu-banner:hover {
            background: rgba(255,255,255,0.4);
        }
        .avurudu-particle {
            position: fixed;
            top: -10%;
            z-index: 99998;
            user-select: none;
            pointer-events: none;
            animation: fall linear forwards;
        }
        @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @media (max-width: 768px) {
            .avurudu-banner {
                font-size: 14px;
                gap: 10px;
                flex-direction: column;
                padding-bottom: 20px;
            }
            .close-avurudu-banner {
                position: absolute;
                top: 5px;
                right: 10px;
            }
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. Create and Append the Banner
    const banner = document.createElement("div");
    banner.className = "avurudu-banner";
    banner.innerHTML = `
        <span class="avurudu-greeting">☀️ සුබ අලුත් අවුරුද්දක් වේවා!</span>
        <span class="avurudu-greeting">இனிய புத்தாண்டு நல்வாழ்த்துக்கள்! 🧨</span>
        <span class="avurudu-greeting">Happy Sinhala & Tamil New Year! 🪔</span>
        <button class="close-avurudu-banner" id="closeAvuruduBanner">✕ Close</button>
    `;
    document.body.appendChild(banner);

    // Add close functionality
    document.getElementById("closeAvuruduBanner").addEventListener("click", function() {
        banner.remove();
        clearInterval(particleInterval); // Stop particles when closed
    });

    // 3. Falling Particles (Erabadu Flowers and Sparkles)
    function createParticle() {
        const particle = document.createElement("div");
        particle.className = "avurudu-particle";
        
        // Randomly choose between a flower or a sparkle
        const elements = ["🌸", "✨", "☀️"];
        particle.innerHTML = elements[Math.floor(Math.random() * elements.length)];
        
        // Randomize position, size, and falling speed
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.fontSize = (Math.random() * 1.2 + 0.8) + "rem";
        particle.style.animationDuration = (Math.random() * 4 + 4) + "s"; // 4 to 8 seconds
        
        document.body.appendChild(particle);

        // Remove the particle from the DOM once it falls off screen to save memory
        setTimeout(() => {
            if (document.body.contains(particle)) {
                particle.remove();
            }
        }, 8000); 
    }

    // Generate a particle every 600 milliseconds
    const particleInterval = setInterval(createParticle, 600);
})();