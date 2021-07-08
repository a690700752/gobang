import { CELL_ROW_CNT } from "./Constants";
import Frame from "./Frame";

class Application {
  frame: Frame;
  nextBlack: boolean;
  chessTable: number[][];
  selectRow: number | null = null;
  selectCol: number | null = null;

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
      } else if (!this.chessTable[col][row]) {
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

const app = new Application();

app.start();
