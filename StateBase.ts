import { BLACK_PIECE, WHITE_PIECE } from "./Constants";

export type ClickInput = {
  tag: "ClickInput";
  col: number;
  row: number;
};

export type RemoteClickInput = {
  tag: "RemoteInput";
  col: number;
  row: number;
};

export type Context = {
  table: number[][];
};

export type Input = ClickInput | RemoteClickInput;

export interface StateBase {
  next(context: Context, input: Input): StateBase;
}

export function getInitState(): StateBase {
  return new WaitSelFallingState();
}

class WaitSelFallingState implements StateBase {
  selectCol: number | null = null;
  selectRow: number | null = null;

  next(context: Context, input: ClickInput): StateBase {
    if (input.tag === "ClickInput") {
      input = input as ClickInput;
      const { col, row } = input;

      if (this.selectRow === row && this.selectCol === col) {
        context.table[col][row] = BLACK_PIECE;
        return new WaitOpponentFallingState();
      } else if (!context.table[col][row]) {
        this.selectRow = row;
        this.selectCol = col;
      }
    }

    return this;
  }
}

class WaitOpponentFallingState implements StateBase {
  selectCol: number | null = null;
  selectRow: number | null = null;

  next(context: Context, input: ClickInput): StateBase {
    if (input.tag === "ClickInput") {
      input = input as ClickInput;
      const { col, row } = input;

      if (this.selectRow === row && this.selectCol === col) {
        context.table[col][row] = WHITE_PIECE;
        return new WaitSelFallingState();
      } else if (!context.table[col][row]) {
        this.selectRow = row;
        this.selectCol = col;
      }
    }

    return this;
  }
}

class GameOverState implements StateBase {
  next(context: Context, input: Input): StateBase {
    throw new Error("Method not implemented.");
  }
}
