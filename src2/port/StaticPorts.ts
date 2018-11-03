import {IPort} from "./IPort";
import {IStaticPort} from "./IStaticPort";

export type StaticPorts<P extends IPort<any>, N extends string> = { [K in N]: IStaticPort<any> & P };
