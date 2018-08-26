import {Node} from "../Node";

export class StdOut extends Node<string | Buffer, null> {
  public in(value: string | Buffer): void {
    process.stdout.write(value);
  }
}
