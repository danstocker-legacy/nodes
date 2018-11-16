import {TEventPorts} from "../port";
import {EventEmitter} from "./EventEmitter";
import {IEventEmitter} from "./IEventEmitter";
import {Serviced} from "./Serviced";

describe("EventEmitter", function () {
  class TestEventEmitter implements IEventEmitter {
    public readonly svc: TEventPorts<any>;

    constructor() {
      Serviced.init.call(this);
      EventEmitter.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestEventEmitter();
      expect(node.svc.evt).toBeDefined();
    });
  });
});
