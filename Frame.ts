import { CELL_ROW_CNT } from "./Constants";

class CrossHair {
  ctx: CanvasRenderingContext2D;
  size: number;
  cellSize: number;

  constructor(ctx: CanvasRenderingContext2D, cellSize: number) {
    this.ctx = ctx;
    this.size = (cellSize * 2) / 3;
    this.cellSize = cellSize;
  }

  draw(row: number | null, col: number | null) {
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

export default class Frame {
  ctx: CanvasRenderingContext2D;
  size: number;
  cellSize: number;
  crossHair: CrossHair;
  offset: number;
  onClick: ((row: number, col: number) => void) | null = null;

  constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.size = canvas.width;
    this.cellSize = this.size / CELL_ROW_CNT;
    this.crossHair = new CrossHair(this.ctx, this.cellSize);
    this.offset = this.cellSize / 2;

    canvas.addEventListener("mouseup", this.doMouseUp.bind(this), false);
  }

  setOnClickListener(listener: (row: number, col: number) => void) {
    this.onClick = listener;
  }

  doMouseUp(event: MouseEvent) {
    const col = Math.round((event.offsetX - this.offset) / this.cellSize);
    const row = Math.round((event.offsetY - this.offset) / this.cellSize);

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

  drawChessPice(col: number, row: number, color: string) {
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

  drawChessPieces(table: number[][]) {
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

  draw(table: number[][], selectRow: number | null, selectCol: number | null) {
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.ctx.rect(0, 0, this.size, this.size);
    this.ctx.fillStyle = "#fdf6e3";
    this.ctx.fill();

    this.ctx.translate(this.offset, this.offset);

    this.drawBoard();
    this.crossHair.draw(selectRow, selectCol);
    this.drawChessPieces(table);

    this.ctx.translate(-this.offset, -this.offset);
  }
}
