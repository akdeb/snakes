// scale to rectangle later. 
// build a square board first.

window.onload = startGame;

let canvas = document.getElementById('gameboard') as HTMLCanvasElement;
var ctx = canvas.getContext("2d");

const s = canvas.height;
const dim = 20;
const gap = 2;
const nblocks = s/dim;
const defaultSnakeLength = 3;

function drawSnakeBlock(x: number, y: number): void {
    ctx.beginPath();
    ctx.rect(x*dim+2, y*dim+2, dim-2, dim-2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function clearBoard(): void {
    ctx.clearRect(0, 0, s, s);
}

// this manages only positive numbers right now
function drawCrumb(x: number, y: number): void {
    ctx.beginPath();
    ctx.arc(x*dim + dim/2, y*dim + dim/2, dim/3, 0, 2*Math.PI);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
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

    toString () {
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
        this.head.next.prev = node;
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
        return '';
    }
}

class Snake {
    structure: doublyLinkedList;

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
        this.updateBoardWithSnake();
        this.crumb = this.getNextCrumb();
    }

    move () {
        // this.snake.structure.toString();
        this.snake.structure.head.next.x = this.snake.structure.head.next.x + 1;
        let node: doublyLinkedListNode = this.snake.structure.removeNode();
        this.snake.structure.addNode(node.x, node.y);
        this.updateBoardWithSnake();
        this.render();
    }

    render () {
        for (let i = 0; i < nblocks; i += 1) {
            for (let j = 0; j < nblocks; j += 1) {
                if (this.board[i][j] == 1) {
                    drawSnakeBlock(i, j);
                } else if (this.board[i][j] == -1) {
                    drawCrumb(i, j);
                }
            }
        }
    }

    updateBoardWithSnake() {
        let node = this.snake.structure.head;
        node = node.next;
        while (node !== this.snake.structure.tail) {
            this.board[node.x][node.y] = 1;
            node = node.next;
        }
    }

    getNextCrumb (): Crumb {
        let x: number, y: number;
        while (true) {
            x = getRandomInt(0, nblocks-1);
            y = getRandomInt(0, nblocks-1);
            if (!this.board[x][y]) 
                break;
        }
        this.board[x][y] = -1;
        return new Crumb(x, y)
    }

    // move() {
    //     // console.log(this.x, this.y);
    //     drawSnakeBlock(this.x, this.y);
    //     drawSnakeBlock(this.x, this.y+1);
    //     this.x = this.x +1;
    //     // this.y = this.y - 1;

    //     if (this.x < 0) {
    //         this.x = nx - 1;
    //     } else if (this.x >= nx) {
    //         this.x = 0;
    //     }

    //     if (this.y < 0) {
    //         this.y = ny - 1;
    //     } else if (this.y >= ny) {
    //         this.y = 0;
    //     }
    // }
}

function startGame(): void {
    var board = new Board();
    setInterval(function () {
        board.move();
    }, 500);
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}