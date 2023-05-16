/** @type {HTMLCanvasElement} */
/*
 *  +++ PNG DIMENSION +++
 *  ./media/images/berd.png:    1308x177 | 218 WDITH per frame (6)
 *  ./media/images/bet.png:     1758x155 | 293 WIDTH per frame (6)
 *  ./media/images/betside.png: 1596x188 | 266 WIDTH per frame (6)
 *  ./media/images/raven.png:   1626x194 | 271 WIDTH per frame (6)
 *  ./media/images/spikeball    1917x212 | 213 WIDTH per frame (9)
*/

function playGame(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    //lets canvas scale with window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hitboxCanvas = document.getElementById('hitboxCanvas')
    const hitboxCtx = hitboxCanvas.getContext('2d')
    hitboxCanvas.width = window.innerWidth;
    hitboxCanvas.height = window.innerHeight;


<<<<<<< Updated upstream
let score = 0;
ctx.font = '50px Impact'
let lives = 1;
let gameOver = false;
=======
    let score = 0;
    ctx.font = '50px Impact'
    let lives = 5;
    let gameOver = false;
>>>>>>> Stashed changes



    let timeToNextRaven = 0;
    //sets raven spawnrate
    let ravenInterval = 500;
    let lastTime = 0;

    //holds raven objects
    let ravens = [];

    class Raven {
        constructor() {
            //these image propertys are declared here, to have them ready to use 
            this.spriteWidth = 271;
            this.spriteHeight = 194;

            this.sizeModifier = Math.random() * 0.6 + 0.4

            this.width = this.spriteWidth * this.sizeModifier;
            this.height = this.spriteHeight * this.sizeModifier;

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
            this.curve = Math.random() * 8;

            this.markedForDeletion = false;

            
            this.animationFrame = 0;

            //max frames until reset
            this.maxAnimationFrame = 4;

            this.image = new Image();
            this.image.src = './media/images/raven.png';
            
            //animation speed
            this.timeSinceFlap = 0;
            this.flapInterval = 75; 
            
            //Random RGB value between 1 and 255, creating different colored rectangles for each raven to use as hitboxes
            this.randColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
            this.color = `rgb(${this.randColors[0]},${this.randColors[1]},${this.randColors[2]})`

        }
        
        
        //moves the sprite
        update(deltaTime) {
            //prevvents ravens from leaving the page
            if (this.y < 0 || this.y > canvas.height - this.height) {
                this.directionY *= -1
                if (this.y > canvas.height - this.height) {
                    this.directionY = 0;
                    this.y = canvas.height - this.height;
                }
            } else {
                // makes vertical movement a sinus wave 
                this.y += this.curve * Math.sin(this.angle);
            }

            this.x -= this.directionX;
            
            //sets the angle of the sinus wave, the higher the speed, the higher the angle
            this.angle += this.angleSpeed;

            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                enemyGotAway();
            }
            

            this.timeSinceFlap += deltaTime;

            if (this.timeSinceFlap > this.flapInterval){
                if (this.animationFrame > this.maxAnimationFrame) this.animationFrame = 0;
                else this.animationFrame++;
                this.timeSinceFlap = 0;
            }
            //lives
            if (this.x < 0 - this.width) {
                lives--
            }
            if (lives <= 0) gameOver = true;
            
        }

        draw() {
            hitboxCtx.fillStyle = this.color;
            hitboxCtx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.animationFrame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
        }
    }

    //hold explosion objects
    let explosions = [];

    class Explosion {
        constructor(x, y, size) {
            this.image = new Image();
            this.image.src = './media/images/boom.png';
            this.spriteWidth = 200;
            this.spriteHeight = 179;

            this.x = x;
            this.y = y;
            this.size = size;
            this.frame = 0;
            this.sound = new Audio();
            this.sound.src = './media/sfx/mutantdie.wav';

            this.timeSinceLastFrame = 0;
            this.frameInterval = 100;

            this.markedForDeletion = false;
        }

        update(deltaTime) {
            if (this.frame === 0) this.sound.play();

            this.timeSinceLastFrame += deltaTime;
            if (this.timeSinceLastFrame > this.frameInterval) {
                this.frame++;
                this.timeSinceLastFrame = 0;
                if (this.frame > 5) this.markedForDeletion = true;
            }

        }

        draw() {
            ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/5.5,this.size, this.size)
        }
    }


    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.fillText('Score: ' + score, canvas.width * 0.033, canvas.height * 0.0585 );
        ctx.fillStyle = 'white';
        ctx.fillText('Score: ' + score, canvas.width * 0.035, canvas.height * 0.06 );
    }

    function drawLives() {
        ctx.fillStyle = 'black';
        ctx.fillText('Lives: ' + lives, canvas.width * 0.033, canvas.height * 0.1185);
        ctx.fillStyle = 'white';
        ctx.fillText('Lives: ' + lives, canvas.width * 0.035, canvas.height * 0.12);
    }

    function drawGameOver() {
        ctx.textAlign = 'center'

        ctx.fillStyle = 'red'
        ctx.fillRect(canvas.width * 0.00001, canvas.height * 0.00001, canvas.width, canvas.height)

        ctx.fillStyle = 'black';
        ctx.fillText('GAME OVER', canvas.width * 0.498 , canvas.height * 0.447)
        ctx.fillStyle = 'white';
        ctx.fillText('GAME OVER', canvas.width * 0.5, canvas.height * 0.45)
        
        ctx.fillStyle = 'black';
        ctx.fillText('SCORE: ' + score, canvas.width * 0.498, canvas.height * 0.4975)
        ctx.fillStyle = 'white';
        ctx.fillText('SCORE: ' + score, canvas.width * 0.5, canvas.height * 0.5)

        const GameOverSound = new Audio('./media/sfx/GameOver.ogg')
        GameOverSound.volume = 0.5
        GameOverSound.play()
    
    }

    function gunshotSound() {
    const pistolShotsArr = [
        new Audio('./media/sfx/pistol.ogg'),
        new Audio('./media/sfx/pistol2.ogg'),
        new Audio('./media/sfx/pistol3.ogg')
    ];
    const randomIndex = Math.floor(Math.random() * pistolShotsArr.length);
    const selectedShot = pistolShotsArr[randomIndex];
    selectedShot.volume = 0.15;
    selectedShot.play();
    }

    function enemyGotAway() {
        const gotAway = new Audio('./media/sfx/gotAway.wav')
        gotAway.volume = 0.6
        gotAway.play()
    }

    window.addEventListener('click', function (e) {
        const detectPixelColor = hitboxCtx.getImageData(e.x, e.y, 1, 1);
        const pixelColor = detectPixelColor.data;
        ravens.forEach(obj => {
            if (obj.randColors[0] === pixelColor[0] &&
                obj.randColors[1] === pixelColor[1] &&
                obj.randColors[2] === pixelColor[2]) {
                    obj.markedForDeletion = true;
                    score++;
                    explosions.push(new Explosion(obj.x, obj.y, obj.width));
            }
        });
        if (!gameOver) gunshotSound()

    });
