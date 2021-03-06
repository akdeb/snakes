// scale to rectangle later. 
// build a square board first.
import * as _ from "lodash";

window.onload = startGame;

let canvas = document.getElementById('gameboard') as HTMLCanvasElement;
var ctx = canvas.getContext("2d");

const s = canvas.height;
const dim = 20;
const nblocks = s/dim;
const defaultSnakeLength = 3;

// default position is snake still
let xv = 1, yv = 0;

function drawSnakeBlock(x: number, y: number, alpha: number): void {
    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.rect(x*dim+2, y*dim+2, dim-2, dim-2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function clearCanvas(): void {
    ctx.clearRect(0, 0, s, s);
}

// this manages only positive numbers right now
function drawCrumb(x: number, y: number): void {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.arc(x*dim + dim/2, y*dim + dim/2, dim/3, 0, 2*Math.PI);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
}

function transpose (arr: number[][]) {
    return _.zip.apply(_, arr);
}

class doublyLinkedListNode {
    next: doublyLinkedListNode;
    prev: doublyLinkedListNode;
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
        this.next = null;
        this.prev = null;
    }

    toString (): string {
        return `x: ${this.x}, y: ${this.y}`;
    }
}

class doublyLinkedList {
    head: doublyLinkedListNode;
    tail: doublyLinkedListNode;
    n: number;

    constructor () {
        this.head = new doublyLinkedListNode(-1,-1);
        this.tail = new doublyLinkedListNode(-1,-1);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.n = 0
    }

    // when a new crumb is collected you add a new node
    // add to head
    addNode (x: number, y: number) {
        const node = new doublyLinkedListNode(x, y);
        node.next = this.head.next;
        node.next.prev = node;
        node.prev = this.head;
        this.head.next = node;
        this.n += 1;
    }

    // TODO: in case of collision with another snake, you lose a node.
    // not useful at the moment, initially a snake is just a 3-block DLL
    // useful when moving snake - remove from tail and add to head operation
    // remove from tail
    removeNode (): doublyLinkedListNode {
        let node = this.tail.prev;
        this.tail.prev = node.prev;
        node.prev.next = this.tail;
        this.n -= 1;
        return node;
    }

    // debuggin function to check snake type
    toString () {
        let node = this.head;
        node = node.next;
        while (node !== this.tail) {
            console.log(node.toString());
            node = node.next;
        }
    }
}

enum SnakeDirection {
    N,
    E,
    W,
    S,
}

class Snake {
    structure: doublyLinkedList;
    dir: SnakeDirection;

    constructor () {
        this.structure = new doublyLinkedList()
        this.restart();
    }

    restart () {
        for (let i = 0; i < defaultSnakeLength; i+=1) {
            this.structure.addNode(10+i,10);
        }
    }
}

class Crumb {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Board {
    snake: Snake;
    crumb: Crumb;
    board: number[][];

    constructor () {
        this.board = new Array(nblocks);
        for (let i = 0; i < nblocks; i += 1) {
            this.board[i] = new Array(nblocks);
            for (let j = 0; j < nblocks; j += 1) {
                this.board[i][j] = 0;
            }
        }
        this.snake = new Snake();
        this.getCrumb();
    }

    clearBoard () {
        for (let i = 0; i < nblocks; i += 1) {
            for (let j = 0; j < nblocks; j += 1) {
                this.board[i][j] = 0;
            }
        }
        clearCanvas();
    }

    // isCollision () {
    //     let snakeHead: doublyLinkedListNode = this.snake.structure.head.next;

    // }

    captureCrumb () {
        // Captures crumb, increases size of snake, and adds new crumb to board.
        let snakeHead: doublyLinkedListNode = this.snake.structure.head.next;
        if (snakeHead.x == this.crumb.x && snakeHead.y == this.crumb.y) {
            this.snake.structure.addNode(snakeHead.x + xv, snakeHead.y + yv);
            this.getCrumb();     
        }
        console.log(this.snake.structure.n);
    }

    move () {
        let snakeHead: doublyLinkedListNode = this.snake.structure.head.next;
        let node: doublyLinkedListNode = this.snake.structure.removeNode();
        this.snake.structure.addNode(snakeHead.x + xv, snakeHead.y + yv);

        // perform movement first, see if crumb captured, and then wrap. then render.
        this.captureCrumb();
        this.wrap();
        this.render();
    }


    render () {
        this.clearBoard();
        this.updateBoardWithSnake();
        this.updateBoardWithCrumb();
        let diff: number = 0.9 / this.snake.structure.n;
        let alpha: number = 1-diff; 
        for (let i = 0; i < nblocks; i += 1) {
            for (let j = 0; j < nblocks; j += 1) {
                if (this.board[i][j] == 1) {
                    drawSnakeBlock(i, j, alpha);
                    alpha -= diff
                } else if (this.board[i][j] == -1) {
                    drawCrumb(i, j);
                }
            }
        }
    }

    updateBoardWithCrumb() {
        this.board[this.crumb.x][this.crumb.y] = -1;
    }

    updateBoardWithSnake() {
        let node = this.snake.structure.head;
        node = node.next;
        while (node !== this.snake.structure.tail) {
            this.board[node.x][node.y] = 1;
            node = node.next;
        }
    }

    wrap() {
        // point to real head of snake not sentinel head
        let node: doublyLinkedListNode = this.snake.structure.head.next;
        while (node != this.snake.structure.tail) {
            if (node.x < 0) {
                node.x = nblocks - 1;
            } else if (node.x >= nblocks) {
                node.x = 0;
            }
    
            if (node.y < 0) {
                node.y = nblocks - 1;
            } else if (node.y >= nblocks) {
                node.y = 0;
            }
            node = node.next;
        }
    }

    // at worst O(length of Snake) runtime
    // call when existing crumb has been caught by head
    // and when initializing board
    getCrumb (): void {
        let x: number, y: number;
        while (true) {
            x = getRandomInt(0, nblocks-1);
            y = getRandomInt(0, nblocks-1);
            if (!this.board[x][y]) 
                break;
        }
        this.crumb = new Crumb(x, y)
    }
}

document.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'ArrowDown': 
            xv=0; yv=1;
            break;
        case 'ArrowUp': 
            xv=0; yv=-1;
            break;
        case 'ArrowLeft':
            xv=-1; yv=0;
            break;
        case 'ArrowRight':
            xv=1; yv=0;
            break;
        default:
            console.log(`${event.code} not handled.`);
    }
});

function startGame(): void {
    var board = new Board();
    setInterval(function () {
        board.move();
    }, 100);
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}