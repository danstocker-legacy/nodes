import {Node} from './Node';

export class Noop extends Node {
    public in(value: any): void {
        this.out(value);
    }
}
