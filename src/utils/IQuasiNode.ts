import {Inputs} from "../node";

export interface IQuasiNode {
  send(inputs: Inputs, tag?: string): void;
}
