import {Inputs} from "../node";
import {InputBuffer} from "./InputBuffer";

type Callback = (inputs: Inputs, tag: string) => void;

/**
 * Integrates inputs marked with the same timestamp.
 */
export class InputSynchronizer {
  private readonly cb: Callback;
  private readonly buffer: InputBuffer;

  constructor(count: number, cb: Callback) {
    this.cb = cb;
    this.buffer = new InputBuffer(count);
  }

  public send(inputs: Inputs, tag: string): void {
    const buffer = this.buffer;
    for (const [port, value] of inputs.entries()) {
      buffer.setValue(tag, port, value);
    }

    const completeInputs = buffer.getCompleteInputs();
    if (completeInputs) {
      buffer.deleteInputs(tag);
      this.cb(completeInputs, tag);
    }
  }
}
