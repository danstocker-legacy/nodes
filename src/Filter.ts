import {Node} from './Node';
import {FilterCallback} from "./typedefs/FilterCallback";

export class Filter<I> extends Node<I, I> {
    private readonly callback: FilterCallback<I>;

    constructor(callback: FilterCallback<I>) {
        super();
        this.callback = callback;
    }

    public in(value: I): void {
        let node = this.in['node'];
        if (this.callback(value, node.id, this.inputs)) {
            this.out(value);
        }
    }
}