import {TPort} from "./TPort";
import {TPorts} from "./TPorts";

export interface IPorts<P extends TPort<V>, V> {
  bundle: TPorts<P, V>;

  addPort(port: P): void;

  deletePort(port: P): void;
}
