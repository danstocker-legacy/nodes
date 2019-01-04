import {IBouncer, ISink, ISource} from "../node";
import {TInBundle, TOutBundle} from "../port";
import {IInputs, IOutputs, TFolderCallback} from "./Folder";
import {Joiner} from "./Joiner";
import {IInputs as IUFolderInputs, UFolder} from "./UFolder";

export class FolderJ<I, O> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IInputs<I>>;
  public readonly o: TOutBundle<IOutputs<O>>;
  public readonly b: TOutBundle<IUFolderInputs<I>>;

  constructor(cb: TFolderCallback<I, O>) {
    const joiner = new Joiner<IInputs<I>>(["d_val", "ev_res"]);
    const folder = new UFolder<I, O>(cb);
    joiner.o.o.connect(folder.i.i);
    this.i = {
      d_val: joiner.i.d_val,
      ev_res: joiner.i.ev_res
    };
    this.o = {
      d_fold: folder.o.d_fold,
      ev_err: folder.o.ev_err
    };
    this.b = {
      i: folder.b.i
    };
  }
}
