window.onload = startGame;

let canvas = document.getElementById('gameboard') as HTMLCanvasElement;
var ctx = canvas.getContext("2d");

const h = canvas.height;
const w = canvas.width;
const dim = 21;
const gap = Math.floor(dim * .1);
const nx = w/dim;
const ny = h/dim;
const FPS = 60000 / 30;

function drawSnakeBlock(x: number, y: number): void {
    ctx.beginPath();
    ctx.rect(x*dim + gap, y*dim + gap, dim- gap, dim-gap);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function clearBoard(): void {
    ctx.clearRect(0, 0, w, h);
}

function drawCrumb(x: number, y: number): void {
    ctx.beginPath();
    ctx.arc(x*dim + dim/2, y*dim + dim/2, dim/4, 0, 2*Math.PI);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
}

class Snake {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
        console.log(this.x, this.y);
    }

    move() {
        // console.log(this.x, this.y);
        this.x = this.x - 1;
        this.y = this.y - 1;

        if (this.x < 0) {
            this.x = nx - 1;
        } else if (this.x >= nx) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = ny - 1;
        } else if (this.y >= ny) {
            this.y = 0;
        }
        drawSnakeBlock(this.x, this.y);
        drawSnakeBlock(this.x -1, this.y -1);

    }
}

// function move(s: Snake) {
//     // console.log(this.x, this.y);
//     s.x = s.x - 1;
//     s.y = s.y - 1;

//     if (s.x < 0) {
//         s.x = w;
//     } else if (s.x >= w) {
//         s.x = 0;
//     }

//     if (s.y < 0) {
//         s.y = h;
//     } else if (s.y >= h) {
//         s.y = 0;
//     }
//     drawSnakeBlock(s.x, s.y);
// }

function drawSnake(): void {
    drawSnakeBlock(10,10);
    drawSnakeBlock(10,11);
}

function startGame(): void {
    var s = new Snake(10,10);
    setInterval(function () {
        clearBoard()
        drawCrumb(5,5);
        s.move();
    }, 500);
    // drawCrumb(5,5);
}

