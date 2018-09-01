import {InPort} from "./InPort";

export interface INode {
  readonly ports: Object;

  send(port: InPort<any>, value: any);
}
