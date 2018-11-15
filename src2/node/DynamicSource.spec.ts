import {IOutPort, OutPort, TOutPorts} from "../port";
import {DynamicSource} from "./DynamicSource";
import {IDynamicSource} from "./IDynamicSource";
import {Node} from "./Node";
import {Source} from "./Source";

describe("DynamicSource", function () {
  class TestDynamicSource extends Node implements IDynamicSource {
    public readonly out: TOutPorts<{ [key: string]: any }>;
    public addPort = DynamicSource.addPort;
    public deletePort = DynamicSource.deletePort;

    constructor() {
      super();
      Source.init.call(this);
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
      // TODO: Add test once error port is added
      it("should send error");
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
