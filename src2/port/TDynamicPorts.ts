import {IDynamicPort} from "./IDynamicPort";
import {IPort} from "./IPort";

export type TDynamicPorts<P extends IPort<any>> = { [key: number]: IDynamicPort<any> & P };
