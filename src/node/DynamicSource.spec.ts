import {IOutPort, OutPort, TErrorPorts, TEventPorts, TOutPorts} from "../port";
import {DynamicSource} from "./DynamicSource";
import {ErrorSource} from "./ErrorSource";
import {EventSource} from "./EventSource";
import {IDynamicSource} from "./IDynamicSource";
import {IErrorSource} from "./IErrorSource";
import {IEventSource} from "./IEventSource";
import {Serviced} from "./Serviced";
import {Source} from "./Source";

describe("DynamicSource", function () {
  class TestDynamicSource implements IDynamicSource, IEventSource, IErrorSource {
    public readonly out: TOutPorts<{ [key: string]: any }>;
    public readonly svc:
      TEventPorts<DynamicSource.TEventTypes> &
      TErrorPorts<DynamicSource.TErrorTypes>;
    public addPort = DynamicSource.addPort;
    public deletePort = DynamicSource.deletePort;

    constructor() {
      Source.init.call(this);
      Serviced.init.call(this);
      EventSource.init.call(this);
      ErrorSource.init.call(this);
    }
  }

  describe("addPort()", function () {
    let node: TestDynamicSource;

    beforeEach(function () {
      node = new TestDynamicSource();
    });

    it("should add port", function () {
      const port = new OutPort("foo", node);
      node.addPort(port);
      expect(node.out.foo).toBe(port);
    });

    it("should emit PORT_ADD event", function () {
      const port = new OutPort("foo", node);
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
      let port: OutPort<number>;

      beforeEach(function () {
        port = new OutPort("foo", node);
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
    let node: TestDynamicSource;
    let port: IOutPort<number>;

    beforeEach(function () {
      node = new TestDynamicSource();
      port = new OutPort("foo", node);
      node.addPort(port);
    });

    it("should remove port", function () {
      node.deletePort(port);
      expect(node.out.foo).toBeUndefined();
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
