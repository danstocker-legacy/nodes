import {IError} from "../utils";
import {TOutPorts} from "./TOutPorts";

export type TErrorPorts<R extends string> = TOutPorts<{
  err: IError<R>
}>;
