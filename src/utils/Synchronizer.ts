import {InputBuffer, Inputs} from "./InputBuffer";

type Callback = (inputs: Inputs, ts: number) => void;

export class Synchronizer {
  private readonly cb: Callback;
  private readonly buffer: InputBuffer;

  constructor(count: number, cb: Callback) {
    this.cb = cb;
    this.buffer = new InputBuffer(count);
  }

  public next(inputs: Inputs, ts: number): void {
    const buffer = this.buffer;
    for (const [port, value] of inputs.entries()) {
      buffer.setValue(ts, port, value);
    }

    const completeInputs = buffer.getCompleteInputs();
    if (completeInputs) {
      buffer.deleteInputs(ts);
      this.cb(completeInputs, ts);
    }
  }
}
