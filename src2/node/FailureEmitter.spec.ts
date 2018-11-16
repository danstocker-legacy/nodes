import {TEventPorts, TFailurePorts} from "../port";
import {FailureEmitter} from "./FailureEmitter";
import {IFailureEmitter} from "./IFailureEmitter";
import {Node} from "./Node";
import {TNodeEventTypes} from "./TNodeEventTypes";

describe("FailureEmitter", function () {
  class TestFailureEmitter extends Node implements IFailureEmitter {
    public readonly svc: TEventPorts<TNodeEventTypes> & TFailurePorts<any>;

    constructor() {
      super();
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
