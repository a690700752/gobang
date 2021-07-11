import { CELL_ROW_CNT } from "./Constants";
import Frame from "./Frame";
import { Context, getInitState, Input } from "./StateBase";

class Application {
  frame: Frame;
  nextBlack: boolean;
  selectRow: number | null = null;
  selectCol: number | null = null;
  state = getInitState();
  context: Context;
  constructor() {
    this.frame = new Frame();
    this.nextBlack = true;

    this.context = { table: new Array(CELL_ROW_CNT) };
    for (let i = 0; i < this.context.table.length; i++) {
      this.context.table[i] = new Array(CELL_ROW_CNT);
    }

    this.frame.setOnClickListener((row, col) => {
      this.input2State({
        tag: "ClickInput",
        row,
        col,
      });
    });
  }

  input2State(input: Input) {
    this.state = this.state.next(this.context, input);
    this.redraw();
  }

  redraw() {
    this.frame.draw(this.context.table, this.selectRow, this.selectCol);
  }

  start() {
    this.redraw();
  }
}

const app = new Application();

app.start();
