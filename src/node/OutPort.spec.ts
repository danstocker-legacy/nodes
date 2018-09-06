import {INode} from "./INode";
import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {Node} from "./Node";
import {OutPort} from "./OutPort";
import {Ports} from "./Ports";

class MyNode extends Node {
  public readonly ports: Ports;

  constructor() {
    super();
    this.ports = {};
  }

  /* tslint:disable:no-empty */
  protected process(inputs: Inputs) {
  }
}

describe("OutPort", function () {
  describe("#connect()", function () {
    let node1: INode;
    let node2: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node1 = new MyNode();
      node2 = new MyNode();
      outPort = new OutPort();
      inPort = new InPort(node1);
    });

    it("should set peer", function () {
      outPort.connect(inPort);
      expect(outPort.peer).toBe(inPort);
    });

    describe("when already connected", function () {
      let node3: INode;
      let inPort2: InPort<number>;

      beforeEach(function () {
        node3 = new MyNode();
        inPort2 = new InPort(node3);
        outPort.connect(inPort);
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
      outPort = new OutPort();
      inPort = new InPort(node1);
      outPort.connect(inPort);
    });

    it("should reset peer on self", function () {
      outPort.disconnect();
      expect(outPort.peer).toBeUndefined();
    });
  });

  describe("#send()", function () {
    let node1: INode;
    let node2: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node1 = new MyNode();
      node2 = new MyNode();
      outPort = new OutPort();
      inPort = new InPort(node2);
      outPort.connect(inPort);
    });

    it("should send value to input node", function () {
      spyOn(inPort, "send");
      outPort.send(5, "100");
      expect(inPort.send).toHaveBeenCalledWith(5, "100");
    });
  });
});
