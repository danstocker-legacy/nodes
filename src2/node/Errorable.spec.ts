import {TErrorPorts, TEventPorts} from "../port";
import {Errorable} from "./Errorable";
import {IErrorable} from "./IErrorable";
import {Node} from "./Node";
import {TNodeEventTypes} from "./TNodeEventTypes";

describe("Errorable", function () {
  class TestErrorable extends Node implements IErrorable {
    public readonly svc: TEventPorts<TNodeEventTypes> & TErrorPorts<any>;

    constructor() {
      super();
      Errorable.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestErrorable();
      expect(node.svc.err).toBeDefined();
    });
  });
});
