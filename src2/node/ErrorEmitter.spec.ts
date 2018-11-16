import {TErrorPorts, TEventPorts} from "../port";
import {ErrorEmitter} from "./ErrorEmitter";
import {IErrorEmitter} from "./IErrorEmitter";
import {Node} from "./Node";
import {TNodeEventTypes} from "./TNodeEventTypes";

describe("ErrorEmitter", function () {
  class TestErrorEmitter extends Node implements IErrorEmitter {
    public readonly svc: TEventPorts<TNodeEventTypes> & TErrorPorts<any>;

    constructor() {
      super();
      ErrorEmitter.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestErrorEmitter();
      expect(node.svc.err).toBeDefined();
    });
  });
});
