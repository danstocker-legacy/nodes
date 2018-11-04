import {Noop} from "../forwarders";
import {INode} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {OutPort} from "./OutPort";
import {StaticInPort} from "./StaticInPort";

describe("OutPort", function () {
  class TestOutPort<T> extends OutPort<T> {
    constructor(name: string, node: INode) {
      super(name, node);
    }
  }

  describe("constructor", function () {
    it("should set property 'in'", function () {
      const node = <INode> {};
      const port = new TestOutPort("foo", node);
      expect(port.out).toBe(true);
    });

    it("should set property 'peers'", function () {
      const node = <INode> {};
      const port = new TestOutPort("foo", node);
      expect(port.peers).toEqual(new Set());
    });
  });

  describe("#connect()", function () {
    let local: Noop;
    let remote: Noop;
    let localPort: IOutPort<number>;
    let remotePort: IInPort<number>;

    beforeEach(function () {
      local = new Noop();
      remote = new Noop();
      localPort = new TestOutPort("foo", local);
      remotePort = new StaticInPort("bar", remote);
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

    it("should invoke #onConnect() on node", function () {
      spyOn(local, "onConnect");
      localPort.connect(remotePort, "1");
      expect(local.onConnect).toHaveBeenCalledWith(localPort, remotePort, "1");
    });
  });

  describe("#disconnect()", function () {
    let local: Noop;
    let remote: Noop;
    let localPort: IOutPort<number>;
    let remotePort: IInPort<number>;

    beforeEach(function () {
      local = new Noop();
      remote = new Noop();
      localPort = new TestOutPort("foo", local);
      remotePort = new StaticInPort("bar", remote);
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

    it("should invoke #onDisconnect() on node", function () {
      spyOn(local, "onDisconnect");
      localPort.disconnect(remotePort, "1");
      expect(local.onDisconnect).toHaveBeenCalledWith(localPort, remotePort, "1");
    });

    describe("when peer is omitted", function () {
      it("should disconnect all peers", function () {
        localPort.disconnect(null, "1");
        expect(localPort.peers).toEqual(new Set());
      });
    });
  });
});
