import {TInBundle} from "../port";
import {ISink} from "./ISink";
import {MSink} from "./MSink";

describe("MSink", function () {
  class TestSink implements ISink {
    public readonly i: TInBundle<{ foo: number }>;

    constructor() {
      MSink.init.call(this, ["foo"]);
    }

    public send(): void {
      //
    }
  }

  describe("init()", function () {
    it("should add out property", function () {
      const node = new TestSink();
      expect(node.i).toBeDefined();
    });
  });
});
