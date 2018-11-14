import {TPort} from "./TPort";
import {TPorts} from "./TPorts";

/**
 * Defines class that manages a set of ports.
 * @deprecated Will be replaced by mixins DynamicSource & DynamicSink.
 */
export interface IPorts<T, P extends TPort<T>> {
  bundle: TPorts<T, P>;

  addPort(port: P): void;

  deletePort(port: P): void;
}
