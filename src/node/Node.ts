import {InPort} from "./InPort";
import {InPorts} from "./InPorts";
import {Inputs} from "./Inputs";
import {NodeBase} from "./NodeBase";
import {OutPort} from "./OutPort";
import {OutPorts} from "./OutPorts";

type ProcessCallback = (inputs: { [key: string]: any }, tag?: string) => void;

/**
 * Ad-hoc node defined by process callback and number of ports.
 */
export class Node extends NodeBase {
  public readonly in: InPorts;
  public readonly out: OutPorts;
  private readonly callback: ProcessCallback;

  constructor(callback: ProcessCallback, inCount: number = 1, outCount: number = 1) {
    super();
    this.callback = callback;
    for (let i = 0; i < inCount; i++) {
      this.openInPort(`${i}`, new InPort<any>(this));
    }
    for (let i = 0; i < outCount; i++) {
      this.openOutPort(`${i}`, new OutPort<any>(this));
    }
  }

  protected process(inputs: Inputs, tag?: string): void {
    const inPorts = this.in;
    const values = {};
    // tslint:disable:forin
    for (const name in inPorts) {
      values[name] = inputs.get(inPorts[name]);
    }
    this.callback(values, tag);
  }
}
