import {TInPorts} from "../port";
import {ISink} from "./ISink";
import {Node} from "./Node";
import {Sink} from "./Sink";

describe("Sink", function () {
  class TestSink extends Node implements ISink {
    public readonly in: TInPorts<{ foo: number }>;

    constructor() {
      super();
      Sink.init.call(this);
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
