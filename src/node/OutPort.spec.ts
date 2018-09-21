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

describe("OutPort", function () {
  describe("#connect()", function () {
    let node: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node = new MyNode();
      outPort = new OutPort();
      inPort = new InPort(node);
    });

    it("should set peer", function () {
      outPort.connect(inPort);
      expect(outPort.peers).toEqual(new Set([inPort]));
    });

    it("should invoke #onConnect() on peer node", function () {
      spyOn(node, "onConnect");
      outPort.connect(inPort);
      expect(node.onConnect).toHaveBeenCalledWith(outPort, inPort);
    });
  });

  describe("#disconnect()", function () {
    let node: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node = new MyNode();
      outPort = new OutPort();
      inPort = new InPort(node);
      outPort.connect(inPort);
    });

    it("should reset peer on self", function () {
      outPort.disconnect(inPort);
      expect(outPort.peers).toEqual(new Set());
    });

    it("should invoke #onDisconnect() on peer node", function () {
      spyOn(node, "onDisconnect");
      outPort.disconnect(inPort);
      expect(node.onDisconnect).toHaveBeenCalledWith(outPort, inPort);
    });
  });

  describe("#send()", function () {
    let node: INode;
    let outPort: OutPort<number>;
    let inPort: InPort<number>;

    beforeEach(function () {
      node = new MyNode();
      outPort = new OutPort();
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
