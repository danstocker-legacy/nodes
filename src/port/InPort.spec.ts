import {Noop} from "../nodes";
import {IInPort} from "./IInPort";
import {InPort} from "./InPort";
import {IOutPort} from "./IOutPort";
import {OutPort} from "./OutPort";

describe("InPort", function () {
  describe("#connect()", function () {
    let local: Noop<number>;
    let remote: Noop<number>;
    let localPort: IInPort<number>;
    let remotePort: IOutPort<number>;

    beforeEach(function () {
      local = new Noop();
      remote = new Noop();
      localPort = new InPort("foo", local);
      remotePort = new OutPort("bar", remote);
    });

    it("should set property 'peer'", function () {
      localPort.connect(remotePort, "1");
      expect(localPort.peer).toBe(remotePort);
    });

    it("should invoke #connect() on peer", function () {
      spyOn(remotePort, "connect");
      localPort.connect(remotePort, "1");
      expect(remotePort.connect).toHaveBeenCalledWith(localPort, "1");
    });
  });

  describe("#disconnect()", function () {
    let local: Noop<number>;
    let remote: Noop<number>;
    let localPort: IInPort<number>;
    let remotePort: IOutPort<number>;

    beforeEach(function () {
      local = new Noop();
      remote = new Noop();
      localPort = new InPort("foo", local);
      remotePort = new OutPort("bar", remote);
      localPort.connect(remotePort);
    });

    it("should set property 'peer'", function () {
      localPort.disconnect("1");
      expect(localPort.peer).toBeUndefined();
    });

    it("should invoke #disconnect() on peer", function () {
      spyOn(remotePort, "disconnect");
      localPort.disconnect("1");
      expect(remotePort.disconnect).toHaveBeenCalledWith(localPort, "1");
    });
  });

  describe("#send()", function () {
    let local: Noop<number>;
    let localPort: InPort<number>;

    beforeEach(function () {
      local = new Noop();
      localPort = new InPort("foo", local);
    });

    it("should send value to node", function () {
      spyOn(local, "send");
      localPort.send(5, "1");
      expect(local.send).toHaveBeenCalledWith(localPort, 5, "1");
    });
  });
});
