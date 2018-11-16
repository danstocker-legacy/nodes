import {TOutPorts} from "../port";
import {IServiced} from "./IServiced";
import {Serviced} from "./Serviced";

describe("Serviced", function () {
  class TestServiced implements IServiced {
    public readonly svc: TOutPorts<{ foo: number }>;

    constructor() {
      Serviced.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add out property", function () {
      const node = new TestServiced();
      expect(node.svc).toBeDefined();
    });
  });
});
