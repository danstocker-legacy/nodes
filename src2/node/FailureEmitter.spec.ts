import {TEventPorts, TFailurePorts} from "../port";
import {EventEmitter} from "./EventEmitter";
import {FailureEmitter} from "./FailureEmitter";
import {IFailureEmitter} from "./IFailureEmitter";
import {Serviced} from "./Serviced";
import {TNodeEventTypes} from "./TNodeEventTypes";

describe("FailureEmitter", function () {
  class TestFailureEmitter implements IFailureEmitter {
    public readonly svc: TEventPorts<TNodeEventTypes> & TFailurePorts<any>;

    constructor() {
      Serviced.init.call(this);
      EventEmitter.init.call(this);
      FailureEmitter.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestFailureEmitter();
      expect(node.svc.fail).toBeDefined();
    });
  });
});
