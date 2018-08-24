import {Node} from './Node';

export class Logger extends Node {
    public in(value: any): void {
        console.log(value);
    }
}
