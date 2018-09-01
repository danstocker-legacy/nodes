import {InPort} from "./InPort";

export interface INode {
  readonly ports: Object;

  in(port: InPort<any>, value: any);
}
