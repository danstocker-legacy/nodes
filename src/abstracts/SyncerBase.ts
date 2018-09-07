import {InPort, Inputs, Node} from "../node";
import {InputBuffer} from "../utils";

export abstract class SyncerBase extends Node {
  private buffer: InputBuffer;

  protected constructor() {
    super();
  }

  public send(inputs: Inputs, tag?: string): void {
    const buffer = this.buffer = this.buffer || new InputBuffer(this.getInPortCount());
    for (const [port, value] of inputs.entries()) {
      buffer.setValue(tag, port, value);
    }

    const completeInputs = buffer.getCompleteInputs();
    if (completeInputs) {
      buffer.deleteInputs(tag);
      this.process(completeInputs, tag);
    }
  }

  private getInPortCount(): number {
    const ports = this.ports;
    let result = 0;
    for (const name in ports) {
      if (ports[name] instanceof InPort) {
        result++;
      }
    }
    return result;
  }
}
