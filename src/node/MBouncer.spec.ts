import {TInBundle, TOutBundle} from "../port";
import {IBouncer} from "./IBouncer";
import {ISink} from "./ISink";
import {MBouncer} from "./MBouncer";
import {MSink} from "./MSink";

describe("MBouncer", function () {
  interface IInputs {
    foo: number;
    bar: boolean;
  }

  class TestBouncer implements IBouncer, ISink {
    public readonly i: TInBundle<IInputs>;
    public readonly b: TOutBundle<IInputs>;

    constructor() {
      MSink.init.call(this, ["foo", "bar"]);
      MBouncer.init.call(this, ["foo", "bar"]);
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
