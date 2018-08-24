import {Node} from './Node';
import {MapperCallback} from "./typedefs/MapperCallback";

export class Mapper<I, O> extends Node<I, O> {
    private readonly callback: MapperCallback<I, O>;

    constructor(callback: MapperCallback<I, O>) {
        super();
        this.callback = callback;
    }

    public in(value: I): void {
        let node = this.in['node'];
        this.out(this.callback(value, node.id, this.inputs));
    }
}