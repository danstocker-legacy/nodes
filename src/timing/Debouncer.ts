import {Node} from '../Node'

/**
 * Debounces output by the specified number of milliseconds.
 */
export class Debouncer extends Node<any, any> {
    private readonly delay: number;
    private timer: NodeJS.Timer;
    private values: Array<any>;

    constructor(delay) {
        super();
        this.delay = delay;
        this.values = [];
        this.onTimeout = this.onTimeout.bind(this);
    }

    public in(value: any): void {
        this.values.push(value);

        let timer = this.timer;
        if (timer) {
            clearTimeout(timer);
        }

        this.timer = setTimeout(this.onTimeout, this.delay);
    }

    private onTimeout(): void {
        let values = this.values;
        this.timer = undefined;
        this.values = [];
        this.out(values);
    }
}
