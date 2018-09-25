import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {NodeBase} from "./NodeBase";
import {OutPort} from "./OutPort";

class MyNode extends NodeBase {
  public readonly in: { [key: string]: InPort<any> };
  public readonly out: { [key: string]: OutPort<any> };

  constructor() {
    super();
  }

  // tslint:disable:no-empty
  protected process(inputs: Inputs) {
  }
}

describe("OutPort", function () {
  describe("constructor", function () {
    let node: NodeBase;

    beforeEach(function () {
      node = new MyNode();
    });

    it("should set node property", function () {
      const port = new OutPort<number>(node);
      expect(port.node).toBe(node);
    });
  });

  describe("#connect()", function () {
    let node1: NodeBase;
    let node2: NodeBase;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node1 = new MyNode();
      node2 = new MyNode();
      outPort = new OutPort(node1);
      inPort = new InPort(node2);
    });

    it("should set peer", function () {
      outPort.connect(inPort);
      expect(outPort.peers).toEqual(new Set([inPort]));
    });

    it("should invoke #connect() on peer", function () {
      spyOn(inPort, "connect");
      outPort.connect(inPort);
      expect(inPort.connect).toHaveBeenCalledWith(outPort);
    });

    it("should invoke #onConnect() on node", function () {
      spyOn(node1, "onConnect");
      outPort.connect(inPort);
      expect(node1.onConnect).toHaveBeenCalledWith(outPort, inPort);
    });
  });

  describe("#disconnect()", function () {
    let node1: NodeBase;
    let node2: NodeBase;
    let node3: MyNode;
    let outPort: OutPort<number>;
    let inPort1: InPort<number>;
    let inPort2: InPort<number>;

    beforeEach(function () {
      node1 = new MyNode();
      node2 = new MyNode();
      node3 = new MyNode();
      outPort = new OutPort(node1);
      inPort1 = new InPort(node2);
      inPort2 = new InPort(node3);
      outPort.connect(inPort1);
      outPort.connect(inPort2);
    });

    it("should reset peer on self", function () {
      outPort.disconnect(inPort1);
      expect(outPort.peers).toEqual(new Set([inPort2]));
    });

    it("should invoke #disconnect() on peer", function () {
      spyOn(inPort1, "disconnect");
      outPort.disconnect(inPort1);
      expect(inPort1.disconnect).toHaveBeenCalled();
    });

    it("should invoke #onDisconnect() on node", function () {
      spyOn(node1, "onDisconnect");
      outPort.disconnect(inPort1);
      expect(node1.onDisconnect).toHaveBeenCalledWith(outPort, inPort1);
    });

    describe("when peer is omitted", function () {
      it("should disconnect all peers", function () {
        outPort.disconnect();
        expect(outPort.peers).toEqual(new Set());
      });
    });
  });

  describe("#send()", function () {
    let node: NodeBase;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node = new MyNode();
      outPort = new OutPort(node);
      inPort = new InPort(node);
      outPort.connect(inPort);
    });

    it("should send value to input node", function () {
      spyOn(inPort, "send");
      outPort.send(5, "100");
      expect(inPort.send).toHaveBeenCalledWith(5, "100");
    });
  });
});
