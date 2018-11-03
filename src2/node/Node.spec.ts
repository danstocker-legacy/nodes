import {
  DynamicInPort,
  DynamicOutPort,
  DynamicPorts,
  IInPort,
  IOutPort,
  StaticInPort,
  StaticOutPort,
  StaticPorts
} from "../port";
import {Node} from "./Node";

describe("Node", function () {
  class TestNode extends Node {
    public readonly in: StaticPorts<IInPort<any>, "$"> & DynamicPorts<IInPort<any>>;
    public readonly out: StaticPorts<IOutPort<any>, "$"> & DynamicPorts<IOutPort<any>>;

    constructor() {
      super();
    }

    public send<T>(port: IInPort<T>, value: T, tag?: string): void {
      //
    }
  }

  describe("constructor", function () {
    it("should initialize property 'in'", function () {
      const node = new TestNode();
      expect(node.in).toBeDefined();
    });

    it("should initialize property 'out'", function () {
      const node = new TestNode();
      expect(node.out).toBeDefined();
    });
  });

  describe("#addPort()", function () {
    let node: TestNode;

    beforeEach(function () {
      node = new TestNode();
    });

    describe("when passing input port", function () {
      it("should add port to 'in'", function () {
        const port = new StaticInPort("$", node);
        node.addPort(port);
        expect(node.in.$).toBe(port);
      });
    });

    describe("when passing output port", function () {
      it("should add port to 'out'", function () {
        const port = new StaticOutPort("$", node);
        node.addPort(port);
        expect(node.out.$).toBe(port);
      });
    });
  });

  describe("#deletePort()", function () {
    let node: TestNode;

    beforeEach(function () {
      node = new TestNode();
      node.addPort(new DynamicInPort(1, node));
      node.addPort(new DynamicOutPort(1, node));
    });

    describe("when passing input port", function () {
      it("should delete port from 'in'", function () {
        node.deletePort(node.in[1]);
        expect(node.in[1]).toBeUndefined();
      });
    });

    describe("when passing output port", function () {
      it("should delete port from 'out'", function () {
        node.deletePort(node.out[1]);
        expect(node.out[1]).toBeUndefined();
      });
    });
  });
});
