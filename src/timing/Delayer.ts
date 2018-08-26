import {Node} from '../Node'

/**
 * Delays output by the specified number of milliseconds.
 */
export class Delayer extends Node<any, any> {
    private readonly delay: number;

    constructor(delay) {
        super();
        this.delay = delay;
    }

    public in(value: any): void {
        setTimeout(() => this.out(value), this.delay);
    }
}
