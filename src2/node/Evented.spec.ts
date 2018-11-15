import {TEventPorts} from "../port";
import {Evented} from "./Evented";
import {IEvented} from "./IEvented";
import {Serviced} from "./Serviced";

describe("Evented", function () {
  class TestEvented implements IEvented {
    public readonly svc: TEventPorts<any>;

    constructor() {
      Serviced.init.call(this);
      Evented.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestEvented();
      expect(node.svc.evt).toBeDefined();
    });
  });
});
