import {TInBundle} from "../port";
import {ISink} from "./ISink";
import {MSink} from "./MSink";

describe("MSink", function () {
  class TestSink implements ISink {
    public readonly i: TInBundle<{ foo: number, bar: boolean }>;

    constructor() {
      MSink.init.call(this, ["foo", "bar"]);
    }

    public send(): void {
      //
    }
  }

  describe("init()", function () {
    it("should add i bundle", function () {
      const node = new TestSink();
      expect(node.i).toBeDefined();
      expect(node.i.foo).toBeDefined();
      expect(node.i.bar).toBeDefined();
    });
  });
});
