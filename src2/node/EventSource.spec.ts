import {TEventPorts} from "../port";
import {EventSource} from "./EventSource";
import {IEventSource} from "./IEventSource";
import {Serviced} from "./Serviced";

describe("EventSource", function () {
  class TestEventSource implements IEventSource {
    public readonly svc: TEventPorts<any>;

    constructor() {
      Serviced.init.call(this);
      EventSource.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestEventSource();
      expect(node.svc.evt).toBeDefined();
    });
  });
});
