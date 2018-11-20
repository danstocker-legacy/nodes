import {TErrorPorts} from "../port";
import {ErrorSource} from "./ErrorSource";
import {EventSource} from "./EventSource";
import {IErrorSource} from "./IErrorSource";
import {Serviced} from "./Serviced";

describe("ErrorSource", function () {
  class TestErrorSource implements IErrorSource {
    public readonly svc: TErrorPorts<any>;

    constructor() {
      Serviced.init.call(this);
      EventSource.init.call(this);
      ErrorSource.init.call(this);
    }
  }

  describe("init()", function () {
    it("should add ports", function () {
      const node = new TestErrorSource();
      expect(node.svc.err).toBeDefined();
    });
  });
});
