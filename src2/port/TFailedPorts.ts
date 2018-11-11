import {IMuxed} from "../atomic";
import {TOutPorts} from "./TOutPorts";

export type TFailedPorts<I> = TOutPorts<{
  fail: IMuxed<I>
}>;
