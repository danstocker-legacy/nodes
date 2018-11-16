import {TEventPorts, TInPorts} from "../port";
import {EventEmitter} from "./EventEmitter";
import {ISink} from "./ISink";
import {Serviced} from "./Serviced";
import {Sink} from "./Sink";

describe("Sink", function () {
  class TestSink implements ISink {
    public readonly in: TInPorts<{ foo: number }>;
    public readonly svc: TEventPorts<any>;

    constructor() {
      Sink.init.call(this);
      Serviced.init.call(this);
      EventEmitter.init.call(this);
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
