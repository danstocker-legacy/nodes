import {IInPort, TInBundle, TOutBundle} from "../port";
import {ValueOf} from "../utils";
import {IBouncer} from "./IBouncer";
import {ISink} from "./ISink";
import {MBouncer} from "./MBouncer";
import {MSink} from "./MSink";

describe("MBouncer", function () {
  interface ITestBouncerInputs {
    foo: number;
    bar: boolean;
  }

  class TestBouncer implements IBouncer, ISink {
    public readonly i: TInBundle<ITestBouncerInputs>;
    public readonly b: TOutBundle<ITestBouncerInputs>;

    constructor() {
      MSink.init.call(this, ["foo", "bar"]);
      MBouncer.init.call(this, ["foo", "bar"]);
    }

    public send(
      port: IInPort<ValueOf<ITestBouncerInputs>>,
      value: ValueOf<ITestBouncerInputs>,
      tag?: string
    ): void {
      //
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestBouncer();
      expect(node.b.foo).toBeDefined();
      expect(node.b.bar).toBeDefined();
    });
  });
});
