/** @type {HTMLCanvasElement} */
/*
 *  +++ PNG DIMENSION +++
 *  ./media/images/berd.png:    1308x177 | 218 WDITH per frame (6)
 *  ./media/images/bet.png:     1758x155 | 293 WIDTH per frame (6)
 *  ./media/images/betside.png: 1596x188 | 266 WIDTH per frame (6)
 *  ./media/images/raven.png:   1626x194 | 271 WIDTH per frame (6)
 *  ./media/images/spikeball    1917x212 | 213 WIDTH per frame (9)
*/

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
//lets canvas scale with window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextRaven = 0;
//sets raven spawnrate
let ravenInterval = 500;
let lastTime = 0;

//holds raven objects
let ravens = [];

class Raven {
    constructor() {
        this.width = 100;
        this.height = 50;

        this.x = canvas.width;
        //random vertical position on canvas
        this.y = Math.random() * (canvas.height - this.height);

        //horizontal travel speed min: 3 max: 8
        this.directionX = Math.random() * 5 + 3
        //vertical travel behavior
        this.directionY = Math.random() * 5 - 2.5;

        //sets the sinus wave angle
        this.angle = 0;

        //sets the angle speed to a random value
        this.angleSpeed = Math.random() * 0.2;

        //increases the vertical length of the curve 
        this.curve = Math.random() * 8

        this.markedForDeletion = false;
    }

    //moves the sprite
    update() {
        this.x -= this.directionX;
        // makes vertical movement a sinus wave 
        this.y += this.curve * Math.sin(this.angle)
        //sets the angle of the sinus wave, the higher the speed, the higher the angle
        this.angle += this.angleSpeed;

        if (this.x < 0 - this.width) this.markedForDeletion = true;
    }

    draw(){
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const raven = new Raven()


//timeStamp value counted in milliseconds, used to base speed on the same value, no matter the PC power
function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //deltaTime contains the time difference between the beginning of the previous frame and the beginning of the current frame in milliseconds.
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    //increases timeToNextRaven by deltaTime
    timeToNextRaven += deltaTime;

    //if timetonextframe reaches ravenInterval's nth number, spawn new raven
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
    };
    // [] <-- this is an array literal, the 3 dots are a spread operator. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax 
    [...ravens].forEach(obj => obj.update());
    // we use this syntax to make a shallow copy of the ravens array, this array is not affected by changes made to 'ravens'
    [...ravens].forEach(obj => obj.draw());

    //deletes ravens outside of screen it markedfordeletion evaluates to false (double negative statement)
    ravens = ravens.filter(obj => !obj.markedForDeletion);
    
    raven.update();
    raven.draw();

    requestAnimationFrame(animate);
}

animate(0)