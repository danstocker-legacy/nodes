import {IInPort, InPort, TInPorts} from "../port";
import {DynamicSink} from "./DynamicSink";
import {IDynamicSink} from "./IDynamicSink";
import {Sink} from "./Sink";

describe("DynamicSink", function () {
  class TestDynamicSink implements IDynamicSink {
    public readonly in: TInPorts<{ [key: string]: any }>;
    public addPort = DynamicSink.addPort;
    public deletePort = DynamicSink.deletePort;

    constructor() {
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

    describe("when port already added", function () {
      let port: InPort<number>;

      beforeEach(function () {
        port = new InPort("foo", node);
        node.addPort(port);
      });

      it("should not add port", function () {
        node.addPort(new InPort("bar", node), "2");
        expect(node.in.foo).toBe(port);
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
  });
});
