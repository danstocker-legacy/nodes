import {ISource} from "../node";
import {Noop} from "../nodes";
import {IInPort} from "./IInPort";
import {InPort} from "./InPort";
import {IOutPort} from "./IOutPort";
import {OutPort} from "./OutPort";

describe("OutPort", function () {
  class TestOutPort<V> extends OutPort<V> {
    constructor(name: string, node: ISource) {
      super(name, node);
    }
  }

  describe("constructor", function () {
    it("should set property 'peers'", function () {
      const node = <ISource> {};
      const port = new TestOutPort("foo", node);
      expect(port.peers).toEqual(new Set());
    });
  });

  describe("#connect()", function () {
    let local: Noop<number>;
    let remote: Noop<number>;
    let localPort: IOutPort<number>;
    let remotePort: IInPort<number>;

    beforeEach(function () {
      local = new Noop();
      remote = new Noop();
      localPort = new TestOutPort("foo", local);
      remotePort = new InPort("bar", remote);
    });

    it("should add to property 'peers'", function () {
      localPort.connect(remotePort, "1");
      expect(localPort.peers).toEqual(new Set([remotePort]));
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
    let localPort: IOutPort<number>;
    let remotePort: IInPort<number>;

    beforeEach(function () {
      local = new Noop();
      remote = new Noop();
      localPort = new TestOutPort("foo", local);
      remotePort = new InPort("bar", remote);
      localPort.connect(remotePort);
    });

    it("should set property 'peer'", function () {
      localPort.disconnect(remotePort, "1");
      expect(localPort.peers).toEqual(new Set());
    });

    it("should invoke #disconnect() on peer", function () {
      spyOn(remotePort, "disconnect");
      localPort.disconnect(remotePort, "1");
      expect(remotePort.disconnect).toHaveBeenCalledWith("1");
    });

    describe("when peer is omitted", function () {
      it("should disconnect all peers", function () {
        localPort.disconnect(null, "1");
        expect(localPort.peers).toEqual(new Set());
      });
    });
  });

  describe("#send()", function () {
    let local: Noop<number>;
    let remote1: Noop<number>;
    let remote2: Noop<number>;
    let localPort: TestOutPort<number>;
    let remotePort1: InPort<number>;
    let remotePort2: InPort<number>;

    beforeEach(function () {
      local = new Noop();
      remote1 = new Noop();
      remote2 = new Noop();
      localPort = new TestOutPort("foo", local);
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
