import {Node} from '../Node'

/**
 * Throttles output by the specified number of milliseconds.
 */
export class Throttler extends Node<any, any> {
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
        if (!timer) {
            this.timer = setTimeout(this.onTimeout, this.delay);
        }
    }

    private onTimeout(): void {
        let values = this.values;
        if (values.length) {
            this.timer = setTimeout(this.onTimeout, this.delay);
            this.values = [];
            this.out(values);
        } else {
            this.timer = undefined;
        }
    }
}
