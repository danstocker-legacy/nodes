import {InPort, Inputs} from "../node";

/**
 * Stores input values indexed by timestamp and input port.
 */
export class InputBuffer {
  public readonly count: number;
  private readonly sets: Map<string, Inputs>;

  constructor(count: number) {
    this.count = count;
    this.sets = new Map();
  }

  public setValue(tag: string, port: InPort<any>, value: any): void {
    const sets = this.sets;
    let inputs = sets.get(tag);
    if (!inputs) {
      inputs = new Map();
      sets.set(tag, inputs);
    }
    inputs.set(port, value);
  }

  public deleteInputs(tag: string): void {
    this.sets.delete(tag);
  }

  public getCompleteInputs(): Inputs {
    const count = this.count;
    for (const inputs of this.sets.values()) {
      if (inputs.size === count) {
        return inputs;
      }
    }
  }
}
