import {ISource} from "../node";
import {Noop} from "../nodes";
import {IInPort} from "./IInPort";
import {InPort} from "./InPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

describe("Port", function () {
  class TestPort<V> extends Port<V> {
    constructor(name: string, node: any) {
      super(name, node);
    }

    public send(value: V, tag?: string): void {
      //
    }
  }

  describe("constructor", function () {
    it("should initialize property 'name'", function () {
      const node = {};
      const port = new TestPort("foo", node);
      expect(port.name).toBe("foo");
    });

    it("should initialize property 'node'", function () {
      const node = {};
      const port = new TestPort("foo", node);
      expect(port.node).toBe(node);
    });

    it("should set property 'peers'", function () {
      const node = {} as ISource;
      const port = new TestPort("foo", node);
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
      localPort = new TestPort("foo", local);
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
      localPort = new TestPort("foo", local);
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
      expect(remotePort.disconnect).toHaveBeenCalledWith(localPort, "1");
    });

    describe("when peer is omitted", function () {
      it("should disconnect all peers", function () {
        localPort.disconnect(null, "1");
        expect(localPort.peers).toEqual(new Set());
      });
    });
  });
});
