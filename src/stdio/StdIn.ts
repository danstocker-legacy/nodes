import {Node} from "../Node";

export class StdIn extends Node<null, string | Buffer> {
    constructor() {
        super();
        process.stdin.on("readable", this.onReadable.bind(this));
    }

    private onReadable() {
        let chunk = process.stdin.read();
        if (chunk !== null) {
            this.out(chunk);
        }
    }
}
