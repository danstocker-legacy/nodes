import {Node} from "../Node";

export class LineSplitter extends Node<string, string> {
    public in(value: string): void {
        let lines = value.split('\n'),
            lineCount = lines.length;
        for (let i = 0; i < lineCount; i++) {
            this.out(lines[i]);
        }
    }
}
