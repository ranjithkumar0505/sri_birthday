document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    // UPGRADE: Cinematic Canvas Particle System
    const canvas = document.getElementById('cursor-particles');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let particles = [];
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Subtly follow cursor with cinematic glowing orbs
    let mouse = { x: width/2, y: height/2 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
        if (Math.random() > 0.5) {
            particles.push({ 
                x: e.x, y: e.y, 
                size: Math.random() * 4 + 1, 
                speedX: (Math.random() - 0.5) * 1.5, 
                speedY: (Math.random() - 0.5) * 1.5 + 1, // drift downwards 
                life: 1,
                color: Math.random() > 0.5 ? '255, 255, 255' : '255, 107, 107'
            });
        }
    });

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${p.color}, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset for performance
            
            p.x += p.speedX; 
            p.y -= p.speedY; // float up slightly
            p.life -= 0.015;
            
            if (p.life <= 0) { particles.splice(i, 1); i--; }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    const bgMusic = document.getElementById('bg-music');
    const kuttyMusic = document.getElementById('kutty-music');
    
    // Core sections
    const cakeRoom = document.getElementById('cake-room-screen');
    const mainContent = document.getElementById('main-content');
    const riddleOverlay = document.getElementById('riddle-overlay');
    const kuttyLinesWrapper = document.getElementById('kutty-lines-wrapper');
    const giftGameScreen = document.getElementById('gift-game-screen');
    
    // Countdown Elements
    const countdownScreen = document.getElementById('countdown-screen');
    const skipCdBtn = document.getElementById('skip-countdown-btn');
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');
    
    // Cake Room Elements
    const initialBtn = document.getElementById('initial-btn');
    const blowBtn = document.getElementById('blow-btn');
    const wishText = document.getElementById('wish-text');
    const flame = document.getElementById('the-flame');
    const smoke = document.getElementById('the-smoke');
    const spotlight = document.querySelector('.spotlight');
    const festiveDecor = document.getElementById('festive-bg-decor');

    // Riddle Elements
    const openRiddleBtn = document.getElementById('open-riddle-btn');
    const pwdBoxes = document.querySelectorAll('.pwd-box');
    const checkRiddleBtn = document.getElementById('check-riddle-btn');
    const riddleError = document.getElementById('riddle-error');
    const riddleHintsContainer = document.getElementById('riddle-hints-container');
    const hintBoxes = document.querySelectorAll('.hint-box');
    let failCount = 0;

    // Gift Box Elements
    const exploreGiftsBtn = document.getElementById('explore-gifts-btn');
    const hitArea = document.getElementById('hit-box-area');
    const hammer = document.getElementById('premium-hammer');
    const giftEl = document.getElementById('premium-gift');
    const spark = document.getElementById('strike-spark');
    const giftZone = document.getElementById('gift-zone');
    const orbsScene = document.getElementById('orbs-scene');
    let hitCount = 0;

    // Polaroid Elements
    const polaroids = document.querySelectorAll('.polaroid');
    const videoOverlay = document.getElementById('video-overlay');
    const orbPlayer = document.getElementById('orb-player');
    const closeVideo = document.getElementById('close-video');
    const customPlayBtn = document.getElementById('custom-play-btn');
    const customPauseBtn = document.getElementById('custom-pause-btn');
    let watchedVideos = 0;
    let currentPlayingIndex = 1;

  // --- PHASE 0: COUNTDOWN TIMER ---
    // Target: July 9th 2026 at midnight
    const targetDate = new Date('July 9, 2026 00:00:00').getTime();
    
    let countdownTimer;

    function updateCountdown() {
        const currentTime = new Date().getTime();
        const distance = targetDate - currentTime;
        
        if (distance <= 0) {
            clearInterval(countdownTimer);
            transitionToCakeRoom();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        cdDays.innerText = days < 10 ? '0' + days : days;
        cdHours.innerText = hours < 10 ? '0' + hours : hours;
        cdMinutes.innerText = minutes < 10 ? '0' + minutes : minutes;
        cdSeconds.innerText = seconds < 10 ? '0' + seconds : seconds;
    }
    
    countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown();

    function transitionToCakeRoom() {
        gsap.to(countdownScreen, { opacity: 0, duration: 1, onComplete: () => {
            countdownScreen.style.display = 'none';
            cakeRoom.style.display = 'flex';
            gsap.fromTo(cakeRoom, { opacity: 0 }, { opacity: 1, duration: 1 });
        }});
    }

    if (skipCdBtn) {
        skipCdBtn.addEventListener('click', () => {
            clearInterval(countdownTimer);
            transitionToCakeRoom();
        });
    }

  // --- PHASE 1: CINEMATIC CAKE BLOW OUT & SPLIT ---
    initialBtn.addEventListener('click', () => {
        initialBtn.style.display = 'none';
        
        // 1. First blow
        gsap.to(flame, { x: "random(-5, 5)", y: "random(-5, 5)", duration: 0.1, repeat: 5, yoyo: true, onComplete: () => {
            gsap.to(flame, { scale: 0, opacity: 0, duration: 0.2 });
            gsap.to(smoke, { y: -100, scale: 3, opacity: 0, duration: 2, ease: "power1.out" });
            
            // 2. Make a wish text
            wishText.style.display = 'block';
            gsap.fromTo(wishText, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 1, delay: 0.5});
            
            // 3. Magic Relight
            setTimeout(() => {
                gsap.to(wishText, {opacity: 0, y: -20, duration: 1, onComplete: () => wishText.style.display = 'none'});
                
                // Relight flame
                gsap.set(flame, { scale: 0.1, opacity: 0 });
                gsap.to(flame, { scale: 1, opacity: 1, duration: 1, ease: "back.out(2)" });
                
                // Show Blow Now button
                blowBtn.style.display = 'inline-block';
                gsap.fromTo(blowBtn, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.5, delay: 1, ease: "back.out(1.5)"});
            }, 4000);
        }});
    });

    blowBtn.addEventListener('click', () => {
        // 4. Second blow out
        gsap.to(flame, { x: "random(-5, 5)", y: "random(-5, 5)", duration: 0.1, repeat: 5, yoyo: true, onComplete: () => {
            gsap.to(flame, { scale: 0, opacity: 0, duration: 0.2 });
            gsap.set(smoke, {y: 0, scale: 1, opacity: 1});
            gsap.to(smoke, { y: -100, scale: 3, opacity: 0, duration: 2, ease: "power1.out" });
            
            gsap.to(spotlight, { opacity: 0, duration: 0.5 });
            gsap.to(blowBtn, { opacity: 0, duration: 0.5 });
            gsap.to(festiveDecor, { opacity: 0, duration: 1.5 });

            // 5. Knife Drop
            setTimeout(() => {
                const knife = document.createElement('div');
                knife.className = 'knife-cut';
                knife.innerHTML = '🔪';
                knife.style.position = 'absolute';
                knife.style.top = '-100px';
                knife.style.left = '50%';
                knife.style.transform = 'translateX(-50%) rotate(180deg)';
                knife.style.fontSize = '4rem';
                knife.style.zIndex = '20';
                knife.style.textShadow = '0 10px 20px rgba(0,0,0,0.5)';
                document.querySelector('.cake-wrapper').appendChild(knife);
                
                // 6. Split Halves
                gsap.to(knife, { top: "80px", duration: 0.5, ease: "power2.in", onComplete: () => {
                    document.querySelector('.candle').style.display = 'none';
                    gsap.to(knife, { opacity: 0, duration: 0.3 });
                    
                    gsap.to(".cake-half-left", { x: -300, rotation: -15, opacity: 0, duration: 1.5, ease: "power2.out" });
                    gsap.to(".cake-half-right", { x: 300, rotation: 15, opacity: 0, duration: 1.5, ease: "power2.out" });
                    
                    gsap.to(cakeRoom, { opacity: 0, duration: 1.5, delay: 0.5, onComplete: () => {
                        cakeRoom.style.display = 'none';
                    }});
                    
                    startMainContent();
                }});
            }, 800);
        }});
    });

 // --- PHASE 2: MAIN CONTENT SETUP ---
    function startMainContent() {
        bgMusic.play().catch(e => console.log(e));
        document.documentElement.style.overflowY = 'auto';
        document.body.style.overflowY = 'auto'; 
        mainContent.style.display = 'block';
        
        const heroTl = gsap.timeline();
        heroTl.to(mainContent, { opacity: 1, duration: 0.5 })
              .fromTo(".hero-sub-heading", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.2")
              .fromTo(".main-heading", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.5)" }, "-=0.6")
              .to(".hero-image-wrapper", { scale: 1, duration: 1.5, ease: "power3.out" }, "-=1");

        setTimeout(() => {
            gsap.fromTo(".lyrics-text", { y: 50, opacity: 0 }, { scrollTrigger: { trigger: ".lyrics-gallery-section", start: "top 75%" }, y: 0, opacity: 1, duration: 1.2, ease: "power2.out" });
            
            const galleryTl = gsap.timeline({ scrollTrigger: { trigger: ".gallery-container", start: "top 95%", end: "center center", scrub: 1 }});
            
            galleryTl.from(".img1", { x: -600, y: 0, rotation: -60, opacity: 0 }, 0)
                     .from(".img2", { x: 0, y: -600, rotation: 60, opacity: 0 }, 0)
                     .from(".img3", { x: 600, y: 0, rotation: 60, opacity: 0 }, 0)
                     .from(".img4", { x: 0, y: 600, rotation: -60, opacity: 0 }, 0)
                     .from(".img5", { scale: 0, rotation: 180, opacity: 0 }, 0);

            gsap.set(".flip-card", { x: 0, y: 400, rotation: 0, scale: 0.8, opacity: 0 });
            gsap.to(".flip-card", {
                scrollTrigger: { trigger: ".flip-cards-section", start: "top 80%", end: "center center", scrub: 1 },
                x: (i) => [-420, -140, 140, 420][i], y: (i) => [0, -30, -30, 0][i], rotation: (i) => [-22, -8, 8, 22][i],
                scale: 1, opacity: 1, ease: "power1.out"
            });
            ScrollTrigger.refresh();
        }, 100);
    }

    // --- PHASE 3: THE RIDDLE ---
    openRiddleBtn.addEventListener('click', () => {
        riddleOverlay.style.display = 'flex';
        document.body.style.overflowY = 'hidden';
        gsap.fromTo(".riddle-content", {y: 50, scale: 0.9, opacity: 0}, {y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)"});
        pwdBoxes[0].focus();
    });

    pwdBoxes.forEach((box, index) => {
        box.addEventListener('input', function() {
            if(this.value.length === 1 && index < pwdBoxes.length - 1) { pwdBoxes[index + 1].focus(); }
        });
        box.addEventListener('keydown', function(e) {
            if(e.key === 'Backspace' && this.value.length === 0 && index > 0) { pwdBoxes[index - 1].focus(); }
        });
    });

    hintBoxes.forEach(box => {
        box.addEventListener('click', function() {
            if (this.classList.contains('wrapped')) {
                const hintText = this.getAttribute('data-hint');
                this.querySelector('.hint-back').innerText = hintText;
                this.classList.remove('wrapped');
                this.classList.add('unwrapped');
            }
        });
    });

    checkRiddleBtn.addEventListener('click', () => {
        let attempt = "";
        pwdBoxes.forEach(box => attempt += box.value);
        attempt = attempt.toLowerCase();

        if (attempt === "thango") {
            riddleError.style.opacity = 0;
            
            // GSAP BUG FIX: Ensure kuttyLinesWrapper layout is calculated properly before ScrollTrigger sets up
            gsap.to([riddleOverlay, '#main-content'], {opacity: 0, duration: 1, ease: "power2.inOut", onComplete: () => {
                riddleOverlay.style.display = 'none';
                document.getElementById('main-content').style.display = 'none';
                
                kuttyLinesWrapper.style.display = 'block';
                kuttyLinesWrapper.style.opacity = '1';
                document.body.style.overflowY = 'auto';
                document.documentElement.style.overflowY = 'auto';
                
                // Ensure layout and repaint is fully complete
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    setupKuttyLines();
                }, 100);
            }});
        } else {
            failCount++;
            
            pwdBoxes.forEach(box => box.value = "");
            pwdBoxes[0].focus();

            riddleError.innerText = "Thappu nala yosi 😤🔪";
            riddleError.style.opacity = 1;
            
            gsap.fromTo(".riddle-content", 
                {x: -15}, 
                {x: 15, duration: 0.08, yoyo: true, repeat: 5, ease: "power1.inOut", onComplete: () => gsap.to(".riddle-content", {x: 0, duration: 0.1})}
            );
            gsap.to(pwdBoxes, { borderColor: "#d63031", boxShadow: "0 0 15px rgba(214, 48, 49, 0.6)", duration: 0.2, yoyo: true, repeat: 3, onComplete: () => {
                gsap.to(pwdBoxes, { borderColor: "rgba(255,255,255,0.6)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)", duration: 0.2 });
            }});
            
            if (failCount >= 3) {
                riddleHintsContainer.style.display = 'block';
                gsap.fromTo(riddleHintsContainer, {opacity: 0}, {opacity: 1, duration: 0.2});
                gsap.fromTo(hintBoxes, 
                    {opacity: 0, scale: 0.5, rotationY: -90}, 
                    {opacity: 1, scale: 1, rotationY: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)"}
                );
            }
        }
    });

 // --- PHASE 4: SCROLL-TELLING SETUP (WITH PREMIUM 3D FLIP) ---
    function setupKuttyLines() {
        const exploreSection = document.querySelector('.explore-gifts-section');
        const images = document.querySelectorAll('.st-img-wrapper');
        const lyrics = document.querySelectorAll('.st-lyric');
        
        let isKuttyMusicFinished = false; // Flag to prevent replay
        
        // Initial state
        gsap.set('.kutty-title', { autoAlpha: 1, y: 0 });
        
        // Hide all lyrics and images initially. Set lyrics to faded gray.
        gsap.set(images, { autoAlpha: 0, rotationY: -90 });
        gsap.set(lyrics, { autoAlpha: 0, y: 50, color: "rgba(30, 39, 46, 0.3)" });

        // Show the first set right away
        gsap.set(images[0], { autoAlpha: 1, rotationY: 0 });
        gsap.set(lyrics[0], { autoAlpha: 1, y: 0, color: "rgba(30, 39, 46, 0.3)" }); // Faded initially

        // Apply karaoke class
        lyrics.forEach(l => l.classList.add('karaoke-reveal'));

        // CRITICAL BUG FIX: Ensure DOM is perfectly painted before initializing pinning
        requestAnimationFrame(() => {
            setTimeout(() => {
                ScrollTrigger.refresh(true);

                const stTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#kutty-lines", 
                        start: "top top", 
                        end: "+=6000", // extended for Phase 4.5
                        pin: true, 
                        scrub: 1,
                        onEnter: () => { 
                            if(!isKuttyMusicFinished) {
                                gsap.to(bgMusic, {volume: 0, duration: 1}); 
                                kuttyMusic.currentTime = 97; // Exactly 00:01:37
                                kuttyMusic.volume = 0; 
                                kuttyMusic.play(); 
                                gsap.to(kuttyMusic, {volume: 1, duration: 1.5}); 
                            }
                        },
                        onUpdate: () => {
                            // Stop exactly at 142s (02:22) and permanently lock
                            if (!isKuttyMusicFinished && kuttyMusic.currentTime >= 142) { 
                                isKuttyMusicFinished = true;
                                gsap.to(kuttyMusic, { volume: 0, duration: 1, onComplete: () => kuttyMusic.pause() });
                            }
                        },
                        onLeave: () => {
                            if(!isKuttyMusicFinished) gsap.to(kuttyMusic, {volume: 0, duration: 1, onComplete: ()=>kuttyMusic.pause()});
                        },
                        onLeaveBack: () => {
                            if(!isKuttyMusicFinished) gsap.to(kuttyMusic, {volume: 0, duration: 1, onComplete: ()=>kuttyMusic.pause()});
                        }
                        // Note: onEnterBack removed entirely as requested.
                    }
                });

                // Highlight first lyric (Premium Karaoke background-clip reveal)
                stTl.to(lyrics[0], { backgroundPosition: "0% 0", duration: 1.5, ease: "power1.inOut" }, "+=0.2");
                stTl.to({}, { duration: 1 }); // Pause for reading

                // 4 Sets of Flip Animations
                for (let i = 0; i < 3; i++) {
                    // Transition OUT current image/lyric
                    stTl.to(images[i], { rotationY: 90, autoAlpha: 0, duration: 1, ease: "power2.in" }, `stage${i}`);
                    stTl.to(lyrics[i], { y: -50, autoAlpha: 0, duration: 1, ease: "power2.in" }, `stage${i}`);
                    
                    // Transition IN next image/lyric
                    stTl.to(images[i+1], { rotationY: 0, autoAlpha: 1, duration: 1, ease: "power2.out" }, `stage${i}+=0.5`);
                    stTl.to(lyrics[i+1], { y: 0, autoAlpha: 1, duration: 1, ease: "power2.out" }, `stage${i}+=0.5`);
                    
                    // Highlight new lyric (Premium Karaoke background-clip reveal)
                    stTl.to(lyrics[i+1], { backgroundPosition: "0% 0", duration: 1.5, ease: "power1.inOut" });
                    
                    // Pause for reading
                    stTl.to({}, { duration: 1 });
                }

                // Phase 4.5: Video Reveal
                stTl.to('.kutty-title', { autoAlpha: 0, duration: 0.8 }, "end");
                stTl.to(lyrics[3], { autoAlpha: 0, y: -50, duration: 0.8 }, "end");
                stTl.to(images[3], { rotationY: 90, autoAlpha: 0, duration: 0.8 }, "end");
                
                // Show new reveal section
                stTl.to(exploreSection, { opacity: 1, onStart: () => exploreSection.classList.add('active'), duration: 1.5 }, "end+=0.5");
                
            }, 100);
        });
    }

    // --- PHASE 5: GIFT EXPLORE BUTTON ---
    exploreGiftsBtn.addEventListener('click', () => {
        bgMusic.pause(); bgMusic.currentTime = 0;
        kuttyMusic.pause(); kuttyMusic.currentTime = 0;
        
        mainContent.style.display = 'none'; 
        kuttyLinesWrapper.style.display = 'none';
        giftGameScreen.style.display = 'flex'; 
        document.body.style.overflowY = 'hidden';
        gsap.to(giftGameScreen, {opacity: 1, duration: 1});
        setupPhysics();
    });

    // --- PHASE 6: PHYSICS GAME & POLAROIDS ---
    function setupPhysics() {
        const engine = Matter.Engine.create();
        const hitAreaRect = hitArea.getBoundingClientRect();
        const boxSize = 250; 
        const startX = hitAreaRect.width / 2; 
        const startY = hitAreaRect.height / 2;
        
        const giftBody = Matter.Bodies.rectangle(startX, startY, boxSize, boxSize, { restitution: 0.2, frictionAir: 0.05, density: 0.01 });
        const anchor = Matter.Constraint.create({ pointA: { x: startX, y: startY + 50 }, bodyB: giftBody, pointB: { x: 0, y: 50 }, stiffness: 0.15, damping: 0.05 });

        Matter.Composite.add(engine.world, [giftBody, anchor]);
        Matter.Runner.run(engine);

        Matter.Events.on(engine, 'afterUpdate', () => {
            const x = giftBody.position.x - startX;
            const y = giftBody.position.y - startY;
            const angle = giftBody.angle;
            // CRITICAL: Preserve translateX(-50%) while applying physics offsets
            giftEl.style.transform = `translate(calc(-50% + ${x}px), ${y}px) rotate(${angle}rad)`;
        });

        hitArea.addEventListener('mousemove', (e) => {
            const rect = hitArea.getBoundingClientRect();
            const x = e.clientX - rect.left - 15; 
            const y = e.clientY - rect.top - 20;
            gsap.to(hammer, { x: x, y: y, duration: 0.1, ease: "power1.out" });
            
            // 3D Gift Tracking
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = (e.clientY - rect.top - centerY) / 10;
            const tiltY = -(e.clientX - rect.left - centerX) / 10;
            gsap.to(giftEl, { rotationX: tiltX, rotationY: tiltY, duration: 0.5 });
        });

       hitArea.addEventListener('click', (e) => {
            if (hitCount >= 3) return; 
            hitCount++;
            
            if (navigator.vibrate) navigator.vibrate(50);

            const rect = hitArea.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Aggressive Camera Shake
            gsap.fromTo(document.body, { x: -10, y: 5 }, { x: 0, y: 0, duration: 0.4, ease: "rough({strength: 2, points: 20})" });

            gsap.to(hammer, { rotation: -70, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.in" });
            gsap.set(spark, { top: clickY, left: clickX, scale: 0, opacity: 1 });
            gsap.to(spark, { scale: hitCount === 3 ? 8 : 4, opacity: 0, duration: 0.4, ease: "power3.out" });

            if (hitCount === 1) {
                Matter.Body.applyForce(giftBody, { x: startX + 100, y: startY - 100 }, { x: -0.5, y: 0.8 });
                giftEl.classList.add('glow-stage-1');
            } else if (hitCount === 2) {
                Matter.Body.applyForce(giftBody, { x: startX - 100, y: startY - 100 }, { x: 0.9, y: 1.2 });
                giftEl.classList.replace('glow-stage-1', 'glow-stage-2');
            } else if (hitCount === 3) {
                Matter.Composite.remove(engine.world, anchor);
                Matter.Body.applyForce(giftBody, { x: startX, y: startY }, { x: (Math.random() - 0.5) * 2, y: -4.5 });
                giftBody.torque = (Math.random() - 0.5) * 3; 
                
                // Cinematic White Flash Transition
                const flash = document.getElementById('cinematic-flash');
                flash.style.display = 'block';
                gsap.to(flash, { opacity: 1, duration: 0.3, onComplete: () => {
                    revealPolaroids();
                    gsap.to(flash, { opacity: 0, duration: 1.5, delay: 0.5, onComplete: () => flash.style.display = 'none' });
                }});
            }
        });
    }

    function revealPolaroids() {
        confetti({ particleCount: 250, spread: 140, origin: { y: 0.5 }, colors: ['#FF1493', '#FF6B6B', '#FFD1DC', '#ffffff', '#e84393'] });
        
        // Start Heart Particles
        const hCanvas = document.getElementById('heart-particles-canvas');
        const hCtx = hCanvas.getContext('2d');
        hCanvas.width = window.innerWidth;
        hCanvas.height = window.innerHeight;
        const hearts = [];
        for(let i=0; i<30; i++) hearts.push({ x: Math.random() * hCanvas.width, y: Math.random() * hCanvas.height, size: Math.random() * 3 + 1, speedY: Math.random() * 1 + 0.5 });
        function drawHearts() {
            hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
            hCtx.fillStyle = 'rgba(255, 154, 158, 0.6)';
            hearts.forEach(h => {
                hCtx.beginPath();
                hCtx.arc(h.x, h.y, h.size, 0, Math.PI*2);
                hCtx.fill();
                h.y -= h.speedY;
                if(h.y < 0) h.y = hCanvas.height;
            });
            requestAnimationFrame(drawHearts);
        }
        drawHearts();
        
        gsap.to(hammer, { opacity: 0, duration: 0.1 });
        gsap.to(giftEl, { opacity: 0, duration: 0.4 });
        gsap.to(['#gift-title', '#gift-hint'], { opacity: 0, duration: 0.4 });
        
        setTimeout(() => {
            giftZone.style.display = 'none';
            orbsScene.style.display = 'flex';
            gsap.to('.orb-title', { opacity: 1, duration: 1.5 });
            gsap.to(polaroids, { y: 0, opacity: 1, duration: 1.5, stagger: 0.3, ease: "back.out(1.2)" });
        }, 800);
    }

    const videoProgress = document.getElementById('video-progress');

    let ytPlayer;
    let progressInterval;

    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('orb-player', {
            height: '100%',
            width: '100%',
            playerVars: {
                'controls': 0,
                'disablekb': 1,
                'rel': 0,
                'modestbranding': 1,
                'showinfo': 0,
                'iv_load_policy': 3,
                'origin': window.location.origin
            },
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function startProgressInterval() {
        clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (ytPlayer && ytPlayer.getCurrentTime && ytPlayer.getDuration) {
                const duration = ytPlayer.getDuration();
                if (duration > 0) {
                    const percentage = (ytPlayer.getCurrentTime() / duration) * 100;
                    videoProgress.style.width = percentage + '%';
                }
            }
        }, 100);
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            startProgressInterval();
            customPlayBtn.style.display = 'none';
            customPauseBtn.style.display = 'flex';
        } else {
            clearInterval(progressInterval);
            if (event.data == YT.PlayerState.PAUSED) {
                customPauseBtn.style.display = 'none';
                customPlayBtn.style.display = 'flex';
            } else if (event.data == YT.PlayerState.ENDED) {
                gsap.to(videoOverlay, { opacity: 0, duration: 1, delay: 0.5, onComplete: () => {
                    videoOverlay.style.display = 'none';
                    videoProgress.style.width = '0%';
                    
                    // Sequential Unlock Animation
                    const currentPolaroid = document.getElementById(`vid-card-${currentPlayingIndex}`);
                    currentPolaroid.classList.add('watched');
                    
                    if (currentPlayingIndex < 4) {
                        const nextPolaroid = document.getElementById(`vid-card-${currentPlayingIndex + 1}`);
                        nextPolaroid.classList.remove('locked');
                        nextPolaroid.classList.add('unlocked');
                        
                        // Fancy Unlock Animation
                        const lockIcon = nextPolaroid.querySelector('.lock-icon');
                        gsap.to(lockIcon, { opacity: 0, scale: 0, duration: 0.5, ease: "back.in(1.5)" });
                        gsap.fromTo(nextPolaroid, 
                            { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }, 
                            { scale: 1.05, boxShadow: "0 0 40px rgba(255, 118, 117, 0.8)", duration: 0.5, yoyo: true, repeat: 1, ease: "power2.out" }
                        );
                    }
                }});
            }
        }
    }
    // POLAROID INTERACTION LOGIC
    polaroids.forEach(polaroid => {
        polaroid.addEventListener('click', function() {
            if (this.classList.contains('locked')) return; 

            const videoId = this.getAttribute('data-video');
            currentPlayingIndex = parseInt(this.getAttribute('data-index'));

            // Load the video into the YouTube player
            if (window.ytPlayer && window.ytPlayer.loadVideoById) {
                window.ytPlayer.loadVideoById(videoId);
                window.ytPlayer.pauseVideo();
            }

            videoOverlay.style.display = 'flex';
            gsap.to(videoOverlay, { opacity: 1, duration: 0.5 });
            
            customPlayBtn.style.display = 'flex';
            customPauseBtn.style.display = 'none';
            videoProgress.style.width = '0%';
        });
    });

    closeVideo.addEventListener('click', () => {
        if (window.ytPlayer && window.ytPlayer.pauseVideo) window.ytPlayer.pauseVideo();
        clearInterval(progressInterval);
        gsap.to(videoOverlay, { opacity: 0, duration: 0.5, onComplete: () => {
            videoOverlay.style.display = 'none';
            videoProgress.style.width = '0%';
        }});
    });

    customPlayBtn.addEventListener('click', () => {
        if (window.ytPlayer && window.ytPlayer.playVideo) window.ytPlayer.playVideo();
    });

    customPauseBtn.addEventListener('click', () => {
        if (window.ytPlayer && window.ytPlayer.pauseVideo) window.ytPlayer.pauseVideo();
    });

}); // <-- THIS BRACE CLOSES YOUR DOMContentLoaded EVENT

