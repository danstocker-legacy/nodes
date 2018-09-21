import {INode} from "./INode";
import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {Node} from "./Node";
import {OutPort} from "./OutPort";

class MyNode extends Node {
  public readonly in: { [key: string]: InPort<any> };
  public readonly out: { [key: string]: OutPort<any> };

  constructor() {
    super();
  }

  // tslint:disable:no-empty
  protected process(inputs: Inputs) {
  }
}

describe("InPort", function () {
  describe("constructor", function () {
    let node: INode;

    beforeEach(function () {
      node = new MyNode();
    });

    it("should set node property", function () {
      const port = new InPort<number>(node);
      expect(port.node).toBe(node);
    });
  });

  describe("#connect()", function () {
    let node1: INode;
    let node2: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node1 = new MyNode();
      node2 = new MyNode();
      outPort = new OutPort(node1);
      inPort = new InPort(node2);
    });

    it("should set peer", function () {
      inPort.connect(outPort);
      expect(inPort.peer).toBe(outPort);
    });

    it("should invoke #connect() on peer", function () {
      spyOn(outPort, "connect");
      inPort.connect(outPort);
      expect(outPort.connect).toHaveBeenCalledWith(inPort);
    });

    it("should invoke #onConnect() on node", function () {
      spyOn(node2, "onConnect");
      inPort.connect(outPort);
      expect(node2.onConnect).toHaveBeenCalledWith(outPort, inPort);
    });

    describe("when alredy connected", function () {
      let node3: MyNode;
      let outPort2: OutPort<number>;

      beforeEach(function () {
        node3 = new MyNode();
        outPort2 = new OutPort(node3);
        inPort.connect(outPort2);
      });

      it("should throw", function () {
        expect(function () {
          inPort.connect(outPort);
        }).toThrow();
      });
    });
  });

  describe("#disconnect()", function () {
    let node1: INode;
    let node2: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node1 = new MyNode();
      node2 = new MyNode();
      outPort = new OutPort(node1);
      inPort = new InPort(node2);
      inPort.connect(outPort);
    });

    it("should reset peer on self", function () {
      inPort.disconnect();
      expect(inPort.peer).toBeUndefined();
    });

    it("should invoke #disconnect() on peer", function () {
      spyOn(outPort, "disconnect");
      inPort.disconnect();
      expect(outPort.disconnect).toHaveBeenCalledWith(inPort);
    });

    it("should invoke #onDisconnect() on peer node", function () {
      spyOn(node2, "onDisconnect");
      inPort.disconnect();
      expect(node2.onDisconnect).toHaveBeenCalledWith(outPort, inPort);
    });
  });

  describe("#send()", function () {
    let node: INode;
    let port: InPort<number>;

    beforeEach(function () {
      node = new MyNode();
      port = new InPort(node);
    });

    it("should send value to node", function () {
      spyOn(node, "send");
      port.send(5, "100");
      expect(node.send).toHaveBeenCalledWith(new Map([[port, 5]]), "100");
    });
  });
});
