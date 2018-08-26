import {Node} from "../Node";

export class StdIn extends Node<null, string | Buffer> {
  constructor() {
    super();
    process.stdin.on("readable", this.onReadable.bind(this));
  }

  public in(value: null) {
    throw Error("StdIn is source-only.");
  }

  private onReadable() {
    let chunk = process.stdin.read();
    if (chunk !== null) {
      this.out(chunk);
    }
  }
}
