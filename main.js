"use strict";

const CELL_ROW_CNT = 16;

class CrossHair {
  constructor(ctx, cellSize) {
    this.ctx = ctx;
    this.x = null;
    this.y = null;
    this.size = (cellSize * 2) / 3;
    this.cellSize = cellSize;
  }

  setPointer(px, py) {
    this.x = px * this.cellSize;
    this.y = py * this.cellSize;
  }

  draw() {
    if (this.x && this.y) {
      this.ctx.save();
      this.ctx.setLineDash([3]);
      this.ctx.strokeStyle = "#0000ff";
      this.ctx.strokeRect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
      this.ctx.restore();
    }
  }
}

class Application {
  constructor() {
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById("canvas");
    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");

    this.size = this.canvas.width;
    this.cellSize = this.size / CELL_ROW_CNT;
    this.crossHair = new CrossHair(this.ctx, this.cellSize);

    this.chessTable = new Array(CELL_ROW_CNT);
    for (let i = 0; i < this.chessTable.length; i++) {
      this.chessTable[i] = new Array(CELL_ROW_CNT);
    }

    this.canvas.addEventListener("mouseup", this.doMouseUp.bind(this), false);
  }

  doMouseUp(event) {
    const px = (event.offsetX / this.cellSize).toFixed(0);
    const py = (event.offsetY / this.cellSize).toFixed(0);

    console.log("px", px, "py", py);
    this.crossHair.setPointer(px, py);
    this.draw();
  }

  drawBoard() {
    const cellSize = this.cellSize;
    const size = this.size;
    const ctx = this.ctx;

    ctx.beginPath();
    for (let i = 0; i < CELL_ROW_CNT; i++) {
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size - cellSize);
    }

    for (let i = 0; i < CELL_ROW_CNT; i++) {
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size - cellSize, i * cellSize);
    }
    ctx.stroke();

  }

  draw() {
    this.ctx.clearRect(0, 0, this.size, this.size);

    this.drawBoard();
    this.crossHair.draw();
  }

  start() {
    this.draw();
  }
}

// eslint-disable-next-line no-unused-vars
function main() {
  const app = new Application();

  app.start();
}