<<<<<<< Updated upstream
    gunshotSound()

});
=======
>>>>>>> Stashed changes



    //timeStamp value counted in milliseconds, used to base speed on the same value, no matter the PC power
    function animate(timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hitboxCtx.clearRect(0, 0, canvas.width, canvas.height);
        //deltaTime contains the time difference between the beginning of the previous frame and the beginning of the current frame in milliseconds.
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        //increases timeToNextRaven by deltaTime
        timeToNextRaven += deltaTime;

        //if timetonextframe reaches ravenInterval's nth number, spawn new raven
        if (timeToNextRaven > ravenInterval) {
            ravens.push(new Raven());
            timeToNextRaven = 0;
            //sorts ravens in array by size, to create depth
            ravens.sort(function (a, b) {
                return a.width - b.width;
            })
        };

        drawScore();
        drawLives();

        // [] <-- this is an array literal, the 3 dots are a spread operator. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax 
        [...ravens, ...explosions].forEach(obj => obj.update(deltaTime));
        // we use this syntax to make a shallow copy of the ravens array, this array is not affected by changes made to 'ravens'
        [...ravens, ...explosions].forEach(obj => obj.draw());

        //deletes ravens outside of screen it markedfordeletion evaluates to false (double negative statement)
        ravens = ravens.filter(obj => !obj.markedForDeletion);
        explosions = explosions.filter(obj => !obj.markedForDeletion);

        if (!gameOver) requestAnimationFrame(animate);
        else drawGameOver();
    }

    animate(0)
}
playGame()