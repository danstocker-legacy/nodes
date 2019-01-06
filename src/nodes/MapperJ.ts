import {IBouncer, ISink, ISource} from "../node";
import {TInBundle, TOutBundle} from "../port";
import {IAny} from "../utils";
import {Joiner} from "./Joiner";
import {IOutputs, Mapper, TMapperCallback} from "./Mapper";
import {Splitter} from "./Splitter";

export interface IInputs<T> {
  i: T;
}

export class MapperJ<I extends IAny, O> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<I>;
  public readonly o: TOutBundle<IOutputs<O>>;
  public readonly b: TOutBundle<I>;

  constructor(fields: Array<keyof I>, cb: TMapperCallback<I, O>) {
    const joiner = new Joiner<I>(fields as Array<string>);
    const mapper = new Mapper<I, O>(cb);
    const splitter = new Splitter<I>(fields as Array<string>);
    joiner.o.o.connect(mapper.i.d_val);
    mapper.b.d_val.connect(splitter.i.i);
    const i = {} as TInBundle<I>;
    const b = {} as TOutBundle<I>;
    const joinerI = joiner.i;
    const splitterO = splitter.o;
    for (const field of fields) {
      i[field] = joinerI[field];
      b[field] = splitterO[field];
    }
    this.i = i;
    this.b = b;
    this.o = {
      d_val: mapper.o.d_val,
      ev_err: mapper.o.ev_err
    };
  }
}
