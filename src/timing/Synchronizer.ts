import {INode, InPort, OutPort, Ports} from "../node/index";

type Inputs = Map<InPort<any>, any>;

/**
 * Forwards all inputs sharing the same timestamp in one go, once they've all
 * been received.
 */
export class Synchronizer implements INode {
  public readonly ports: Ports;
  public readonly count: number;
  private readonly lookup: Map<InPort<any>, OutPort<any>>;
  private readonly buffer: {
    [timestamp: number]: Inputs
  };

  constructor(count: number) {
    const ports = this.ports = {};
    const lookup = this.lookup = new Map();
    for (let i = 1; i <= count; i++) {
      const inPort = new InPort(this);
      const outPort = new OutPort(this);
      ports[`in${i}`] = inPort;
      ports[`out${i}`] = outPort;
      lookup.set(inPort, outPort);
    }
    this.count = count;
    this.buffer = {};
  }

  public send(value: any, port: InPort<any>, timestamp?: number): void {
    this.addToBuffer(value, port, timestamp);
    const availableTimestamp = this.getAvailableTimestamp();
    if (availableTimestamp) {
      this.sendToOutputs(availableTimestamp);
    }
  }

  private addToBuffer(value: any, port: InPort<any>, timestamp: number): void {
    const buffer = this.buffer;
    let inputs = buffer[timestamp];
    if (!inputs) {
      inputs = buffer[timestamp] = new Map();
    }
    inputs.set(port, value);
  }

  private getAvailableTimestamp(): number {
    const buffer = this.buffer;
    const count = this.count;
    for (const timestamp in buffer) {
      if (buffer[timestamp].size === count) {
        return +timestamp;
      }
    }
  }

  private sendToOutputs(timestamp): void {
    const buffer = this.buffer;
    const inputs = buffer[timestamp];
    delete buffer[timestamp];
    const lookup = this.lookup;
    for (const [inPort, value] of inputs.entries()) {
      const outPort = lookup.get(inPort);
      outPort.send(value, timestamp);
    }
  }
}
