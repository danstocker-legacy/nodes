import {IInPort, OutPort} from "../port";
import {IBouncer} from "./IBouncer";

export namespace MBouncer {
  export function init(this: IBouncer, fields: Array<string>): void {
    const bundle = this.bounced = {};
    for (const field of fields) {
      bundle[field] = new OutPort(field, this);
    }
  }

  /**
   * Bounces specified value on the specified port.
   * @param port Input port to bounce.
   * @param value Value to bounce.
   * @param tag Identifies impulse.
   */
  export function bounce(
    this: IBouncer,
    port: IInPort<any>,
    value: any,
    tag?: string
  ): void {
    this.bounced[port.name].send(value, tag);
  }
}
