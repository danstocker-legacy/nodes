import {IInPort, TInPorts, TOutPorts} from "../port";
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
    public readonly in: TInPorts<ITestBouncerInputs>;
    public readonly bounced: TOutPorts<ITestBouncerInputs>;

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
      expect(node.bounced.foo).toBeDefined();
      expect(node.bounced.bar).toBeDefined();
    });
  });

  describe("bounce()", function () {
    let node: TestBouncer;

    beforeEach(function () {
      node = new TestBouncer();
    });

    it("should send input to bounce bundle", function () {
      spyOn(node.bounced.foo, "send");
      MBouncer.bounce.call(node, node.in.foo, 5, "1");
      expect(node.bounced.foo.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
