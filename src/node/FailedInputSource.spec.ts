import {TFailedInputPorts} from "../port";
import {FailedInputSource} from "./FailedInputSource";
import {IFailedInputSource} from "./IFailedInputSource";
import {Serviced} from "./Serviced";

describe("FailedInputSource", function () {
  class TestFailedInputSource implements IFailedInputSource {
    public readonly svc: TFailedInputPorts<any>;

    constructor() {
      Serviced.init.call(this);
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
