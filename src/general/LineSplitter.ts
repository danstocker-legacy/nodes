import {Node} from "../Node";

export class LineSplitter extends Node<string, string> {
  /**
   * Line fragment from last input.
   */
  private fragment: string = '';

  public in(value: string): void {
    let text = this.fragment + value,
      lines = text.split('\n');

    this.fragment = lines.pop();

    let lineCount = lines.length;
    for (let i = 0; i < lineCount; i++) {
      this.out(lines[i]);
    }
  }
}
