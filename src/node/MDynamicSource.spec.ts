import {IOutPort, OutPort, TOutPorts} from "../port";
import {IDynamicSource} from "./IDynamicSource";
import {MDynamicSource} from "./MDynamicSource";
import {MSource} from "./MSource";

describe("MDynamicSource", function () {
  class TestDynamicSource implements IDynamicSource {
    public readonly out: TOutPorts<{ [key: string]: any }>;
    public addPort = MDynamicSource.addPort;
    public deletePort = MDynamicSource.deletePort;

    constructor() {
      MSource.init.call(this);
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

    describe("when port already added", function () {
      let port: OutPort<number>;

      beforeEach(function () {
        port = new OutPort("foo", node);
        node.addPort(port);
      });

      it("should not add port", function () {
        node.addPort(new OutPort("bar", node));
        expect(node.out.foo).toBe(port);
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
  });
});