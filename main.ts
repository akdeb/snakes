let canvas: any = document.getElementById("gameboard");
let ctx = canvas.getContext("2d");

function init (ctx: any): void {
    ctx.beginPath();
    ctx.rect(20,40,50,50);
    ctx.fillStyle = "#f00";
    ctx.fill();
    ctx.closePath();
};

init(ctx);
