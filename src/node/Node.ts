import {INode} from "./INode";
import {Inputs} from "./Inputs";
import {IPort} from "./IPort";

export abstract class Node implements INode {
  public readonly ports: {
    [key: string]: IPort<any>
  };

  public send(inputs: Inputs, tag?: string): void {
    this.process(inputs, tag);
  }

  protected abstract process(inputs: Inputs, tag?: string): void;
}
