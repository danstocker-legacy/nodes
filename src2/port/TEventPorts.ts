import {IEvent} from "../utils";
import {TOutPorts} from "./TOutPorts";

export type TEventPorts<E extends string> = TOutPorts<{
  evt: IEvent<E>
}>;
