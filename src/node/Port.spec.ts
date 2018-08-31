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
  });

  describe("#connect()", function () {
    let source: Port<any>;
    let destination: Port<any>;
    let node1: INode;
    let node2: INode;

    beforeEach(function () {
      node1 = new Node();
      node2 = new Node();
      source = new Port(node1);
      destination = new Port(node2);
    });

    it("should set remote port as peer", function () {
      source.connect(destination);
      expect(source.peer).toBe(destination);
    });

    it("should add self as peer on peer", function () {
      source.connect(destination);
      expect(destination.peer).toBe(source);
    });

    describe("when already connected", function () {
      let node3: INode;
      let destination2: Port<any>;

      beforeEach(function () {
        node3 = new Node();
        destination2 = new Port(node3);
        source.connect(destination);
      });

      it("should disconnect peers", function () {
        source.connect(destination2);
        expect(destination.peer).toBeUndefined();
      });
    });
  });

  describe("#disconnect()", function () {
    let source: Port<any>;
    let destination: Port<any>;
    let node1: INode;
    let node2: INode;

    beforeEach(function () {
      node1 = new Node();
      node2 = new Node();
      source = new Port(node1);
      destination = new Port(node2);
      source.connect(destination);
    });

    describe("when disconnecting source", function () {
      it("should remove peers", function () {
        source.disconnect();
        expect(source.peer).toBeUndefined();
        expect(destination.peer).toBeUndefined();
      });
    });


    describe("when disconnecting destination", function () {
      it("should remove peers", function () {
        destination.disconnect();
        expect(source.peer).toBeUndefined();
        expect(destination.peer).toBeUndefined();
      });
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
    let source: Port<number>;
    let destination: Port<number>;
    let node1: INode;
    let node2: INode;

    beforeEach(function () {
      node1 = new Node();
      node2 = new Node();
      source = new Port(node1);
      destination = new Port(node2);
      source.connect(destination);
    });

    it("should pass value to peer", function () {
      spyOn(destination, "in");
      source.out(5);
      expect(destination.in).toHaveBeenCalledWith(5);
    });
  });
});
