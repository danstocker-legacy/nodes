import {TInPorts} from "../port";
import {ISink} from "./ISink";
import {Sink} from "./Sink";

describe("Sink", function () {
  class TestSink implements ISink {
    public readonly in: TInPorts<{ foo: number }>;

    constructor() {
      Sink.init.call(this, ["foo"]);
    }

    public send(): void {
      //
    }
  }

  describe("init()", function () {
    it("should add out property", function () {
      const node = new TestSink();
      expect(node.in).toBeDefined();
    });
  });
});
