import {Node} from "../node/Node";

export class StdErr extends Node<string | Buffer, null> {
  public in(value: string | Buffer): void {
    process.stderr.write(value);
  }
}
