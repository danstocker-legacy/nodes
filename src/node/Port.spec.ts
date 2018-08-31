import {INode} from "./INode";
import {Port} from "./Port";

describe("Port", function () {
  class Node implements INode {
    public readonly ports: Object;

    constructor() {
      this.ports = {
        in: new Port<any>(this),
        out: new Port<any>(this)
      };
    }

    public in(port: Port<any>, value: string) {
    }
  }

  describe("new", function () {
    let node: INode;

    beforeAll(function () {
      node = new Node();
    });

    it("should initialize node", function () {
      const port = new Port(node);
      expect(port.node).toBe(node);
    });

    it("should initialize inputs", function () {
      const port = new Port(node);
      expect(port.inputs).toEqual([]);
    });

    it("should initialize outputs", function () {
      const port = new Port(node);
      expect(port.outputs).toEqual([]);
    });
  });

  describe("#connect()", function () {
    let sender: Port<any>;
    let receiver: Port<any>;
    let node1: INode;
    let node2: INode;

    beforeEach(function () {
      node1 = new Node();
      node2 = new Node();
      sender = new Port(node1);
      receiver = new Port(node2);
    });

    it("should add remote port to outputs", function () {
      sender.connect(receiver);
      expect(sender.outputs).toEqual([receiver]);
    });

    it("should add self to remote port's inputs", function () {
      sender.connect(receiver);
      expect(receiver.inputs).toEqual([sender]);
    });
  });

  describe("#in()", function () {
    let port: Port<any>;
    let node: INode;

    beforeEach(function () {
      node = new Node();
      port = new Port(node);
    });

    it("should invoke Node#in()", function () {
      spyOn(node, "in");
      port.in("foo");
      expect(node.in).toHaveBeenCalledWith(port, "foo");
    });
  });

  describe("#out()", function () {
    let sender: Port<number>;
    let receiver: Port<number>;
    let node1: INode;
    let node2: INode;

    beforeEach(function () {
      node1 = new Node();
      node2 = new Node();
      sender = new Port(node1);
      receiver = new Port(node2);
      sender.connect(receiver);
    });

    it("should pass value to outputs", function () {
      spyOn(receiver, "in");
      sender.out(5);
      expect(receiver.in).toHaveBeenCalledWith(5);
    });

    it("should set origin on output's input method", function () {
      sender.out(5);
      expect(receiver.in["origin"]).toBe(sender);
    });
  });
});
