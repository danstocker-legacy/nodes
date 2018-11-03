import {IPort} from "./IPort";
import {IStaticPort} from "./IStaticPort";

export type TStaticPorts<P extends IPort<any>, N extends string> = { [K in N]: IStaticPort<any> & P };
