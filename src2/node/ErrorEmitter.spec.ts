import {TErrorPorts, TEventPorts} from "../port";
import {ErrorEmitter} from "./ErrorEmitter";
import {EventEmitter} from "./EventEmitter";
import {IErrorEmitter} from "./IErrorEmitter";
import {Serviced} from "./Serviced";
import {TNodeEventTypes} from "./TNodeEventTypes";

describe("ErrorEmitter", function () {
  class TestErrorEmitter implements IErrorEmitter {
    public readonly svc: TEventPorts<TNodeEventTypes> & TErrorPorts<any>;

    constructor() {
      Serviced.init.call(this);
      EventEmitter.init.call(this);
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
