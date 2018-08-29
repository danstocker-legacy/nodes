import {Node} from "../node/Node";

export class LineSplitter extends Node<string, string> {
  /**
   * Line fragment from last input.
   */
  private fragment: string = '';

  public in(value: string): void {
    const text = this.fragment + value;
    const lines = text.split('\n');

    this.fragment = lines.pop();

    const lineCount = lines.length;
    for (let i = 0; i < lineCount; i++) {
      this.out(lines[i]);
    }
  }
}
