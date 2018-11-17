import {TEventPorts, TFailurePorts} from "../port";
import {EventSource} from "./EventSource";
import {FailedInputSource} from "./FailedInputSource";
import {IFailedInputSource} from "./IFailedInputSource";
import {Serviced} from "./Serviced";
import {TNodeEventTypes} from "./TNodeEventTypes";

describe("FailedInputSource", function () {
  class TestFailedInputSource implements IFailedInputSource {
    public readonly svc: TEventPorts<TNodeEventTypes> & TFailurePorts<any>;

    constructor() {
      Serviced.init.call(this);
      EventSource.init.call(this);
      FailedInputSource.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestFailedInputSource();
      expect(node.svc.fail).toBeDefined();
    });
  });
});
