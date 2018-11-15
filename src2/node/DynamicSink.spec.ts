import {IInPort, InPort, TInPorts} from "../port";
import {DynamicSink} from "./DynamicSink";
import {IDynamicSink} from "./IDynamicSink";
import {Node} from "./Node";
import {Sink} from "./Sink";

describe("DynamicSink", function () {
  class TestDynamicSink extends Node implements IDynamicSink {
    public readonly in: TInPorts<{ [key: string]: any }>;
    public addPort = DynamicSink.addPort;
    public deletePort = DynamicSink.deletePort;

    constructor() {
      super();
      Sink.init.call(this);
    }

    public send(): void {
      //
    }
  }

  describe("addPort()", function () {
    let node: TestDynamicSink;

    beforeEach(function () {
      node = new TestDynamicSink();
    });

    it("should add port", function () {
      const port = new InPort("foo", node);
      node.addPort(port);
      expect(node.in.foo).toBe(port);
    });

    it("should emit PORT_ADD event", function () {
      const port = new InPort("foo", node);
      spyOn(node.svc.evt, "send");
      node.addPort(port, "1");
      expect(node.svc.evt.send).toHaveBeenCalledWith({
        payload: {
          node,
          port
        },
        type: "PORT_ADD"
      }, "1");
    });

    describe("when port already added", function () {
      // TODO: Add test once error port is added
      it("should send error");
    });
  });

  describe("deletePort()", function () {
    let node: TestDynamicSink;
    let port: IInPort<number>;

    beforeEach(function () {
      node = new TestDynamicSink();
      port = new InPort("foo", node);
      node.addPort(port);
    });

    it("should remove port", function () {
      node.deletePort(port);
      expect(node.in.foo).toBeUndefined();
    });

    it("should emit PORT_DELETE event", function () {
      spyOn(node.svc.evt, "send");
      node.deletePort(port, "1");
      expect(node.svc.evt.send).toHaveBeenCalledWith({
        payload: {
          node,
          port
        },
        type: "PORT_DELETE"
      }, "1");
    });
  });
});
