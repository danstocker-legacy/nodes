import {Inputs} from "../node";
import {IQuasiNode} from "./IQuasiNode";

type InputTrackerCallback = (inputs: Inputs, tag?: string) => void;

/**
 * Keeps track of last input values.
 */
export class InputTracker implements IQuasiNode {
  private readonly callback: InputTrackerCallback;
  private readonly inputs: Inputs;

  constructor(callback: InputTrackerCallback) {
    this.callback = callback;
    this.inputs = new Map();
  }

  public send(inputs: Inputs, tag?: string): void {
    for (const [port, value] of inputs.entries()) {
      this.inputs.set(port, value);
      this.callback(this.inputs, tag);
    }
  }
}
