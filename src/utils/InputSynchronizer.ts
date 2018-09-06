import {Inputs} from "../node";
import {InputBuffer} from "./InputBuffer";
import {IQuasiNode} from "./IQuasiNode";

type InputSynchronizerCallback = (inputs: Inputs, tag: string) => void;

/**
 * Synchronizes inputs of the same tag into a single Input object.
 */
export class InputSynchronizer implements IQuasiNode {
  private readonly callback: InputSynchronizerCallback;
  private readonly buffer: InputBuffer;

  constructor(count: number, callback: InputSynchronizerCallback) {
    this.callback = callback;
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
      this.callback(completeInputs, tag);
    }
  }
}
