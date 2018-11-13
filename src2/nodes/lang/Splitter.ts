import {ISink, ISource} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";
import {IHash} from "../../utils";

interface ISplitterInputs<T> {
  $: T;
}

/**
 * Splits synchronized values sets.
 * @example
 * let splitter: Splitter<{foo: number, bar: boolean}>;
 * splitter = new Splitter(["foo", "bar"]);
 * splitter.in.$.connect(A.out.$);
 * splitter.out.foo.connect(B.in.$);
 * splitter.out.bar.connect(C.in.$);
 */
export class Splitter<T extends IHash> implements ISink, ISource {
  public readonly in: TInPorts<ISplitterInputs<T>>;
  public readonly out: TOutPorts<T>;

  constructor(fields: Array<string>) {
    this.in = {
      $: new InPort("$", this)
    };
    this.out = <TOutPorts<T>> {};
    for (const field of fields) {
      this.out[field] = new OutPort(field, this);
    }
  }

  public send(port: IInPort<T>, input: T, tag?: string): void {
    if (port === this.in.$) {
      for (const [name, value] of Object.entries(input)) {
        this.out[name].send(value, tag);
      }
    }
  }
}
