import {Node} from '../Node'

export class Stringifier<I> extends Node<I, string> {
    public in(value: I): void {
        this.out(String(value));
    }
}