// === YOUTUBE API SETUP (MUST BE OUTSIDE THE MAIN WRAPPER) ===
window.ytPlayer = null;

function onYouTubeIframeAPIReady() {
    window.ytPlayer = new YT.Player('orb-player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'controls': 0, // Hides default YouTube controls so your custom ones show
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'playsinline': 1,
            'origin': window.location.origin
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    // When video plays: hide play button, show pause button, start progress bar
    if (event.data == YT.PlayerState.PLAYING) {
        document.getElementById('custom-play-btn').style.display = 'none';
        document.getElementById('custom-pause-btn').style.display = 'flex';
        
        progressInterval = setInterval(() => {
            if(window.ytPlayer && window.ytPlayer.getCurrentTime) {
                const percentage = (window.ytPlayer.getCurrentTime() / window.ytPlayer.getDuration()) * 100;
                document.getElementById('video-progress').style.width = percentage + '%';
            }
        }, 100);
    } 
    // When video pauses: show play button, hide pause button
    else if (event.data == YT.PlayerState.PAUSED) {
        document.getElementById('custom-pause-btn').style.display = 'none';
        document.getElementById('custom-play-btn').style.display = 'flex';
        clearInterval(progressInterval);
    }
    // When video ends: trigger the next polaroid unlock animation
    else if (event.data == YT.PlayerState.ENDED) {
        clearInterval(progressInterval);
        document.getElementById('custom-pause-btn').style.display = 'none';
        document.getElementById('custom-play-btn').style.display = 'flex';
        
        const videoOverlay = document.getElementById('video-overlay');
        gsap.to(videoOverlay, { opacity: 0, duration: 1, delay: 0.5, onComplete: () => {
            videoOverlay.style.display = 'none';
            document.getElementById('video-progress').style.width = '0%';
            
            const currentPolaroid = document.getElementById(`vid-card-${currentPlayingIndex}`);
            if(currentPolaroid) currentPolaroid.classList.add('watched');
            
            if (currentPlayingIndex < 4) {
                const nextPolaroid = document.getElementById(`vid-card-${currentPlayingIndex + 1}`);
                if (nextPolaroid) {
                    nextPolaroid.classList.remove('locked');
                    nextPolaroid.classList.add('unlocked');
                    
                    const lockIcon = nextPolaroid.querySelector('.lock-icon');
                    gsap.to(lockIcon, { opacity: 0, scale: 0, duration: 0.5, ease: "back.in(1.5)" });
                    gsap.fromTo(nextPolaroid, 
                        { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }, 
                        { scale: 1.05, boxShadow: "0 0 40px rgba(0, 184, 148, 0.8)", duration: 0.5, yoyo: true, repeat: 1, ease: "power2.out" }
                    );
                }
            }
        }});
    }
}
