import {TEventPorts, TOutPorts} from "../port";
import {EventSource} from "./EventSource";
import {ISource} from "./ISource";
import {Serviced} from "./Serviced";
import {Source} from "./Source";

describe("Source", function () {
  class TestSource implements ISource {
    public readonly out: TOutPorts<{ foo: number }>;
    public readonly svc: TEventPorts<any>;

    constructor() {
      Source.init.call(this);
      Serviced.init.call(this);
      EventSource.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add out property", function () {
      const node = new TestSource();
      expect(node.out).toBeDefined();
    });
  });
});
