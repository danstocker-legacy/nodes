import {INode} from "./INode";
import {Inputs} from "./Inputs";
import {Ports} from "./Ports";

export abstract class Node implements INode {
  public readonly ports: Ports;

  public send(inputs: Inputs, tag?: string): void {
    this.process(inputs, tag);
  }

  protected abstract process(inputs: Inputs, tag?: string): void;
}
