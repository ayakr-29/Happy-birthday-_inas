  const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let fireworks = [];
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// ==========================
// FIREWORK
// ==========================

class Firework {

    constructor() {

        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;

        this.targetX =
            50 + Math.random() * (canvas.width - 100);

        this.targetY =
            100 + Math.random() * (canvas.height * 0.42);

        this.speed = 6;

        const angle = Math.atan2(
            this.targetY - this.y,
            this.targetX - this.x
        );

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        this.color =
            `hsl(${Math.random() * 360}, 100%, 65%)`;

        this.trail = [];
        this.exploded = false;
    }

    update() {

        this.trail.push({
            x: this.x,
            y: this.y
        });

        if (this.trail.length > 7) {
            this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;

        const distance = Math.hypot(
            this.targetX - this.x,
            this.targetY - this.y
        );

        if (distance < 12) {

            this.explode();
            this.exploded = true;
        }
    }

    explode() {

        const amount = 55;

        for (let i = 0; i < amount; i++) {

            const angle =
                (Math.PI * 2 * i) / amount;

            const speed =
                Math.random() * 4 + 1.5;

            particles.push(
                new Particle(
                    this.x,
                    this.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    this.color
                )
            );
        }
    }

    draw() {

        // Rocket trail

        for (let i = 0; i < this.trail.length; i++) {

            const point = this.trail[i];

            ctx.globalAlpha =
                (i / this.trail.length) * 0.45;

            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                1.5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = this.color;
            ctx.fill();
        }

        ctx.globalAlpha = 1;

        // Rocket

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            2.2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ffffff";

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}


// ==========================
// PARTICLES
// ==========================

class Particle {

    constructor(x, y, vx, vy, color) {

        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.color = color;

        this.life = 1;

        this.size =
            Math.random() * 1.5 + 1;

        this.gravity = 0.045;
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.985;
        this.vy *= 0.985;

        this.vy += this.gravity;

        this.life -= 0.02;
    }

    draw() {

        ctx.globalAlpha = this.life;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;

        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.globalAlpha = 1;
    }
}


// ==========================
// CREATE FIREWORKS
// ==========================

function createFirework() {

    if (fireworks.length < 3) {
        fireworks.push(new Firework());
    }
}


// First firework

createFirework();


// New fireworks

setInterval(() => {

    createFirework();

}, 1100);


// ==========================
// ANIMATION
// ==========================

function animate() {

    requestAnimationFrame(animate);

    ctx.fillStyle =
        "rgba(3, 2, 11, 0.25)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Fireworks

    for (
        let i = fireworks.length - 1;
        i >= 0;
        i--
    ) {

        const firework = fireworks[i];

        firework.update();
        firework.draw();

        if (firework.exploded) {

            fireworks.splice(i, 1);
        }
    }


    // Particles

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const particle = particles[i];

        particle.update();
        particle.draw();

        if (particle.life <= 0) {

            particles.splice(i, 1);
        }
    }
}

animate();
