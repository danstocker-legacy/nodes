import {IInPort, InPort, TErrorPorts, TEventPorts, TInPorts} from "../port";
import {DynamicSink} from "./DynamicSink";
import {Errorable} from "./Errorable";
import {IDynamicSink} from "./IDynamicSink";
import {Node} from "./Node";
import {Sink} from "./Sink";

describe("DynamicSink", function () {
  class TestDynamicSink extends Node implements IDynamicSink {
    public readonly in: TInPorts<{ [key: string]: any }>;
    public readonly svc: TEventPorts<any> & TErrorPorts<any>;
    public addPort = DynamicSink.addPort;
    public deletePort = DynamicSink.deletePort;

    constructor() {
      super();
      Sink.init.call(this);
      Errorable.init.call(this);
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
      let port: InPort<number>;

      beforeEach(function () {
        port = new InPort("foo", node);
        node.addPort(port);
      });

      it("should send error", function () {
        spyOn(node.svc.err, "send");
        node.addPort(port, "1");
        expect(node.svc.err.send).toHaveBeenCalledWith({
          payload: {
            node,
            port
          },
          type: "PORT_ADD_FAILURE"
        }, "1");
      });
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
