
document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    // ==========================================
    // 1. ANIMATED STAR BACKGROUND
    // ==========================================

    const starsContainer = $("#stars");

    if (starsContainer) {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement("span");

            star.className = "star";
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${2 + Math.random() * 4}s`;

            starsContainer.appendChild(star);
        }
    }

    // ==========================================
    // 2. HERO SURPRISE
    // ==========================================

    const surpriseButton = $("#surpriseButton");
    const birthdaySection = $("#birthday");

    if (surpriseButton && birthdaySection) {
        surpriseButton.addEventListener("click", () => {
            birthdaySection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            launchConfetti(65);
            launchParticles(window.innerWidth / 2, 120, 16);
        });
    }

    // ==========================================
    // 3. BIRTHDAY MESSAGE
    // ==========================================

    const revealButton = $("#revealButton");
    const birthdayMessage = $("#birthdayMessage");

    if (revealButton && birthdayMessage) {
        revealButton.addEventListener("click", () => {
            const isVisible = birthdayMessage.classList.toggle("show");

            revealButton.textContent = isVisible
                ? "HIDE MESSAGE"
                : "REVEAL YOUR MESSAGE";

            if (isVisible) {
                launchConfetti(35);
            }
        });
    }

    // ==========================================
    // 4. INTERACTIVE BIRTHDAY CAKE
    // ==========================================

    const cake = $(".cake");
    const candles = $$(".candle");
    const cakeMessage = $("#cakeMessage");

    let cakeFinished = false;
    let cakeTaps = 0;

    if (cake) {
        // Allow keyboard users to interact with the cake too.
        cake.setAttribute("tabindex", "0");
        cake.setAttribute("role", "button");
        cake.setAttribute(
            "aria-label",
            "Tap the birthday cake for a surprise"
        );

        cake.addEventListener("click", (event) => {
            // Clicking a candle should only blow out that candle.
            if (event.target.closest(".candle")) return;

            if (cakeFinished) {
                launchParticlesFromElement(cake, 12);
                return;
            }

            cakeTaps++;

            // Restart the bounce animation on every tap.
            cake.classList.remove("bounce");
            void cake.offsetWidth;
            cake.classList.add("bounce");

            launchParticlesFromElement(cake, 10);

            if (cakeMessage) {
                const messages = [
                    "Hehe, the cake likes attention too! 💗",
                    "A little more birthday magic! ✨",
                    "Make a wish, Zizi! 🎂",
                    "Tap the candles when you're ready! 💜"
                ];

                cakeMessage.textContent =
                    messages[(cakeTaps - 1) % messages.length];
            }

            window.setTimeout(() => {
                cake.classList.remove("bounce");
            }, 700);
        });

        cake.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                cake.click();
            }
        });
    }

    candles.forEach((candle, index) => {
        candle.addEventListener("click", (event) => {
            event.stopPropagation();

            // Don't let a blown-out candle be clicked twice.
            if (candle.classList.contains("blown") || cakeFinished) {
                return;
            }

            candle.classList.add("blown");
            candle.setAttribute("aria-label", `Candle ${index + 1} blown out`);

            // A little smoke and sparkles where the flame was.
            launchParticlesFromElement(candle, 7);

            const remaining = $$(".candle:not(.blown)").length;

            if (remaining > 0) {
                if (cakeMessage) {
                    cakeMessage.textContent =
                        remaining === 1
                            ? "One last candle! Make your final wish, Zizi! 💗"
                            : `${remaining} candles left! Keep making wishes, Zizi! ✨`;
                }

                return;
            }

            // ======================================
            // ALL CANDLES ARE OUT: BIRTHDAY FINALE
            // ======================================

            cakeFinished = true;

            if (cake) {
                cake.classList.add("celebrating");
            }

            if (cakeMessage) {
                cakeMessage.textContent =
                    "გილოცავ დაბადების დღეს, ზიზი 💗 მინდა, რომ სულ ბედნიერი იყო და ყველა შენი სურვილი აგსრულებოდეს ✨";

                cakeMessage.classList.add("final-message");
                cakeMessage.setAttribute("aria-live", "assertive");
            }

            launchConfetti(150);

            // Multiple bursts of floating hearts and sparkles.
            launchParticlesFromElement(cake || candle, 35);

            window.setTimeout(() => {
                launchParticles(window.innerWidth * 0.25, window.innerHeight * 0.6, 16);
                launchParticles(window.innerWidth * 0.75, window.innerHeight * 0.6, 16);
            }, 350);

            // Reveal the birthday message elsewhere on the page too.
            if (birthdayMessage) {
                birthdayMessage.classList.add("show");
            }
        });
    });

    // ==========================================
    // 5. PERSONAL LETTER
    // ==========================================

    const letterButton = $("#letterButton");
    const letterContent = $("#letterContent");

    if (letterButton && letterContent) {
        letterButton.addEventListener("click", () => {
            const isVisible = letterContent.classList.toggle("show");

            letterButton.textContent = isVisible
                ? "CLOSE LETTER"
                : "OPEN YOUR LETTER";

            if (isVisible) {
                letterContent.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }
        });
    }

    // ==========================================
    // 6. SECRET MESSAGE
    // ==========================================

    const secretButton = $("#secretButton");
    const secretMessage = $("#secretMessage");

    if (secretButton && secretMessage) {
        secretButton.addEventListener("click", () => {
            const isVisible = secretMessage.classList.toggle("show");

            secretButton.textContent = isVisible
                ? "LOCK THE SECRET"
                : "UNLOCK YOUR SECRET";

            if (isVisible) {
                launchConfetti(45);
                launchParticlesFromElement(secretButton, 16);
            }
        });
    }

    // ==========================================
    // 7. BACKGROUND MUSIC
    // ==========================================

    const musicButton = $("#musicButton");
    const music = $("#music");

    if (musicButton && music) {
        musicButton.addEventListener("click", async () => {
            if (music.paused) {
                try {
                    await music.play();
                    musicButton.textContent = "♫ MUSIC ON";
                } catch (error) {
                    musicButton.textContent = "MUSIC UNAVAILABLE";
                    console.warn(
                        "Music could not play. Check birthday.mp3:",
                        error
                    );
                }
            } else {
                music.pause();
                musicButton.textContent = "♫ MUSIC OFF";
            }
        });

        music.addEventListener("pause", () => {
            musicButton.textContent = "♫ MUSIC OFF";
        });

        music.addEventListener("play", () => {
            musicButton.textContent = "♫ MUSIC ON";
        });
    }

    // ==========================================
    // 8. FLOATING HEARTS AND SPARKLES
    // ==========================================

    function launchParticles(x, y, amount = 12) {
        const symbols = ["💗", "💖", "💕", "✨", "✦", "✧", "💜"];

        for (let i = 0; i < amount; i++) {
            const particle = document.createElement("span");

            const isHeart = Math.random() > 0.48;

            particle.className =
                "birthday-particle " + (isHeart ? "heart" : "sparkle");

            particle.textContent = isHeart
                ? symbols[Math.floor(Math.random() * 3)]
                : symbols[3 + Math.floor(Math.random() * 3)];

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            particle.style.setProperty(
                "--size",
                `${14 + Math.random() * 17}px`
            );

            particle.style.setProperty(
                "--duration",
                `${1.1 + Math.random() * 1.1}s`
            );

            particle.style.setProperty(
                "--drift",
                `${(Math.random() - 0.5) * 200}px`
            );

            particle.style.setProperty(
                "--rise",
                `${-70 - Math.random() * 180}px`
            );

            particle.style.setProperty(
                "--spin",
                `${(Math.random() - 0.5) * 100}deg`
            );

            document.body.appendChild(particle);

            window.setTimeout(() => particle.remove(), 2600);
        }
    }

    function launchParticlesFromElement(element, amount = 12) {
        const rect = element.getBoundingClientRect();

        launchParticles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            amount
        );
    }

    // ==========================================
    // 9. CONFETTI
    // ==========================================

    function launchConfetti(amount = 60) {
        const colors = [
            "#c4b5fd",
            "#f0abfc",
            "#a5b4fc",
            "#ffffff",
            "#f9a8d4",
            "#fde68a"
        ];

        for (let i = 0; i < amount; i++) {
            const piece = document.createElement("div");

            piece.className = "confetti";
            piece.style.left = `${Math.random() * 100}vw`;

            piece.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];

            piece.style.animationDuration =
                `${2 + Math.random() * 3}s`;

            piece.style.animationDelay =
                `${Math.random() * 0.6}s`;

            piece.style.borderRadius =
                Math.random() > 0.5 ? "50%" : "2px";

            document.body.appendChild(piece);

            window.setTimeout(() => piece.remove(), 6000);
        }
    }

    // ==========================================
    // 10. LOGO RETURNS TO THE TOP
    // ==========================================

    const logo = $(".logo");

    if (logo) {
        logo.addEventListener("click", (event) => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    console.log("✨ Zizi's interactive birthday website is ready!");
});
