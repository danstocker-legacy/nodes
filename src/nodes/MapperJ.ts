import {IBouncer, ISink, ISource} from "../node";
import {TInBundle, TOutBundle} from "../port";
import {IAny} from "../utils";
import {Joiner} from "./Joiner";
import {IOutputs, Mapper, TMapperCallback} from "./Mapper";

export interface IInputs<T> {
  i: T;
}

export class MapperJ<I extends IAny, O> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<I>;
  public readonly o: TOutBundle<IOutputs<O>>;
  public readonly b: TOutBundle<IInputs<I>>;

  constructor(fields: Array<keyof I>, cb: TMapperCallback<I, O>) {
    const joiner = new Joiner<I>(fields as Array<string>);
    const mapper = new Mapper<I, O>(cb);
    joiner.o.o.connect(mapper.i.d_val);
    const i = {} as TInBundle<I>;
    const joinerI = joiner.i;
    for (const field of fields) {
      i[field] = joinerI[field];
    }
    this.i = i;
    this.o = {
      d_val: mapper.o.d_val,
      ev_err: mapper.o.ev_err
    };
    this.b = {
      i: mapper.b.d_val
    };
  }
}
