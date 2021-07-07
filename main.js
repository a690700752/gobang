"use strict";

const CELL_ROW_CNT = 16;

class CrossHair {
  constructor(ctx, cellSize) {
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    this.size = (cellSize * 2) / 3;
    this.cellSize = cellSize;
  }

  draw(row, col) {
    if (col && row) {
      const x = col * this.cellSize;
      const y = row * this.cellSize;

      this.ctx.save();
      this.ctx.setLineDash([3]);
      this.ctx.strokeStyle = "#0000ff";
      this.ctx.strokeRect(
        x - this.size / 2,
        y - this.size / 2,
        this.size,
        this.size
      );
      this.ctx.restore();
    }
  }
}

class Frame {
  constructor() {
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById("canvas");
    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");

    this.size = this.canvas.width;
    this.cellSize = this.size / CELL_ROW_CNT;
    this.crossHair = new CrossHair(this.ctx, this.cellSize);

    this.canvas.addEventListener("mouseup", this.doMouseUp.bind(this), false);
  }

  setOnClickListener(listener) {
    this.onClick = listener;
  }

  doMouseUp(event) {
    const col = (event.offsetX / this.cellSize).toFixed(0);
    const row = (event.offsetY / this.cellSize).toFixed(0);

    this.onClick && this.onClick(row, col);
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

  drawChessPice(col, row, color) {
    const chessSize = (this.cellSize * 9) / 10;
    this.ctx.beginPath();
    this.ctx.arc(
      col * this.cellSize,
      row * this.cellSize,
      chessSize / 2,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawChessPieces(table) {
    this.ctx.save();

    for (let i = 0; i < CELL_ROW_CNT; i++) {
      for (let j = 0; j < CELL_ROW_CNT; j++) {
        if (table[i][j] === 1) {
          this.drawChessPice(i, j, "white");
        } else if (table[i][j] === 2) {
          this.drawChessPice(i, j, "black");
        }
      }
    }
    this.ctx.restore();
  }

  draw(table, selectRow, selectCol) {
    this.ctx.clearRect(0, 0, this.size, this.size);

    this.drawBoard();
    this.crossHair.draw(selectRow, selectCol);
    this.drawChessPieces(table);
  }
}

class Application {
  constructor() {
    this.frame = new Frame();
    this.nextBlack = true;

    this.chessTable = new Array(CELL_ROW_CNT);
    for (let i = 0; i < this.chessTable.length; i++) {
      this.chessTable[i] = new Array(CELL_ROW_CNT);
    }

    this.frame.setOnClickListener((row, col) => {
      if (this.selectRow === row && this.selectCol === col) {
        this.chessTable[col][row] = this.nextBlack ? 2 : 1;
        this.nextBlack = !this.nextBlack;
        this.selectRow = null;
        this.selectCol = null;
      } else if (!this.chessTable[col][row]){
        this.selectRow = row;
        this.selectCol = col;
      }
      this.redraw();
    });
  }

  redraw() {
    this.frame.draw(this.chessTable, this.selectRow, this.selectCol);
  }

  start() {
    this.redraw();
  }
}

// eslint-disable-next-line no-unused-vars
function main() {
  const app = new Application();

  app.start();
}
