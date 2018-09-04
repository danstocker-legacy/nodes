import {InPort, Inputs} from "../node";

export class InputBuffer {
  public readonly count: number;
  private readonly sets: Map<number, Inputs>;

  constructor(count: number) {
    this.count = count;
    this.sets = new Map();
  }

  public setValue(ts: number, port: InPort<any>, value: any): void {
    const sets = this.sets;
    let inputs = sets.get(ts);
    if (!inputs) {
      inputs = new Map();
      sets.set(ts, inputs);
    }
    inputs.set(port, value);
  }

  public deleteInputs(ts: number): void {
    this.sets.delete(ts);
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
