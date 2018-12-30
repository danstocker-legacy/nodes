import {Noop} from "../nodes/o2o/sep";
import {InPort} from "./InPort";
import {OutPort} from "./OutPort";

describe("OutPort", function () {
  describe("#send()", function () {
    let local: Noop<number>;
    let remote1: Noop<number>;
    let remote2: Noop<number>;
    let localPort: OutPort<number>;
    let remotePort1: InPort<number>;
    let remotePort2: InPort<number>;

    beforeEach(function () {
      local = new Noop();
      remote1 = new Noop();
      remote2 = new Noop();
      localPort = new OutPort("foo", local);
      remotePort1 = new InPort("bar", remote1);
      remotePort2 = new InPort("bar", remote2);
      localPort.connect(remotePort1);
      localPort.connect(remotePort2);
    });

    it("should send value to input node", function () {
      spyOn(remotePort1, "send");
      spyOn(remotePort2, "send");
      localPort.send(5, "1");
      expect(remotePort1.send).toHaveBeenCalledWith(5, "1");
      expect(remotePort2.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
