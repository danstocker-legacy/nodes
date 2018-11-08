import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";

/**
 * Forwards previous input.
 * Does not know about original tag order. Feed through Serializer if
 * original tag order is to be retained.
 */
export class Shifter<T> extends Node {
  public readonly in: TStaticInPorts<{
    $: T
  }>;
  public readonly out: TStaticOutPorts<{
    $: T
  }>;

  private readonly disp: number;
  private readonly buffer: Array<T>;

  /**
   * @param disp Displacement
   */
  constructor(disp: number = 1) {
    super();

    this.disp = disp;
    this.buffer = [];
    this.addPort(new StaticInPort("$", this));
    this.addPort(new StaticOutPort("$", this));
  }

  public send<U>(port: IInPort<U & T>, input: U & T, tag?: string): void {
    const disp = this.disp;
    const buffer = this.buffer;
    buffer.push(input);
    if (buffer.length > disp) {
      this.out.$.send(buffer.shift(), tag);
    } else {
      this.out.$.send(undefined, tag);
    }
  }
}
