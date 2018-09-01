import {OutPort} from "./OutPort";
import {INode} from "./INode";
import {InPort} from "./InPort";

class Node implements INode {
  public readonly ports: Object;

  constructor() {
    this.ports = {};
  }

  public send(port: InPort<any>, value: string) {
  }
}

describe("OutPort", function () {
  describe("constructor", function () {
    let node: INode;

    beforeEach(function () {
      node = new Node();
    });

    it("should set node property", function () {
      const port: OutPort<number> = new OutPort(node);
      expect(port.node).toBe(node);
    });
  });

  describe("#connect()", function () {
    let node1: INode;
    let node2: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node1 = new Node();
      node2 = new Node();
      outPort = new OutPort(node1);
      inPort = new InPort(node1);
    });

    it("should set peer", function () {
      outPort.connect(inPort);
      expect(outPort.peer).toBe(inPort);
      expect(inPort.peer).toBe(outPort);
    });

    describe("when already connected", function () {
      let node3: INode;
      let inPort2: InPort<number>;

      beforeEach(function () {
        node3 = new Node();
        inPort2 = new InPort(node3);
        outPort.connect(inPort);
      });

      it("should disconnect first", function () {
        outPort.connect(inPort2);
        expect(inPort.peer).toBeUndefined();
      });
    });
  });

  describe("#disconnect()", function () {
    let node1: INode;
    let node2: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node1 = new Node();
      node2 = new Node();
      outPort = new OutPort(node1);
      inPort = new InPort(node1);
      outPort.connect(inPort);
    });

    it("should reset peer on self", function () {
      outPort.disconnect();
      expect(outPort.peer).toBeUndefined();
    });

    it("should reset peer on peer", function () {
      outPort.disconnect();
      expect(inPort.peer).toBeUndefined();
    });
  });

  describe("#send()", function () {
    let node1: INode;
    let node2: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node1 = new Node();
      node1 = new Node();
      outPort = new OutPort(node1);
      inPort = new InPort(node2);
      outPort.connect(inPort);
    });

    it("should send value to input node", function () {
      spyOn(inPort, "send");
      outPort.send(5);
      expect(inPort.send).toHaveBeenCalledWith(5);
    });
  });
});
